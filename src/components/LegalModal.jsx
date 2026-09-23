import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function LegalModal({ isOpen, onClose, initialTab = 'tokusho' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // モーダル表示中の背景スクロールロック
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={styles.backdrop} onClick={onClose}>
      <div 
        style={styles.modalCard} 
        onClick={(e) => e.stopPropagation()}
        className="fade-in"
      >
        {/* モーダルヘッダー */}
        <div style={styles.header}>
          <div style={styles.headerTitleRow}>
            <h2 style={styles.title}>📜 法務・規約情報</h2>
            <button style={styles.closeBtn} onClick={onClose} aria-label="閉じる">
              ✕
            </button>
          </div>

          {/* タブナビゲーション */}
          <div style={styles.tabBar}>
            <button
              type="button"
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'tokusho' ? styles.tabBtnActive : {})
              }}
              onClick={() => setActiveTab('tokusho')}
            >
              特定商取引法に基づく表記
            </button>
            <button
              type="button"
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'terms' ? styles.tabBtnActive : {})
              }}
              onClick={() => setActiveTab('terms')}
            >
              利用規約
            </button>
            <button
              type="button"
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'privacy' ? styles.tabBtnActive : {})
              }}
              onClick={() => setActiveTab('privacy')}
            >
              プライバシーポリシー
            </button>
          </div>
        </div>

        {/* コンテンツ本文（スクロール可能） */}
        <div style={styles.contentBody} className="scrollable-content">
          {/* --- 1. 特定商取引法に基づく表記 --- */}
          {activeTab === 'tokusho' && (
            <div style={styles.section}>
              <h3 style={styles.sectionHeading}>特定商取引法に基づく表記</h3>
              <table style={styles.table}>
                <tbody>
                  <tr style={styles.tr}>
                    <th style={styles.th}>サービス名</th>
                    <td style={styles.td}>宇宙クイズ-AI</td>
                  </tr>
                  <tr style={styles.tr}>
                    <th style={styles.th}>販売事業者 / 運営者</th>
                    <td style={styles.td}>沼田 篤彦（宇宙クイズ-AI 運営）</td>
                  </tr>
                  <tr style={styles.tr}>
                    <th style={styles.th}>運営統括責任者</th>
                    <td style={styles.td}>沼田 篤彦</td>
                  </tr>
                  <tr style={styles.tr}>
                    <th style={styles.th}>所在地</th>
                    <td style={styles.td}>請求があったら遅滞なく開示します</td>
                  </tr>
                  <tr style={styles.tr}>
                    <th style={styles.th}>お問い合わせ先</th>
                    <td style={styles.td}>
                      メールアドレス: <a href="mailto:spacequizai@gmail.com" style={styles.link}>spacequizai@gmail.com</a><br />
                      <span style={styles.noteText}>※ お問い合わせはメールにて24時間受け付けております（順次回答いたします）。</span>
                    </td>
                  </tr>
                  <tr style={styles.tr}>
                    <th style={styles.th}>販売価格</th>
                    <td style={styles.td}>
                      ・<strong>30日間あそび放題パス（1回買い切り）</strong>: 400円（消費税込み）<br />
                      ・<strong>宇宙博士プラン（月額サブスクリプション）</strong>: 月額 380円（消費税込み）<br />
                      <span style={styles.noteText}>※ 無料プラン（1日2回までプレイ可能）は登録・利用ともに完全無料です。</span>
                    </td>
                  </tr>
                  <tr style={styles.tr}>
                    <th style={styles.th}>代金以外の必要料金</th>
                    <td style={styles.td}>
                      当サイトの閲覧、コンテンツ利用等に必要となるインターネット接続料金、通信料金等はお客様のご負担となります。
                    </td>
                  </tr>
                  <tr style={styles.tr}>
                    <th style={styles.th}>お支払い方法</th>
                    <td style={styles.td}>
                      PayPay（スマホ決済 / 30日間パスのみ対応）、クレジットカード決済（VISA, Mastercard, JCB, American Express, Diners Club 等）、Apple Pay、Link（決済代行: Stripe, Inc.）
                    </td>
                  </tr>
                  <tr style={styles.tr}>
                    <th style={styles.th}>お支払い時期</th>
                    <td style={styles.td}>
                      ・<strong>30日間あそび放題パス</strong>: ご購入時に即時決済されます（自動更新なし・1回買い切り）。<br />
                      ・<strong>宇宙博士プラン</strong>: 初回お申し込み時に即時決済されます。翌月以降は、毎月初回購入日と同日に自動更新され、登録されたクレジットカードより引き落とされます。
                    </td>
                  </tr>
                  <tr style={styles.tr}>
                    <th style={styles.th}>役務の提供時期</th>
                    <td style={styles.td}>
                      決済完了後、即時に「30日間あそび放題パス」または「宇宙博士プラン（全ゲーム無制限あそび放題）」がご利用いただけます。
                    </td>
                  </tr>
                  <tr style={styles.tr}>
                    <th style={styles.th}>解約・更新について</th>
                    <td style={styles.td}>
                      ・<strong>30日間あそび放題パス</strong>: 1回きりの買い切りのため、解約手続きは不要です。期間終了後は自動的に無料プランへ移行し、追加の請求は一切発生いたしません。<br />
                      ・<strong>宇宙博士プラン</strong>: 「おとな用管理ページ」内の「ご契約の確認・解約（Customer Portal）」より、いつでもワンタップで即座に解約手続きが可能です。<br />
                      ・次回更新日の前日までに解約手続きを行っていただければ、次回の請求は発生いたしません。<br />
                      ・解約手続き後も、すでに決済が完了している請求期間の最終日までは引き続き無制限プランをご利用いただけます。
                    </td>
                  </tr>
                  <tr style={styles.tr}>
                    <th style={styles.th}>返品・返金について</th>
                    <td style={styles.td}>
                      デジタルコンテンツおよび月額サービスの性質上、決済完了後のキャンセル・返金、および日割り計算による返金等はお受けいたしかねます。あらかじめご了承ください。
                    </td>
                  </tr>
                  <tr style={styles.tr}>
                    <th style={styles.th}>推奨動作環境</th>
                    <td style={styles.td}>
                      インターネットに接続可能なPC、タブレット、スマートフォン<br />
                      推奨ブラウザ: Google Chrome, Safari, Microsoft Edge, Mozilla Firefox（各最新版）
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* --- 2. 利用規約 --- */}
          {activeTab === 'terms' && (
            <div style={styles.section}>
              <h3 style={styles.sectionHeading}>利用規約</h3>
              <div style={styles.textBlock}>
                <p>
                  この利用規約（以下「本規約」といいます。）は、宇宙クイズ-AI 運営事務局（以下「当事務局」といいます。）が提供するWebサービス「宇宙クイズ-AI」（以下「本サービス」といいます。）の利用条件を定めるものです。
                </p>

                <h4 style={styles.articleTitle}>第1条（適用および保護者の同意）</h4>
                <p>
                  1. 本規約は、ユーザーと当事務局との間の本サービスの利用に関わる一切の関係に適用されます。<br />
                  2. 本サービスはお子様の天文学習・知育を目的としております。未成年者が有料プランへの加入、またはアカウント登録を行う場合は、必ず親権者等の法定代理人（保護者）の同意および管理のもとで行ってください。
                </p>

                <h4 style={styles.articleTitle}>第2条（ユーザーアカウント）</h4>
                <p>
                  1. ユーザーは、自己の責任においてアカウント情報（メールアドレスおよびパスワード）を適切に管理するものとします。<br />
                  2. アカウントの第三者への譲渡、貸与、売買等は禁止します。
                </p>

                <h4 style={styles.articleTitle}>第3条（有料サブスクリプションおよび料金）</h4>
                <p>
                  1. ユーザーは、月額料金（380円・税込）を支払うことで、本サービスの全ゲームコンテンツを無制限に利用できる「宇宙博士プラン」に加入することができます。<br />
                  2. 有料プランは月単位で自動更新されます。解約を希望される場合は、本サービス内の解約メニューより手続きを行ってください。<br />
                  3. 解約後も、既に支払われた利用期間の満了日までは有料機能をご利用いただけます。デジタルコンテンツの特性上、日割り精算や返金は行いません。
                </p>

                <h4 style={styles.articleTitle}>第4条（生成AIおよびクイズコンテンツの性質）</h4>
                <p>
                  1. 本サービス内の「AIのひみつクイズ」等は、大規模言語モデル（Google Gemini等）を用いて自動生成されています。<br />
                  2. 当事務局は、AIが生成する問題および解説について天文学的知見に基づく正確性の向上に細心の注意を払っておりますが、その完全性、最新性、確実性を恒久的に保証するものではありません。学習を楽しく深める知育ツールとしてご活用ください。
                </p>

                <h4 style={styles.articleTitle}>第5条（禁止事項）</h4>
                <p>
                  ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。<br />
                  ・法令または公序良俗に反する行為<br />
                  ・本サービスのサーバーやネットワーク機能を妨害または破壊する行為<br />
                  ・本サービスに含まれるコンテンツの無断複製、公衆送信、改変、再配布等の著作権侵害行為<br />
                  ・不正アクセス、リバースエンジニアリング、スクレイピング等の不正利用行為<br />
                  ・その他、当事務局が不適切と判断する行為
                </p>

                <h4 style={styles.articleTitle}>第6条（免責事項およびサービスの中断）</h4>
                <p>
                  1. 当事務局は、システムの保守・点検、サーバー障害、天災、外部API（StripeやGemini等）の障害等の事由により、事前の予告なく本サービスの全部または一部の提供を中断・停止することがあります。<br />
                  2. 当事務局は、本サービスに起因してユーザーに生じたあらゆる損害について、故意または重大な過失がある場合を除き、一切の責任を負いません。
                </p>

                <h4 style={styles.articleTitle}>第7条（規約の変更および準拠法）</h4>
                <p>
                  1. 当事務局は、必要と判断した場合には、本規約をいつでも変更することができるものとします。<br />
                  2. 本規約の解釈にあたっては、日本法を準拠法とします。
                </p>
              </div>
            </div>
          )}

          {/* --- 3. プライバシーポリシー --- */}
          {activeTab === 'privacy' && (
            <div style={styles.section}>
              <h3 style={styles.sectionHeading}>プライバシーポリシー</h3>
              <div style={styles.textBlock}>
                <p>
                  宇宙クイズ-AI 運営事務局（以下「当事務局」といいます。）は、本サービスにおけるユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。
                </p>

                <h4 style={styles.articleTitle}>第1条（収集する情報）</h4>
                <p>
                  当事務局は、本サービスにおいて以下の情報を取得・利用することがあります。<br />
                  1. <strong>アカウント情報</strong>: メールアドレス、暗号化されたパスワード（Supabase Authenticationにより安全に管理されます）。<br />
                  2. <strong>決済関連情報</strong>: Stripeが発行する顧客ID（Customer ID）およびサブスクリプションID。※クレジットカード番号やCVC等の重要決済情報はStripeの安全なサーバーに直接送信・保管され、当事務局のサーバーには一切保存されません。<br />
                  3. <strong>利用履歴データ</strong>: クイズのプレイ回数、正解状況、獲得バッジデータ等（学習体験向上のためブラウザのLocalStorageまたはデータベースに保存）。
                </p>

                <h4 style={styles.articleTitle}>第2条（利用目的）</h4>
                <p>
                  収集した情報は、以下の目的のために利用いたします。<br />
                  ・本サービスの提供、ユーザー認証、会員ステータスの管理<br />
                  ・有料プランの決済処理およびサブスクリプション管理<br />
                  ・ユーザーからのお問い合わせ対応や重要なお知らせの送信<br />
                  ・本サービスの機能改善、不具合の調査、品質向上のための統計分析
                </p>

                <h4 style={styles.articleTitle}>第3条（第三者提供および委託サービス）</h4>
                <p>
                  当事務局は、法令に定める場合を除き、事前の同意なく個人情報を第三者に提供いたしません。ただし、本サービスの円滑な提供のために以下の信頼できるクラウドサービスと連携しています。<br />
                  ・<strong>Stripe, Inc.</strong>: クレジットカード等の決済代行処理<br />
                  ・<strong>Supabase, Inc.</strong>: ユーザー認証およびデータベースのホスティング<br />
                  ・<strong>Google Cloud / Gemini API</strong>: AIクイズの生成（※個人を特定可能な情報は送信いたしません）<br />
                  ・<strong>Amazon Web Services (AWS)</strong>: 静的コンテンツのホスティングおよびサーバーレスAPI実行
                </p>

                <h4 style={styles.articleTitle}>第4条（お子様のプライバシー保護）</h4>
                <p>
                  本サービスは、主にお子様（未就学児〜小学校低学年）が楽しく宇宙を学ぶことを目的としています。<br />
                  当事務局は、お子様から不要な個人情報を収集することは一切なく、保護者の同意と監督のもとで安全にサービスをご利用いただける環境づくりを徹底しています。
                </p>

                <h4 style={styles.articleTitle}>第5条（個人情報の開示・訂正・削除）</h4>
                <p>
                  ユーザーは、当事務局に対しご自身の個人情報の開示、訂正、利用停止、または削除を請求することができます。ご希望の場合は、下記のお問い合わせ窓口までご連絡ください。
                </p>

                <h4 style={styles.articleTitle}>第6条（お問い合わせ窓口）</h4>
                <p>
                  本ポリシーに関するお問い合わせは、以下の窓口までお願いいたします。<br />
                  窓口名称: 宇宙クイズ-AI 運営事務局<br />
                  連絡先メールアドレス: <a href="mailto:spacequizai@gmail.com" style={styles.link}>spacequizai@gmail.com</a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* モーダルフッター */}
        <div style={styles.footer}>
          <button type="button" className="btn-action btn-primary" onClick={onClose} style={styles.closeActionBtn}>
            とじる
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 10, 24, 0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    padding: '16px'
  },
  modalCard: {
    width: '100%',
    maxWidth: '720px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0c142b',
    border: '1px solid rgba(0, 212, 255, 0.3)',
    borderRadius: '18px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 212, 255, 0.2)',
    overflow: 'hidden',
    color: '#e0e6ed'
  },
  header: {
    padding: '18px 24px 12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: '#091024'
  },
  headerTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#00d4ff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#8e96b8',
    fontSize: '1.4rem',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '6px',
    lineHeight: 1
  },
  tabBar: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto'
  },
  tabBtn: {
    padding: '8px 14px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#9ba4be',
    fontSize: '0.85rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease'
  },
  tabBtnActive: {
    background: 'rgba(0, 212, 255, 0.15)',
    border: '1px solid #00d4ff',
    color: '#00d4ff',
    fontWeight: 'bold'
  },
  contentBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    fontSize: '0.9rem',
    lineHeight: '1.7',
    color: '#cbd5e1'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  sectionHeading: {
    margin: '0 0 12px',
    fontSize: '1.15rem',
    color: '#ffffff',
    borderLeft: '4px solid #00d4ff',
    paddingLeft: '10px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '16px'
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  th: {
    width: '32%',
    padding: '12px 10px',
    textAlign: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    color: '#94a3b8',
    fontSize: '0.85rem',
    verticalAlign: 'top',
    fontWeight: '600'
  },
  td: {
    padding: '12px 10px',
    verticalAlign: 'top',
    color: '#e2e8f0',
    fontSize: '0.88rem'
  },
  noteText: {
    fontSize: '0.8rem',
    color: '#94a3b8'
  },
  link: {
    color: '#00d4ff',
    textDecoration: 'underline'
  },
  textBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  articleTitle: {
    margin: '12px 0 4px',
    fontSize: '0.98rem',
    color: '#38bdf8',
    fontWeight: 'bold'
  },
  footer: {
    padding: '14px 24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    backgroundColor: '#091024',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  closeActionBtn: {
    minWidth: '100px',
    padding: '8px 18px',
    fontSize: '0.9rem'
  }
};
