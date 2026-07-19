import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 設定ファイルの読み込み
const configPath = path.join(__dirname, 'deploy-config.json');

// 色付き出力用ユーティリティ
const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  error: (msg) => console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
};

function main() {
  const isDryRun = process.argv.includes('--dry-run');
  if (isDryRun) {
    log.info('--- DRY RUN MODE (AWSへの実際の書き込みは行われません) ---');
  }

  // 1. 設定ファイルの存在確認
  if (!fs.existsSync(configPath)) {
    log.error('deploy-config.json が見つかりません。');
    log.info('deploy-config.example.json をコピーして deploy-config.json を作成し、適切な設定値を入力してください。');
    process.exit(1);
  }

  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (e) {
    log.error(`deploy-config.json のパースに失敗しました: ${e.message}`);
    process.exit(1);
  }

  // 設定値のプレースホルダーチェック
  const placeholders = ['YOUR_LAMBDA_FUNCTION_NAME', 'YOUR_AMPLIFY_APP_ID', 'YOUR_API_GATEWAY_URL'];
  const hasPlaceholders = Object.values(config).some(val => typeof val === 'string' && placeholders.some(ph => val.includes(ph)));

  if (hasPlaceholders) {
    log.warn('deploy-config.json にプレースホルダー値が含まれています。');
    log.warn('有効なAWSリソース情報を deploy-config.json に記述してから再度実行してください。');
    if (!isDryRun) {
      log.error('デプロイを中断します。');
      process.exit(1);
    }
  }

  // AWS認証チェック
  log.info('AWS CLIの認証状態を確認中...');
  let hasAwsAuth = false;
  try {
    const identity = execSync('aws sts get-caller-identity --output json', { stdio: 'pipe' }).toString();
    const parsed = JSON.parse(identity);
    log.success(`AWS認証成功: Account=${parsed.Account}, Arn=${parsed.Arn}`);
    hasAwsAuth = true;
  } catch (err) {
    log.error('AWS CLIの認証情報が無効であるか、接続できませんでした。');
    log.info('ターミナルで `aws configure` コマンドを実行し、正しいアクセスキーを設定してください。');
    if (!isDryRun) {
      process.exit(1);
    }
  }

  // 2. フロントエンドのビルド
  log.info(`フロントエンドのビルドを開始します... (API Gateway: ${config.apiGatewayUrl})`);
  try {
    // API GatewayのURLを環境変数として渡してViteビルドを実行
    execSync('npm run build', {
      stdio: 'inherit',
      env: {
        ...process.env,
        VITE_API_GATEWAY_URL: config.apiGatewayUrl
      }
    });
    log.success('フロントエンドのビルドが完了しました。');
  } catch (err) {
    log.error(`フロントエンドのビルドに失敗しました: ${err.message}`);
    process.exit(1);
  }

  // 3. フロントエンドのパッケージング (dist.zip)
  log.info('フロントエンドアセット (dist/) を圧縮中...');
  const distZipPath = path.join(__dirname, 'dist.zip');
  if (fs.existsSync(distZipPath)) fs.unlinkSync(distZipPath);

  try {
    // Macのzipコマンドを使用して圧縮
    execSync('cd dist && zip -r ../dist.zip * > /dev/null && cd ..');
    log.success('dist.zip を作成しました。');
  } catch (err) {
    log.error(`フロントエンドの圧縮に失敗しました: ${err.message}`);
    process.exit(1);
  }

  // 4. バックエンドのパッケージング (lambda.zip)
  log.info('バックエンド (lambda/index.js) を圧縮中...');
  const lambdaZipPath = path.join(__dirname, 'lambda.zip');
  if (fs.existsSync(lambdaZipPath)) fs.unlinkSync(lambdaZipPath);

  try {
    // lambda ディレクトリに入って zip 圧縮
    execSync('cd lambda && zip -r ../lambda.zip * > /dev/null && cd ..');
    log.success('lambda.zip を作成しました。');
  } catch (err) {
    log.error(`バックエンドの圧縮に失敗しました: ${err.message}`);
    process.exit(1);
  }

  // 5. AWSへのデプロイ
  if (isDryRun) {
    log.info('[DRY RUN] デプロイ処理の実行をシミュレートします。');
    log.success('[DRY RUN] AWS Amplify のデプロイをシミュレートしました。');
    log.success('[DRY RUN] AWS Lambda の更新をシミュレートしました。');
    cleanup();
    log.success('デプロイプロセスのシミュレーションがすべて完了しました！');
    return;
  }

  // 本番デプロイ
  try {
    // A. Lambdaのデプロイ
    log.info(`Lambda関数 [${config.lambdaFunctionName}] を更新中...`);
    execSync(`aws lambda update-function-code --function-name ${config.lambdaFunctionName} --zip-file fileb://lambda.zip --region ${config.awsRegion}`, { stdio: 'inherit' });
    log.success('Lambda関数のコードを更新しました。');

    // B. Amplify Hostingのデプロイ
    log.info(`Amplify Hosting [AppId: ${config.amplifyAppId}, Branch: ${config.amplifyBranchName}] デプロイ作成中...`);
    
    try {
      // デプロイジョブの作成
      const createDeployRes = execSync(`aws amplify create-deployment --app-id ${config.amplifyAppId} --branch-name ${config.amplifyBranchName} --output json`, { stdio: 'pipe' }).toString();
      const deployData = JSON.parse(createDeployRes);
      const { jobId, zipUploadUrl } = deployData;
      
      log.info('Amplify Hostingへアセットをアップロード中...');
      // curl コマンドを使って zip ファイルをアップロード
      execSync(`curl --upload-file dist.zip "${zipUploadUrl}"`, { stdio: 'inherit' });
      
      log.info(`Amplify デプロイジョブ [JobId: ${jobId}] を開始中...`);
      // デプロイの確定
      execSync(`aws amplify start-deployment --app-id ${config.amplifyAppId} --branch-name ${config.amplifyBranchName} --job-id ${jobId}`, { stdio: 'inherit' });
      
      log.success('Amplify Hostingへのデプロイを開始しました！コンソールで進捗を確認してください。');
    } catch (amplifyErr) {
      const errMsg = amplifyErr.stdout ? amplifyErr.stdout.toString() : (amplifyErr.message || '');
      const errStderr = amplifyErr.stderr ? amplifyErr.stderr.toString() : '';
      
      if (errMsg.includes('Operation not supported') || errStderr.includes('Operation not supported')) {
        log.warn('Amplify アプリはすでにGitHubなどのリポジトリに連携されています。');
        log.info('ローカルの変更を Git にコミットして Push することで、Amplify が自動的にフロントエンドをビルド＆デプロイします。');
        log.info('※ Lambda関数（バックエンド）のコードは、すでに今回の最新版に更新されています。');
      } else {
        throw amplifyErr;
      }
    }

    cleanup();
    log.success('デプロイプロセスが正常に完了しました！');
  } catch (err) {
    log.error(`AWSデプロイ中にエラーが発生しました: ${err.message}`);
    cleanup();
    process.exit(1);
  }
}

function cleanup() {
  log.info('一時ファイルのクリーンアップ中...');
  const distZip = path.join(__dirname, 'dist.zip');
  const lambdaZip = path.join(__dirname, 'lambda.zip');
  if (fs.existsSync(distZip)) fs.unlinkSync(distZip);
  if (fs.existsSync(lambdaZip)) fs.unlinkSync(lambdaZip);
  log.success('クリーンアップ完了。');
}

main();
