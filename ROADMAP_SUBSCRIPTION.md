# 宇宙クイズ-AI: 課金制サービス化ロードマップ＆進捗管理ドキュメント

本ドキュメントは、「宇宙クイズ-AI」を **AWSマネージド最安値構成**（Amplify Hosting, Route 53）で課金制・独自ドメインサービスとして正式ローンチするための進捗状況および残タスクの全体一覧です。

---

## 1. 全体方針・基本ルール

1. **AWSマネージド最安値・固定費極小運用**:
   - 開発・テスト期間: **完全無料（¥0）**
   - 本番ローンチ後の固定費: **月額 約250円**
     - **独自ドメイン（Route 53 Domains）**: 年額 約$14〜$15（月換算 約175円）
     - **DNS管理（Route 53 Hosted Zone）**: 月額 $0.50（約75円）
     - **ホスティング（AWS Amplify Hosting）**: 実質 ¥0（無料枠または月数十円以下）
   - DB/認証（Supabase Free Tier: ¥0）、決済（Stripe ※売上手数料3.6%のみ）、AIバックエンド（AWS Lambda Free Tier: ¥0）は既存構築済みの構成をそのまま活用。
2. **既存ユーザー（息子さん）の環境保護**:
   - 本番ブランチ（`main` / AWS Amplify）は現状維持（息子さん用無制限プレイ状態）。
   - 課金・制限機能は **`feature/subscription-v2`** ブランチで開発・テストし、準備が完了するまで本番にはマージしません。

---

## 2. 実装完了項目（ここまでの対応）

