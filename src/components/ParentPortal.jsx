import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { storage } from '../utils/storage';
import { audio } from '../utils/audio';
import { useAuth } from '../contexts/AuthContext';
import { redirectToCheckout, redirectToCustomerPortal } from '../services/stripe';
import LegalModal from './LegalModal';

export default function ParentPortal({ onBackToTitle }) {
  const { 
    user, 
    profile, 
    isConfigured, 
    isPremium, 
    planType, 
    planExpiresAt, 
    signUp, 
    signIn, 
    signOut, 
    upgradeToPremium, 
    downgradeToFree 
  } = useAuth();
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [mathQuestion, setMathQuestion] = useState({ q: '', a: 0 });
  const [gateInput, setGateInput] = useState('');
  const [gateError, setGateError] = useState('');

  // 認証用状態
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // プラン変更モーダル状態
  const [selectedPlanType, setSelectedPlanType] = useState('pass_30d'); // 'pass_30d' | 'subscription'
  const [showUpgradeConfirmModal, setShowUpgradeConfirmModal] = useState(false);
  const [showDowngradeConfirmModal, setShowDowngradeConfirmModal] = useState(false);
  const [planSuccessNotice, setPlanSuccessNotice] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 法務表記モーダル状態
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalTab, setLegalTab] = useState('tokusho');

  const handleOpenLegal = (tab) => {
    audio.playClick();
    setLegalTab(tab);
    setShowLegalModal(true);
  };

  // 30日パスの残り期間計算
  const formatPassRemaining = () => {
    if (!planExpiresAt) return '';
    const diffMs = planExpiresAt - Date.now();
    if (diffMs <= 0) return '期限終了';
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}日 ${hours}時間`;
  };

  // 決済・プラン操作ハンドラー
  const handleUpgradeClick = (type = 'pass_30d') => {
    audio.playClick();
    setSelectedPlanType(type);
    setPlanSuccessNotice('');
    setShowUpgradeConfirmModal(true);
  };

  const handleConfirmUpgrade = async () => {
    audio.playClick();
    setIsRedirecting(true);
    try {
      await redirectToCheckout(user?.id || 'guest', user?.email || '', selectedPlanType);
    } catch (e) {
      console.warn('Fallback to instant upgrade', e);
      setIsRedirecting(false);
      setShowUpgradeConfirmModal(false);
      await upgradeToPremium(selectedPlanType, 30);
      if (selectedPlanType === 'pass_30d') {
        setPlanSuccessNotice('🎟️ 30日間あそび放題パスが有効になりました！すべてのゲームが無制限にあそび放題になります。');
      } else {
        setPlanSuccessNotice('🌟 宇宙博士プランに加入しました！すべてのゲームが無制限にあそび放題になります。');
      }
    }
  };

  const handlePortalClick = () => {
    audio.playClick();
    setPlanSuccessNotice('');
    if (profile?.stripe_customer_id) {
      redirectToCustomerPortal(profile.stripe_customer_id);
    } else {
      setShowDowngradeConfirmModal(true);
    }
  };

  const handleConfirmDowngrade = async () => {
    audio.playClick();
    setShowDowngradeConfirmModal(false);
    await downgradeToFree();
    setPlanSuccessNotice('無料プランに変更しました。');
  };

  // クイズ管理用の状態
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null); // null or quiz object

  // フォーム用状態
  const [difficulty, setDifficulty] = useState('easy');
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState(['', '', '']);
  const [answerIndex, setAnswerIndex] = useState(0);
  const [explanation, setExplanation] = useState('');

  // 共有用インポート/エクスポート状態
  const [shareCode, setShareCode] = useState('');
  const [importCode, setImportCode] = useState('');
  const [shareMsg, setShareMsg] = useState('');

  // 算数ゲートの生成
  useEffect(() => {
    generateMathGate();
    loadQuizzes();
  }, []);

  const generateMathGate = () => {
    const num1 = Math.floor(Math.random() * 9) + 2; // 2~10
    const num2 = Math.floor(Math.random() * 8) + 2; // 2~9
    const isPlus = Math.random() > 0.5;
    
    if (isPlus) {
      setMathQuestion({
        q: `${num1} ＋ ${num2} ＝ ？`,
        a: num1 + num2
      });
    } else {
      const large = num1 + num2;
      setMathQuestion({
        q: `${large} － ${num1} ＝ ？`,
        a: large - num1
      });
    }
    setGateInput('');
    setGateError('');
  };

  const loadQuizzes = () => {
    const data = storage.getParentQuizzes();
    setQuizzes(data);
    // エクスポート用コードの生成
    if (data.length > 0) {
      setShareCode(btoa(unescape(encodeURIComponent(JSON.stringify(data)))));
    } else {
      setShareCode('');
    }
  };

  const handleGateSubmit = (e) => {
    e.preventDefault();
    audio.playClick();
    const val = parseInt(gateInput, 10);
    if (val === mathQuestion.a) {
      setGateUnlocked(true);
    } else {
      setGateError('こたえが ちがいます。おとなの人に やってもらってね！');
      generateMathGate();
    }
  };

  // フォームクリア
  const resetForm = () => {
    audio.playClick();
    setEditingQuiz(null);
    setDifficulty('easy');
    setQuestion('');
    setChoices(['', '', '']);
    setAnswerIndex(0);
    setExplanation('');
  };

  // クイズ編集開始
  const handleEdit = (quiz) => {
    audio.playClick();
    setEditingQuiz(quiz);
    setDifficulty(quiz.difficulty);
    setQuestion(quiz.question);
    setChoices([...quiz.choices]);
    setAnswerIndex(quiz.answerIndex);
    setExplanation(quiz.explanation);
    // スクロールをトップに戻す
    const content = document.querySelector('.scrollable-content');
    if (content) content.scrollTop = 0;
  };

  // クイズ削除
  const handleDelete = (id) => {
    audio.playClick();
    if (window.confirm('このクイズを削除してもよろしいですか？')) {
      storage.deleteParentQuiz(id);
      loadQuizzes();
      if (editingQuiz?.id === id) resetForm();
    }
  };

  // クイズ保存
  const handleSave = (e) => {
    e.preventDefault();
    audio.playClick();
    if (!question || choices.some(c => !c) || !explanation) {
      alert('すべての項目を入力してください。');
      return;
    }

    const quizData = {
      id: editingQuiz?.id || null,
      difficulty,
      question,
      choices,
      answerIndex,
      explanation
    };

    storage.saveParentQuiz(quizData);
    loadQuizzes();
    resetForm();
    alert('クイズを保存しました！');
  };

  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  // 回答履歴とバッジのリセット
  const handleResetData = () => {
    audio.playClick();
    if (window.confirm('お子様の「回答した履歴」と「あつめたバッジ」をリセットして最初からあそべるようにします。よろしいですか？（※登録した手作りクイズは消えません）')) {
      storage.resetChildData();
      alert('リセットが完了しました！');
    }
  };

  // クイズインポート
  const handleImport = () => {
    audio.playClick();
    try {
      if (!importCode.trim()) return;
      const jsonStr = decodeURIComponent(escape(atob(importCode.trim())));
      const importedData = JSON.parse(jsonStr);

      if (!Array.isArray(importedData)) {
        throw new Error('データ形式が正しくありません。');
      }

      // 簡易フォーマットバリデーション
      for (const item of importedData) {
        if (!item.question || !Array.isArray(item.choices) || typeof item.answerIndex !== 'number') {
          throw new Error('クイズのデータ構造が壊れています。');
        }
        // IDの再生成（重複衝突防止）
        if (!item.id || item.id.startsWith('pq_')) {
          item.id = 'pq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        storage.saveParentQuiz(item);
      }

      loadQuizzes();
      setImportCode('');
      alert('クイズの取り込みに成功しました！');
    } catch (e) {
      console.error(e);
      alert('インポートに失敗しました。共有コードが正しいか確認してください。');
    }
  };

  // コピー用ヘルパー
  const handleCopyCode = () => {
    audio.playClick();
    navigator.clipboard.writeText(shareCode);
    setShareMsg('コピーしました！他の端末の「インポート」欄に貼り付けて使ってください。');
    setTimeout(() => setShareMsg(''), 3000);
  };

  // 認証ハンドラー
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    audio.playClick();
    setAuthError('');
    setAuthSuccessMsg('');

    if (!authEmail || !authPassword) {
      setAuthError('メールアドレスとパスワードを入力してください。');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('パスワードは6文字以上で入力してください。');
      return;
    }

    setAuthSubmitting(true);
    try {
      if (isSignUpMode) {
        await signUp(authEmail, authPassword);
        setAuthSuccessMsg('アカウント登録が完了しました！');
      } else {
        await signIn(authEmail, authPassword);
        setAuthSuccessMsg('ログインに成功しました！');
      }
      setAuthPassword('');
    } catch (err) {
      console.error(err);
      setAuthError(err.message || '認証に失敗しました。入力内容をご確認ください。');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignOutClick = async () => {
    audio.playClick();
    if (window.confirm('ログアウトしてもよろしいですか？')) {
      await signOut();
      setAuthSuccessMsg('');
      setAuthError('');
    }
  };

  // --- 算数ゲートの画面 ---
  if (!gateUnlocked) {
    return (
      <div className="parent-gate fade-in" style={styles.gateContainer}>
        <div style={styles.gateBox}>
          <h2 style={styles.gateTitle}>⚙️ おとな用ページ制限</h2>
          <p style={styles.gateDesc}>
            ここから先は、クイズを新しくつくったり、これまでのきろくを消したりできる設定ページです。<br />
            おとなの人が計算をといて進んでね。
          </p>
          <form onSubmit={handleGateSubmit} style={styles.gateForm}>
            <div style={styles.mathText}>{mathQuestion.q}</div>
            <input
              type="number"
              pattern="[0-9]*"
              value={gateInput}
              onChange={(e) => setGateInput(e.target.value)}
              placeholder="こたえを入力"
              style={styles.gateInput}
              autoFocus
            />
            {gateError && <p style={styles.errorText}>{gateError}</p>}
            <div style={styles.gateButtons}>
              <button type="submit" className="btn-action btn-primary" style={{ flex: 1 }}>
                おとな用ページへ ➔
              </button>
              <button 
                type="button" 
                className="btn-action btn-back" 
                onClick={() => { audio.playClick(); onBackToTitle(); }}
              >
                タイトルへもどる
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- おとな用管理画面 ---
  return (
    <div className="parent-portal fade-in" style={styles.portalContainer}>
      <div style={styles.portalHeader}>
        <h1 style={styles.portalTitle}>おとな用 管理ページ</h1>
        <button className="btn-action btn-back" onClick={() => { audio.playClick(); onBackToTitle(); }}>
          ⬅ タイトルへもどる
        </button>
      </div>

      <div className="scrollable-content" style={styles.portalBody}>
          {/* ご利用プラン & サブスクリプション セクション */}
        <div style={styles.section}>
          <div style={styles.sectionHeaderRow}>
            <h2 style={styles.sectionTitle}>🌟 ご利用プラン ＆ プレミアム設定</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={planType === 'pass_30d' ? styles.planBadgePass : (isPremium ? styles.planBadgePremium : styles.planBadgeFree)}>
                {planType === 'pass_30d' 
                  ? `🎟️ 30日間パス利用中（あと ${formatPassRemaining()}）` 
                  : (isPremium ? '🌟 宇宙博士プラン（全モードあそび放題）' : '🌱 無料プラン（1日2回まで）')}
              </span>
              {!isConfigured && (
                <span style={styles.offlineBadge}>⚙️ ローカル動作中</span>
              )}
            </div>
          </div>

          {/* プラン変更完了通知 */}
          {planSuccessNotice && (
            <div style={styles.planSuccessBanner}>
              {planSuccessNotice}
            </div>
          )}

          {/* サブスクリプション・プラン操作パネル（未ログインでも常に確認可能） */}
          <div>
            {!isPremium ? (
              <div style={styles.plansSection}>
                <div style={styles.plansIntroText}>
                  お好みのあそび放題プランをお選びいただけます。決済はお子様の誤操作を防ぐため、安全なStripe画面にて行われます。
                </div>

                <div style={styles.plansGrid}>
                  {/* プラン1: 30日間あそび放題パス（PayPay対応・1回買い切り） */}
                  <div style={styles.planCardPass}>
                    <div style={styles.planCardPassRibbon}>
                      <span>📱 PayPay対応！コード決済OK</span>
                    </div>

                    <div style={styles.planCardHeader}>
                      <span style={{ fontSize: '2rem' }}>🎟️</span>
                      <div>
                        <div style={styles.planCardTitle}>30日間あそび放題パス</div>
                        <div style={styles.planCardPrice}>
                          <span style={styles.planPriceMain}>400円</span>
                          <span style={styles.planPriceSub}>（税込 / 1回買い切り）</span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.planFeaturesList}>
                      <div style={styles.featureItem}>✅ <strong>PayPay（スマホ決済）</strong>ですぐ購入！</div>
                      <div style={styles.featureItem}>✅ クレジットカード決済も対応</div>
                      <div style={styles.featureItem}>✅ <strong>30日間 全モード完全あそび放題！</strong></div>
                      <div style={styles.featureItem}>✅ <strong>自動更新なし！</strong>解約忘れの心配ゼロ</div>
                      <div style={styles.featureItem}>✅ まずはお試しで遊びたいご家庭に最適</div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                      <button
                        type="button"
                        className="btn-action btn-accent"
                        onClick={() => handleUpgradeClick('pass_30d')}
                        style={styles.passBtn}
                      >
                        🎟️ 400円で30日間パスを購入 ➔
                      </button>
                    </div>
                  </div>

                  {/* プラン2: 宇宙博士プラン（月額サブスク） */}
                  <div style={styles.planCardSub}>
                    <div style={styles.planCardSubRibbon}>
                      <span>🌟 一番おトク！</span>
                    </div>

                    <div style={styles.planCardHeader}>
                      <span style={{ fontSize: '2rem' }}>🌟</span>
                      <div>
                        <div style={styles.planCardTitle}>宇宙博士プラン（月額）</div>
                        <div style={styles.planCardPrice}>
                          <span style={{ ...styles.planPriceMain, color: '#06d6a0' }}>月額 380円</span>
                          <span style={styles.planPriceSub}>（税込 / 毎月定期）</span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.planFeaturesList}>
                      <div style={styles.featureItem}>✅ <strong>全ゲーム無制限にあそび放題！</strong></div>
                      <div style={styles.featureItem}>✅ クレジットカード・Apple Pay対応</div>
                      <div style={styles.featureItem}>✅ 毎月380円でずっと一番おトク</div>
                      <div style={styles.featureItem}>✅ 毎月の更新手続き不要</div>
                      <div style={styles.featureItem}>✅ 契約縛りなし・いつでもワンタップ解約OK</div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                      <button
                        type="button"
                        className="btn-action"
                        onClick={() => handleUpgradeClick('subscription')}
                        style={styles.subBtn}
                      >
                        🌟 月額380円で加入する ➔
                      </button>
                    </div>
                  </div>
                </div>

                {/* 法務・規約表記リンク */}
                <div style={styles.legalLinksRow}>
                  <button type="button" style={styles.legalLinkBtn} onClick={() => handleOpenLegal('tokusho')}>
                    特定商取引法に基づく表記
                  </button>
                  <span style={styles.legalDivider}>|</span>
                  <button type="button" style={styles.legalLinkBtn} onClick={() => handleOpenLegal('terms')}>
                    利用規約
                  </button>
                  <span style={styles.legalDivider}>|</span>
                  <button type="button" style={styles.legalLinkBtn} onClick={() => handleOpenLegal('privacy')}>
                    プライバシーポリシー
                  </button>
                </div>
              </div>
            ) : planType === 'pass_30d' ? (
              /* 30日間パス利用中表示 */
              <div style={styles.activePassBox}>
                <div style={styles.activePlanHeader}>
                  <span style={{ fontSize: '2rem' }}>🎟️</span>
                  <div>
                    <div style={styles.activePlanTitle}>30日間あそび放題パス をご利用中です</div>
                    <div style={styles.activePassCountdown}>
                      ⏳ のこり期間：<strong>{formatPassRemaining()}</strong> 全モードあそび放題！
                    </div>
                  </div>
                </div>

                <div style={styles.activePlanDesc}>
                  すべてのお子様向けゲームが<strong>【完全無制限】</strong>でプレイ可能です。<br />
                  1回きりの買い切りのため、<strong>自動更新や解約手続きは一切不要</strong>です。期間満了後は自動的に無料プランへ戻ります。
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-action btn-accent"
                    onClick={() => handleUpgradeClick('pass_30d')}
                    style={styles.passExtendBtn}
                  >
                    ➕ パスをさらに30日間延長する（400円）
                  </button>
                  <button
                    type="button"
                    className="btn-action"
                    onClick={() => handleUpgradeClick('subscription')}
                    style={styles.subSwitchBtn}
                  >
                    🌟 月額プラン（380円）に切り替える ➔
                  </button>
                </div>

                {/* 契約中時 法務リンク */}
                <div style={styles.legalLinksRow}>
                  <button type="button" style={styles.legalLinkBtn} onClick={() => handleOpenLegal('tokusho')}>
                    特定商取引法に基づく表記
                  </button>
                  <span style={styles.legalDivider}>|</span>
                  <button type="button" style={styles.legalLinkBtn} onClick={() => handleOpenLegal('terms')}>
                    利用規約
                  </button>
                  <span style={styles.legalDivider}>|</span>
                  <button type="button" style={styles.legalLinkBtn} onClick={() => handleOpenLegal('privacy')}>
                    プライバシーポリシー
                  </button>
                </div>
              </div>
            ) : (
              /* 月額サブスクご契約中表示 */
              <div style={styles.activePlanBox}>
                <div style={styles.activePlanTitle}>🌟 宇宙博士プラン（月額）をご契約中です</div>
                <div style={styles.activePlanDesc}>
                  すべてのお子様向けゲームが<strong>【完全無制限】</strong>でプレイ可能です。<br />
                  解約やクレジットカードの変更は、いつでも以下の公式ポータルから行えます。
                </div>
                <div style={{ marginTop: '14px' }}>
                  <button
                    type="button"
                    className="btn-action"
                    onClick={handlePortalClick}
                    style={styles.portalBtn}
                  >
                    ⚙️ ご契約の確認・解約・カード変更（Customer Portal）
                  </button>
                </div>

                {/* 契約中時 法務リンク */}
                <div style={styles.legalLinksRow}>
                  <button type="button" style={styles.legalLinkBtn} onClick={() => handleOpenLegal('tokusho')}>
                    特定商取引法に基づく表記
                  </button>
                  <span style={styles.legalDivider}>|</span>
                  <button type="button" style={styles.legalLinkBtn} onClick={() => handleOpenLegal('terms')}>
                    利用規約
                  </button>
                  <span style={styles.legalDivider}>|</span>
                  <button type="button" style={styles.legalLinkBtn} onClick={() => handleOpenLegal('privacy')}>
                    プライバシーポリシー
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 保護者アカウント管理 セクション */}
        <div style={styles.section}>
          <div style={styles.sectionHeaderRow}>
            <h2 style={styles.sectionTitle}>👤 保護者アカウント管理</h2>
          </div>

          {user ? (
            // ログイン済み状態
            <div style={styles.accountCard}>
              <div style={styles.accountInfoRow}>
                <div>
                  <div style={styles.userEmailLabel}>ログイン中のアカウント</div>
                  <div style={styles.userEmail}>{user.email}</div>
                </div>
                <button
                  type="button"
                  className="btn-action"
                  onClick={handleSignOutClick}
                  style={styles.signOutBtn}
                >
                  ログアウト
                </button>
              </div>
            </div>
          ) : (
            // 未ログイン状態
            <div style={styles.authCard}>
              <p style={styles.authDesc}>
                💡 <strong>保護者アカウント未登録のままでも、今すぐ月額プランに加入できます。</strong><br />
                アカウントを作成（ログイン）しておくと、他の端末（スマホやタブレット）でもあそび放題を引き継げます。
              </p>

              {/* ログイン / 新規登録 切り替えタブ */}
              <div style={styles.authTabContainer}>
                <button
                  type="button"
                  onClick={() => { audio.playClick(); setIsSignUpMode(false); setAuthError(''); setAuthSuccessMsg(''); }}
                  style={{
                    ...styles.authTabBtn,
                    ...(isSignUpMode ? {} : styles.authTabBtnActive)
                  }}
                >
                  ログイン
                </button>
                <button
                  type="button"
                  onClick={() => { audio.playClick(); setIsSignUpMode(true); setAuthError(''); setAuthSuccessMsg(''); }}
                  style={{
                    ...styles.authTabBtn,
                    ...(isSignUpMode ? styles.authTabBtnActive : {})
                  }}
                >
                  新しくアカウントを作る
                </button>
              </div>

              {/* フォーム */}
              <form onSubmit={handleAuthSubmit} style={styles.authForm}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>メールアドレス:</label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="example@email.com"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>パスワード（6文字以上）:</label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="半角英数6文字以上"
                    style={styles.input}
                    minLength={6}
                    required
                  />
                </div>

                {authError && <div style={styles.authErrorText}>{authError}</div>}
                {authSuccessMsg && <div style={styles.authSuccessText}>{authSuccessMsg}</div>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button
                    type="submit"
                    className="btn-action btn-primary"
                    disabled={authSubmitting || !isConfigured}
                    style={{ minWidth: '160px', opacity: isConfigured ? 1 : 0.6 }}
                  >
                    {authSubmitting ? '処理中...' : (isSignUpMode ? 'アカウントを作成する ➔' : 'ログインする ➔')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* クイズ作成フォーム */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {editingQuiz ? '✍️ 手作りクイズの編集' : '➕ 手作りクイズの新規作成'}
          </h2>
          <form onSubmit={handleSave} style={styles.form}>
            {/* 難易度 */}
            <div style={styles.formGroup}>
              <label style={styles.label}>難易度（なんいど）:</label>
              <div style={styles.radioRow}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="difficulty"
                    value="easy"
                    checked={difficulty === 'easy'}
                    onChange={() => setDifficulty('easy')}
                  /> やさしい（漢字なし）
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="difficulty"
                    value="medium"
                    checked={difficulty === 'medium'}
                    onChange={() => setDifficulty('medium')}
                  /> ふつう（ルビつき）
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="difficulty"
                    value="hard"
                    checked={difficulty === 'hard'}
                    onChange={() => setDifficulty('hard')}
                  /> むずかしい（ルビつき）
                </label>
              </div>
            </div>

            {/* 問題文 */}
            <div style={styles.formGroup}>
              <label style={styles.label}>問題文:</label>
              <p style={styles.hint}>
                ※ふつう・むずかしいは <b>漢字にルビ（ふりがな）</b>を振れます。<br />
                例: <code>&lt;ruby&gt;地球&lt;rt&gt;ちきゅう&lt;/rt&gt;&lt;/ruby&gt;</code> と書くとルビ付きで表示されます。
              </p>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="例: <ruby>地球<rt>ちきゅう</rt></ruby>から 一番近い ほしは なんでしょう？"
                style={styles.textarea}
                rows={3}
              />
            </div>

            {/* 3択の選択肢 */}
            <div style={styles.formGroup}>
              <label style={styles.label}>選択肢（3つ入力）:</label>
              {choices.map((choice, i) => (
                <div key={i} style={styles.choiceInputRow}>
                  <span style={styles.choiceLabel}>{i === 0 ? '①' : i === 1 ? '②' : '③'}</span>
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) => handleChoiceChange(i, e.target.value)}
                    placeholder={`選択肢 ${i + 1}`}
                    style={styles.textInput}
                  />
                  <label style={styles.correctRadio}>
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={answerIndex === i}
                      onChange={() => setAnswerIndex(i)}
                    /> 正解
                  </label>
                </div>
              ))}
            </div>

            {/* 解説 */}
            <div style={styles.formGroup}>
              <label style={styles.label}>解説文（回答後に表示されるメッセージ）:</label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="子ども向けに、やさしく説明してあげましょう。（例: 月（つき）は地球（ちきゅう）のまわりをまわる衛星（えいせい）だよ！）"
                style={styles.textarea}
                rows={3}
              />
            </div>

            {/* 送信ボタン */}
            <div style={styles.formActions}>
              <button type="submit" className="btn-action btn-accent" style={{ flex: 1 }}>
                💾 クイズを保存する
              </button>
              {editingQuiz && (
                <button type="button" className="btn-action btn-back" onClick={resetForm}>
                  キャンセル
                </button>
              )}
            </div>
          </form>
        </div>

        {/* 登録済み手作りクイズリスト */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📋 登録済みの手作りクイズ一覧 ({quizzes.length}問)</h2>
          {quizzes.length === 0 ? (
            <p style={styles.emptyText}>まだ登録されたクイズはありません。上のフォームから登録してください。</p>
          ) : (
            <div style={styles.quizList}>
              {quizzes.map((quiz) => (
                <div key={quiz.id} style={styles.quizListItem}>
                  <div style={styles.quizListMeta}>
                    <span style={{
                      ...styles.badgeDiff,
                      background: quiz.difficulty === 'easy' ? 'var(--color-correct)' : quiz.difficulty === 'medium' ? 'var(--color-accent)' : 'var(--color-wrong)',
                      color: '#000'
                    }}>
                      {quiz.difficulty === 'easy' ? 'やさしい' : quiz.difficulty === 'medium' ? 'ふつう' : 'むずかしい'}
                    </span>
                    <span style={styles.quizListAnswer}>正解: 選択肢 {quiz.answerIndex + 1}</span>
                  </div>
                  <h4 style={styles.quizListQuestion} dangerouslySetInnerHTML={{ __html: quiz.question }} />
                  <div style={styles.quizListButtons}>
                    <button className="btn-action btn-primary" onClick={() => handleEdit(quiz)} style={styles.listBtn}>
                      ✏️ 編集
                    </button>
                    <button className="btn-action btn-back" onClick={() => handleDelete(quiz.id)} style={styles.listBtn}>
                      🗑️ 削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* データ共有（コードエクスポート/インポート） */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📲 他の端末へクイズを共有する</h2>
          <p style={styles.hint}>
            この端末で作ったクイズをコード化して、別のスマホやタブレットに移すことができます。
          </p>
          <div style={styles.shareGrid}>
            <div style={styles.shareBlock}>
              <label style={styles.label}>エクスポートコード（コピーして共有）:</label>
              <textarea
                readOnly
                value={shareCode}
                placeholder="クイズを登録するとここにコードが表示されます"
                style={styles.shareTextarea}
                rows={3}
                onClick={(e) => e.target.select()}
              />
              <button 
                disabled={!shareCode}
                className="btn-action btn-primary" 
                onClick={handleCopyCode} 
                style={{ width: '100%', marginTop: '10px' }}
              >
                コードをコピーする
              </button>
              {shareMsg && <p style={styles.successText}>{shareMsg}</p>}
            </div>

            <div style={styles.shareBlock}>
              <label style={styles.label}>インポート（コード貼り付け）:</label>
              <textarea
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                placeholder="他の端末でコピーしたコードをここに貼り付けます"
                style={styles.shareTextarea}
                rows={3}
              />
              <button 
                disabled={!importCode.trim()}
                className="btn-action btn-accent" 
                onClick={handleImport} 
                style={{ width: '100%', marginTop: '10px' }}
              >
                クイズを取り込む
              </button>
            </div>
          </div>
        </div>

        {/* システム管理（リセット機能） */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>⚠️ システム管理</h2>
          <div style={{ ...styles.systemCard, marginBottom: '20px' }}>
            <div style={styles.systemInfo}>
              <h4>子どもの進捗データを最初からやり直す</h4>
              <p style={styles.hint}>お子様の回答履歴と獲得したバッジをすべて消去し、最初の状態に戻します。（親御様が作成したクイズ自体は削除されません）</p>
            </div>
            <button className="btn-action btn-back" onClick={handleResetData} style={styles.resetBtn}>
              💥 回答履歴とバッジをリセット
            </button>
          </div>

          {/* デバッグ機能 */}
          <div style={{ ...styles.systemCard, border: '1px dashed #ffb703', background: 'rgba(255, 183, 3, 0.05)', marginTop: '20px' }}>
            <div style={styles.systemInfo}>
              <h4 style={{ color: '#ffd166', margin: '0 0 4px 0' }}>🛠️ 開発者デバッグツール</h4>
              <p style={styles.hint}>パーツ組み立てやフチ色、マイグレーションなどの表示確認のためのボタンです。</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
              <button 
                className="btn-action btn-primary"
                onClick={() => {
                  audio.playClick();
                  storage.addEarnedBadge('b_test_4', '4', 'test');
                  alert('4きゅうの合格回数を +1 しました！');
                }}
                style={{ fontSize: '0.9rem', padding: '10px 16px' }}
              >
                4きゅう合格 +1
              </button>
              <button 
                className="btn-action btn-primary"
                onClick={() => {
                  audio.playClick();
                  storage.addEarnedBadge('b_test_3', '3', 'test');
                  alert('3きゅうの合格回数を +1 しました！');
                }}
                style={{ fontSize: '0.9rem', padding: '10px 16px' }}
              >
                3きゅう合格 +1
              </button>
              <button 
                className="btn-action btn-accent"
                onClick={() => {
                  audio.playClick();
                  // 古い形式のデータ（単なる文字列配列）を注入
                  localStorage.setItem('sq_earned_badges', JSON.stringify([
                    'b_earth',  // やさしいで獲得していたとみなされる
                    'b_moon'
                  ]));
                  alert('古い形式のバッジデータを注入しました！リロード後にバッジ画面でマイグレーションが確認できます。');
                }}
                style={{ fontSize: '0.9rem', padding: '10px 16px' }}
              >
                古いバッジデータ注入 (マイグレーション確認用)
              </button>
              <button 
                className="btn-action btn-back"
                onClick={() => {
                  audio.playClick();
                  // 通常の難易度別のバッジ獲得をシミュレーション付与
                  storage.addEarnedBadge('b_sun', 'easy', 'ai');
                  storage.addEarnedBadge('b_mercury', 'medium', 'ai');
                  storage.addEarnedBadge('b_venus', 'hard', 'ai');
                  alert('やさしい(白)・ふつう(青)・むずかしい(金)で獲得した惑星バッジを付与しました！');
                }}
                style={{ fontSize: '0.9rem', padding: '10px 16px' }}
              >
                難易度別バッジ付与 (フチ色確認用)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* プレミアム加入確認モーダル */}
      {showUpgradeConfirmModal && ReactDOM.createPortal(
        <div style={styles.modalBackdrop} onClick={() => setShowUpgradeConfirmModal(false)}>
          <div 
            style={styles.modalCard} 
            onClick={(e) => e.stopPropagation()}
            className="fade-in"
          >
            {selectedPlanType === 'pass_30d' ? (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎟️</div>
                <h2 style={styles.modalTitle}>30日間あそび放題パス を購入しますか？</h2>

                <p style={styles.modalDesc}>
                  <strong>400円（税込・1回買い切り）</strong>で、30日間すべてのゲームが無制限にあそび放題になります！<br />
                  <span style={{ fontSize: '0.85rem', color: '#a0a5c0' }}>
                    ・AIのひみつクイズ（30日間無制限）<br />
                    ・てんもん宇宙けんてい（30日間あそび放題）<br />
                    ・宇宙まちがいさがし（30日間無制限）
                  </span>
                </p>

                <div style={{ ...styles.modalNotice, borderLeft: '4px solid #ffd166', background: 'rgba(255, 209, 102, 0.1)' }}>
                  📱 <strong>PayPay（スマホ決済）</strong>または クレジットカードでお支払いいただけます。<br />
                  💡 <strong>自動更新はありません。</strong>解約手続きを忘れて追加請求される心配は一切ありません。
                </div>

                <div style={styles.modalActions}>
                  <button 
                    type="button" 
                    className="btn-action btn-accent" 
                    onClick={handleConfirmUpgrade}
                    disabled={isRedirecting}
                    style={{
                      ...styles.modalPrimaryBtn,
                      background: 'linear-gradient(135deg, #ff5e62, #ff9966)',
                      opacity: isRedirecting ? 0.7 : 1,
                      cursor: isRedirecting ? 'wait' : 'pointer'
                    }}
                  >
                    {isRedirecting ? '🔄 Stripe 決済画面へ移動しています...' : '🎟️ 400円で購入画面へ（決定） ➔'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-action" 
                    onClick={() => !isRedirecting && setShowUpgradeConfirmModal(false)}
                    disabled={isRedirecting}
                    style={{
                      ...styles.modalCancelBtn,
                      opacity: isRedirecting ? 0.5 : 1
                    }}
                  >
                    もどる
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🌟</div>
                <h2 style={styles.modalTitle}>宇宙博士プラン（月額）に加入しますか？</h2>

                <p style={styles.modalDesc}>
                  <strong>月額 380円（税込）</strong>で、すべてのゲームが無制限にあそび放題になります！<br />
                  <span style={{ fontSize: '0.85rem', color: '#a0a5c0' }}>
                    ・AIのひみつクイズ（無制限）<br />
                    ・てんもん宇宙けんてい（毎日あそび放題）<br />
                    ・宇宙まちがいさがし（無制限）
                  </span>
                </p>

                <div style={styles.modalNotice}>
                  💡 契約の縛りは一切ありません。いつでもワンタップで解約可能です。<br />
                  💳 各種クレジットカード・Apple Pay に対応しています。
                </div>

                <div style={styles.modalActions}>
                  <button 
                    type="button" 
                    className="btn-action btn-accent" 
                    onClick={handleConfirmUpgrade}
                    disabled={isRedirecting}
                    style={{
                      ...styles.modalPrimaryBtn,
                      opacity: isRedirecting ? 0.7 : 1,
                      cursor: isRedirecting ? 'wait' : 'pointer'
                    }}
                  >
                    {isRedirecting ? '🔄 Stripe 決済画面へ移動しています...' : '🌟 月額380円で加入画面へ（決定） ➔'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-action" 
                    onClick={() => !isRedirecting && setShowUpgradeConfirmModal(false)}
                    disabled={isRedirecting}
                    style={{
                      ...styles.modalCancelBtn,
                      opacity: isRedirecting ? 0.5 : 1
                    }}
                  >
                    もどる
                  </button>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* 解約・無料プラン変更確認モーダル */}
      {showDowngradeConfirmModal && ReactDOM.createPortal(
        <div style={styles.modalBackdrop} onClick={() => setShowDowngradeConfirmModal(false)}>
          <div 
            style={styles.modalCard} 
            onClick={(e) => e.stopPropagation()}
            className="fade-in"
          >
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>⚙️</div>
            <h2 style={styles.modalTitle}>無料プランに戻しますか？</h2>

            <p style={styles.modalDesc}>
              解約すると、ゲームのプレイ上限が無料プラン（1日2回まで）に戻ります。<br />
              これまでに集めたバッジや手作りクイズは一切消えません。
            </p>

            <div style={styles.modalActions}>
              <button 
                type="button" 
                className="btn-action" 
                onClick={handleConfirmDowngrade}
                style={styles.modalDangerBtn}
              >
                無料プランに変更する（解約）
              </button>
              <button 
                type="button" 
                className="btn-action" 
                onClick={() => setShowDowngradeConfirmModal(false)}
                style={styles.modalCancelBtn}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 法務表記モーダル（特商法・利用規約・プライバシーポリシー） */}
      <LegalModal 
        isOpen={showLegalModal} 
        onClose={() => setShowLegalModal(false)} 
        initialTab={legalTab} 
      />
    </div>
  );
}

const styles = {
  gateContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px',
  },
  gateBox: {
    width: '100%',
    maxWidth: '500px',
    background: 'rgba(20, 20, 40, 0.9)',
    border: '2px solid var(--color-card-border)',
    borderRadius: '28px',
    padding: '30px',
    textAlign: 'center',
    boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
  },
  gateTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    marginBottom: '15px',
    color: '#fff',
  },
  gateDesc: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#a0a5c0',
    marginBottom: '24px',
  },
  gateForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  mathText: {
    fontSize: '2.2rem',
    fontWeight: '800',
    color: 'var(--color-accent)',
    letterSpacing: '0.05em',
  },
  gateInput: {
    width: '100%',
    maxWidth: '200px',
    padding: '12px 20px',
    fontSize: '1.5rem',
    borderRadius: '12px',
    border: '2px solid var(--color-card-border)',
    background: 'rgba(0,0,0,0.3)',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'var(--font-family)',
    outline: 'none',
  },
  errorText: {
    color: 'var(--color-wrong)',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  gateButtons: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '12px',
  },
  portalContainer: {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  portalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 30px',
    borderBottom: '1px solid var(--color-card-border)',
    flexShrink: 0,
  },
  portalTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#fff',
  },
  portalBody: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: '24px 30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    overscrollBehaviorY: 'contain',
  },
  section: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--color-card-border)',
    borderRadius: '24px',
    padding: '24px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'var(--color-primary)',
    marginBottom: '20px',
    borderLeft: '4px solid var(--color-primary)',
    paddingLeft: '12px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
  },
  hint: {
    fontSize: '0.85rem',
    color: '#a0a5c0',
    lineHeight: '1.5',
  },
  radioRow: {
    display: 'flex',
    gap: '20px',
    marginTop: '6px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid var(--color-card-border)',
    background: 'rgba(0,0,0,0.2)',
    color: '#fff',
    fontFamily: 'var(--font-family)',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
  },
  choiceInputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  choiceLabel: {
    fontSize: '1.2rem',
    color: 'var(--color-primary)',
    fontWeight: 'bold',
    width: '24px',
  },
  textInput: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid var(--color-card-border)',
    background: 'rgba(0,0,0,0.2)',
    color: '#fff',
    fontFamily: 'var(--font-family)',
    fontSize: '0.95rem',
    outline: 'none',
  },
  correctRadio: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  formActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
  },
  emptyText: {
    color: '#606580',
    textAlign: 'center',
    padding: '20px',
  },
  quizList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  quizListItem: {
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  quizListMeta: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  badgeDiff: {
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  quizListAnswer: {
    fontSize: '0.8rem',
    color: 'var(--color-text-sub)',
    fontWeight: '700',
  },
  quizListQuestion: {
    fontSize: '1.05rem',
    lineHeight: '1.5',
    color: '#e0e5ff',
  },
  quizListButtons: {
    display: 'flex',
    gap: '10px',
    alignSelf: 'flex-end',
  },
  listBtn: {
    padding: '6px 14px',
    fontSize: '0.85rem',
    borderRadius: '8px',
  },
  shareGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '12px',
  },
  shareBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  shareTextarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid var(--color-card-border)',
    background: 'rgba(0,0,0,0.3)',
    color: '#a0a5c0',
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    outline: 'none',
    resize: 'none',
    wordBreak: 'break-all',
  },
  successText: {
    color: 'var(--color-correct)',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    marginTop: '4px',
  },
  systemCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 77, 109, 0.05)',
    border: '1px solid rgba(255, 77, 109, 0.2)',
    borderRadius: '16px',
    padding: '18px',
  },
  systemInfo: {
    flex: 1,
    paddingRight: '20px',
  },
  resetBtn: {
    background: 'rgba(255, 77, 109, 0.15)',
    color: 'var(--color-wrong)',
    border: '1px solid var(--color-wrong)',
    '&:hover': {
      background: 'var(--color-wrong)',
      color: '#fff',
    }
  },
  // アカウント＆プラン用スタイル
  sectionHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  offlineBadge: {
    fontSize: '0.75rem',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '4px 10px',
    borderRadius: '12px',
    color: '#a0a5c0',
  },
  accountCard: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--color-card-border)',
    borderRadius: '16px',
    padding: '20px',
  },
  accountInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  userEmailLabel: {
    fontSize: '0.8rem',
    color: '#8e96b8',
    marginBottom: '4px',
  },
  userEmail: {
    fontSize: '1.05rem',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  planBadgeContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  planBadgeFree: {
    background: 'rgba(110, 231, 183, 0.15)',
    color: '#6ee7b7',
    border: '1px solid rgba(110, 231, 183, 0.3)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  planBadgePremium: {
    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 107, 107, 0.2))',
    color: '#ffd166',
    border: '1px solid rgba(255, 209, 102, 0.5)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    boxShadow: '0 0 12px rgba(255, 209, 102, 0.3)',
  },
  planBadgePass: {
    background: 'linear-gradient(135deg, rgba(255, 94, 98, 0.25), rgba(255, 195, 113, 0.25))',
    color: '#ffc371',
    border: '1px solid rgba(255, 195, 113, 0.6)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    boxShadow: '0 0 12px rgba(255, 195, 113, 0.3)',
  },
  plansSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  plansIntroText: {
    fontSize: '0.9rem',
    color: '#a0a5c0',
    lineHeight: '1.5',
    marginBottom: '2px',
  },
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: '20px',
  },
  planCardPass: {
    position: 'relative',
    background: 'linear-gradient(145deg, rgba(255, 190, 11, 0.12), rgba(255, 94, 98, 0.08))',
    border: '2px solid rgba(255, 190, 11, 0.7)',
    borderRadius: '18px',
    padding: '26px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 24px rgba(255, 190, 11, 0.12)',
  },
  planCardPassRibbon: {
    position: 'absolute',
    top: '-12px',
    left: '18px',
    background: 'linear-gradient(135deg, #ff5e62, #ff9966)',
    color: '#ffffff',
    fontSize: '0.78rem',
    fontWeight: 'bold',
    padding: '4px 12px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(255, 94, 98, 0.5)',
  },
  planCardSub: {
    position: 'relative',
    background: 'linear-gradient(145deg, rgba(6, 214, 160, 0.1), rgba(17, 24, 39, 0.5))',
    border: '1px solid rgba(6, 214, 160, 0.5)',
    borderRadius: '18px',
    padding: '26px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 24px rgba(6, 214, 160, 0.1)',
  },
  planCardSubRibbon: {
    position: 'absolute',
    top: '-12px',
    left: '18px',
    background: '#06d6a0',
    color: '#0d1322',
    fontSize: '0.78rem',
    fontWeight: 'bold',
    padding: '4px 12px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(6, 214, 160, 0.4)',
  },
  planCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '16px',
  },
  planCardTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  planCardPrice: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
    marginTop: '4px',
  },
  planPriceMain: {
    fontSize: '1.45rem',
    fontWeight: '800',
    color: '#ffd166',
  },
  planPriceSub: {
    fontSize: '0.82rem',
    color: '#a0a5c0',
  },
  planFeaturesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '9px',
    background: 'rgba(0, 0, 0, 0.25)',
    padding: '14px 16px',
    borderRadius: '12px',
    marginBottom: '12px',
  },
  featureItem: {
    fontSize: '0.9rem',
    color: '#e0e5ff',
    lineHeight: '1.4',
  },
  passBtn: {
    width: '100%',
    fontSize: '0.95rem',
    padding: '12px 16px',
    borderRadius: '12px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #ff5e62, #ff9966)',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 4px 15px rgba(255, 94, 98, 0.4)',
    cursor: 'pointer',
    textAlign: 'center',
  },
  subBtn: {
    width: '100%',
    fontSize: '0.95rem',
    padding: '12px 16px',
    borderRadius: '12px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #06d6a0, #118ab2)',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 4px 15px rgba(6, 214, 160, 0.35)',
    cursor: 'pointer',
    textAlign: 'center',
  },
  activePassBox: {
    background: 'linear-gradient(145deg, rgba(255, 190, 11, 0.15), rgba(255, 94, 98, 0.1))',
    border: '2px solid rgba(255, 190, 11, 0.7)',
    borderRadius: '18px',
    padding: '22px',
    boxShadow: '0 8px 24px rgba(255, 190, 11, 0.15)',
  },
  activePlanHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '14px',
  },
  activePassCountdown: {
    fontSize: '0.95rem',
    color: '#ffc371',
    marginTop: '4px',
  },
  passExtendBtn: {
    fontSize: '0.9rem',
    padding: '10px 18px',
    borderRadius: '10px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #ff5e62, #ff9966)',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
  },
  subSwitchBtn: {
    fontSize: '0.9rem',
    padding: '10px 18px',
    borderRadius: '10px',
    fontWeight: 'bold',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    color: '#ffffff',
    cursor: 'pointer',
  },
  activePlanBox: {
    background: 'linear-gradient(135deg, rgba(255, 209, 102, 0.12), rgba(114, 9, 183, 0.12))',
    border: '1px solid rgba(255, 209, 102, 0.5)',
    borderRadius: '16px',
    padding: '20px',
  },
  activePlanTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#ffd166',
    marginBottom: '6px',
  },
  activePlanDesc: {
    fontSize: '0.9rem',
    color: '#c4c9e8',
    lineHeight: '1.6',
  },
  portalBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    color: '#ffffff',
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  planFooterRow: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '14px',
  },
  signOutBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#a0a5c0',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '8px 16px',
    borderRadius: '10px',
    fontSize: '0.85rem',
  },
  authCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--color-card-border)',
    borderRadius: '16px',
    padding: '20px',
  },
  authDesc: {
    fontSize: '0.9rem',
    color: '#c4c9e8',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  authTabContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '8px',
  },
  authTabBtn: {
    background: 'transparent',
    border: 'none',
    color: '#8e96b8',
    padding: '8px 16px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  authTabBtnActive: {
    background: 'rgba(76, 201, 240, 0.15)',
    color: 'var(--color-secondary)',
    border: '1px solid rgba(76, 201, 240, 0.3)',
  },
  authForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  authErrorText: {
    color: 'var(--color-wrong)',
    fontSize: '0.85rem',
    background: 'rgba(255, 77, 109, 0.1)',
    border: '1px solid rgba(255, 77, 109, 0.2)',
    padding: '8px 12px',
    borderRadius: '8px',
  },
  authSuccessText: {
    color: 'var(--color-correct)',
    fontSize: '0.85rem',
    background: 'rgba(6, 214, 160, 0.1)',
    border: '1px solid rgba(6, 214, 160, 0.2)',
    padding: '8px 12px',
    borderRadius: '8px',
  },
  planSuccessBanner: {
    background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.2), rgba(76, 201, 240, 0.2))',
    border: '1px solid rgba(6, 214, 160, 0.5)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#06d6a0',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    marginBottom: '16px',
    textAlign: 'center',
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(5, 7, 20, 0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modalCard: {
    background: '#13172e',
    border: '2px solid var(--color-primary)',
    borderRadius: '24px',
    padding: '28px 24px',
    maxWidth: '460px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(76, 201, 240, 0.2)',
    boxSizing: 'border-box',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: '1.4',
    marginBottom: '12px',
  },
  modalDesc: {
    fontSize: '0.95rem',
    color: '#c4c9e8',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  modalNotice: {
    background: 'rgba(76, 201, 240, 0.08)',
    border: '1px solid rgba(76, 201, 240, 0.25)',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '0.85rem',
    color: '#a0c4ff',
    marginBottom: '20px',
    lineHeight: '1.4',
    textAlign: 'left',
  },
  modalActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  modalPrimaryBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #ffd166, #ff6b6b)',
    color: '#050714',
    border: 'none',
    boxShadow: '0 4px 15px rgba(255, 209, 102, 0.4)',
    cursor: 'pointer',
  },
  modalDangerBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    borderRadius: '12px',
    background: 'rgba(255, 77, 109, 0.15)',
    color: 'var(--color-wrong)',
    border: '1px solid var(--color-wrong)',
    cursor: 'pointer',
  },
  modalCancelBtn: {
    width: '100%',
    padding: '10px',
    fontSize: '0.85rem',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#c4c9e8',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  legalLinksRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  legalLinkBtn: {
    background: 'none',
    border: 'none',
    color: '#8e96b8',
    fontSize: '0.78rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '2px 4px',
    transition: 'color 0.2s',
  },
  legalDivider: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: '0.75rem',
  }
};
