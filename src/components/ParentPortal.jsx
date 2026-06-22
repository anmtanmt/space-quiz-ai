import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export default function ParentPortal({ onBackToTitle }) {
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [mathQuestion, setMathQuestion] = useState({ q: '', a: 0 });
  const [gateInput, setGateInput] = useState('');
  const [gateError, setGateError] = useState('');

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
    setEditingQuiz(null);
    setDifficulty('easy');
    setQuestion('');
    setChoices(['', '', '']);
    setAnswerIndex(0);
    setExplanation('');
  };

  // クイズ編集開始
  const handleEdit = (quiz) => {
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
    if (window.confirm('このクイズを削除してもよろしいですか？')) {
      storage.deleteParentQuiz(id);
      loadQuizzes();
      if (editingQuiz?.id === id) resetForm();
    }
  };

  // クイズ保存
  const handleSave = (e) => {
    e.preventDefault();
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
    if (window.confirm('お子様の「回答した履歴」と「あつめたバッジ」をリセットして最初からあそべるようにします。よろしいですか？（※登録した手作りクイズは消えません）')) {
      storage.resetChildData();
      alert('リセットが完了しました！');
    }
  };

  // クイズインポート
  const handleImport = () => {
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
    navigator.clipboard.writeText(shareCode);
    setShareMsg('コピーしました！他の端末の「インポート」欄に貼り付けて使ってください。');
    setTimeout(() => setShareMsg(''), 3000);
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
              <button type="button" className="btn-action btn-back" onClick={onBackToTitle}>
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
        <h1 style={styles.portalTitle}>おとな用 管理・作成ページ</h1>
        <button className="btn-action btn-back" onClick={onBackToTitle}>
          ⬅ タイトルへもどる
        </button>
      </div>

      <div className="scrollable-content" style={styles.portalBody}>
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
          <div style={styles.systemCard}>
            <div style={styles.systemInfo}>
              <h4>子どもの進捗データを最初からやり直す</h4>
              <p style={styles.hint}>お子様の回答履歴と獲得したバッジをすべて消去し、最初の状態に戻します。（親御様が作成したクイズ自体は削除されません）</p>
            </div>
            <button className="btn-action btn-back" onClick={handleResetData} style={styles.resetBtn}>
              💥 回答履歴とバッジをリセット
            </button>
          </div>
        </div>
      </div>
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
    display: 'flex',
    flexDirection: 'column',
  },
  portalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 30px',
    borderBottom: '1px solid var(--color-card-border)',
  },
  portalTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#fff',
  },
  portalBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '35px',
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
  }
};