- [x] **Step 1: DB & ユーザー認証（Supabase）基盤**
  - [schema.sql](file:///Users/numataa/work/antigravity/space-quiz-ai/supabase/schema.sql) の作成（`profiles` テーブル、RLS、ユーザー作成トリガー、AI利用カウントRPC関数）。
  - [supabase.js](file:///Users/numataa/work/antigravity/space-quiz-ai/src/services/supabase.js) によるクライアント初期化（未設定時もアプリが落ちない安全なフォールバック設計）。
  - [AuthContext.jsx](file:///Users/numataa/work/antigravity/space-quiz-ai/src/contexts/AuthContext.jsx) による認証セッション全社管理。
  - [ParentPortal.jsx](file:///Users/numataa/work/antigravity/space-quiz-ai/src/components/ParentPortal.jsx) に保護者用のアカウント管理UI（ログイン / 新規登録 / ログアウト）を実装。
- [x] **Step 2: 全ゲーム合算で1日2回制限（デイリーエネルギー制）**
  - [storage.js](file:///Users/numataa/work/antigravity/space-quiz-ai/src/utils/storage.js) に24時間回復のデイリー利用カウント管理を実装。
  - **対象モード**: 「AIのひみつクイズ」「てんもん宇宙けんてい」「宇宙まちがいさがし」の3つを合算して1日2回まで。
  - **フリー対象**: 「おとうさん・おかあさんのクイズ」は完全フリー（無制限・消費なし）。
  - [TitleScreen.jsx](file:///Users/numataa/work/antigravity/space-quiz-ai/src/components/TitleScreen.jsx) のヘッダーに `⚡⚡ きょうのエネルギー: あと2かい` などのリアルタイム表示を追加。
  - 2回使い切った際の「きょうの あそびエネルギーが なくなったよ！」親切モーダル（React Portal実装・誤タップ防止ガード付き）。
  - クイズ画面・まちがいさがし画面での二重消費防止ロック（`useRef` ガード）。
- [x] **Step 3: Stripe 決済・サブスクリプション連携**
  - [stripe.js](file:///Users/numataa/work/antigravity/space-quiz-ai/src/services/stripe.js) による Stripe Checkout / Customer Portal 連携。
  - 親御さんポータル最上部に「🌟 宇宙博士プラン（月額380円・全ゲームあそび放題）」の案内カードおよびアプリ内加入確認モーダルを実装。
  - 加入中画面に「⚙️ ご契約の確認・解約・カード変更 (Customer Portal)」ボタンを設置。
  - 解約シミュレーションモーダルによるワンタップ解約体験を実装。
  - プレミアム加入時にタイトル画面が即座に `⚡ 全モード あそびほうだい！` に切り替わるエンドツーエンド検証完了。
  - [lambda/index.js](file:///Users/numataa/work/antigravity/space-quiz-ai/lambda/index.js) に追加ライブラリゼロの Stripe REST API 直接呼び出しエンドポイントを追加。

---

## 3. 残タスク一覧（Next Actions）

### 🔹 フェーズ 1: 完全無料でできる検証・AWSプレビュー環境構築（現段階）
- [x] **Task 1: AWS Amplify Hosting でのブランチ検証環境セットアップ**
  - AWS Amplify に `feature/subscription-v2` ブランチを追加接続・自動ビルド設定完了。
  - **検証用プレビューURL**: `https://feature-subscription-v2.d3fxbwm039k7bh.amplifyapp.com`
  - 実機ブラウザ確認完了。本番（息子さんの利用環境: `main`）への影響ゼロを維持。
- [x] **Task 2: Supabase 実環境プロジェクトの接続**
  - Supabase 無料プロジェクト作成・テーブルスキーマ適用完了。
  - Amplify 検証ブランチの環境変数（`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`）を設定。
  - 実機ブラウザ検証完了: `anmt1226@gmail.com` でのアカウント新規作成・自動ログイン動作確認済み。
- [ ] **Task 3: Stripe テスト環境キーの発行・連携（任意・いつでも可）**
  - Stripe 無料アカウント作成（テストモード）。
  - テスト用 Secret Key と Price ID を AWS Lambda の環境変数に設定。
  - テスト用カード（`4242...`）での実際のCheckout画面遷移・プレミアム即時反映をテスト。

---

### 🔹 フェーズ 2: 本番ローンチ（実際にお金をかける最終ステップ）
※ 以下の作業を行うまでは、**一切費用（¥0）は発生しません**。

- [ ] **Task 4: AWS Route 53 で独自ドメイン取得 & カスタムドメイン接続**
  - AWS Route 53 Domains でドメインを購入（例: `space-quiz.com` 年額 約$14〜$15）。
  - AWS Amplify コンソールで「ドメイン管理」から購入したドメインを追加（Route 53 DNS ホストゾーンおよび SSL 証明書が自動構成）。
- [ ] **Task 5: 法務表記・利用規約ページの設置**
  - 特定商取引法に基づく表記（販売価格、支払方法、解約方法など）。
  - プライバシーポリシー & 利用規約。
- [ ] **Task 6: Stripe 本番化**
  - Stripe の本番利用申請（本人確認、売上振込先銀行口座登録）。
  - AWS Lambda の環境変数を本番キーへ差し替え。
- [ ] **Task 7: X（Twitter）公式アカウント開設・マーケティング開始**
  - `@space_quiz_ai` 等のアカウント開設。
  - 親子向け・知育・宇宙ファンに向けた広報活動の開始。
  - `feature/subscription-v2` を `main` へマージし、独自ドメインへ完全移行。

---

## 4. 環境変数一覧（リファレンス）

| 環境変数名 | 配置場所 | 説明 |
| :--- | :--- | :--- |
| `VITE_API_GATEWAY_URL` | フロントエンド (Amplify / .env.local) | AWS Lambda の API Gateway URL |
| `VITE_SUPABASE_URL` | フロントエンド (Amplify / .env.local) | Supabase プロジェクトURL |
| `VITE_SUPABASE_ANON_KEY` | フロントエンド (Amplify / .env.local) | Supabase 公開Anon Key |
| `GEMINI_API_KEY` | AWS Lambda (環境変数) | Google Gemini API キー |
| `STRIPE_SECRET_KEY` | AWS Lambda (環境変数) | Stripe シークレットキー (`sk_test_...` / `sk_live_...`) |
| `STRIPE_PRICE_ID` | AWS Lambda (環境変数) | Stripe 月額380円プランの Price ID (`price_...`) |
