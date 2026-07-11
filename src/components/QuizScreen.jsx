import React, { useState, useEffect } from 'react';
import { generateQuizFromAI, generateAstronomyTestQuiz } from '../services/gemini';
import { storage } from '../utils/storage';
import { audio } from '../utils/audio';

export default function QuizScreen({ mode, difficulty, onFinishQuiz, onBackToTitle }) {
  const [quizzes, setQuizzes] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // null, 0, 1, 2
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isWrongShake, setIsWrongShake] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);

  // クイズデータの取得・初期化
  useEffect(() => {
    let active = true;

    async function loadQuizzes() {
      setLoading(true);
      const quizList = [];
      const answeredIds = storage.getAnsweredIds();

      if (mode === 'parent') {
        // おとなの手作りクイズから出題
        const parentPool = storage.getParentQuizzes().filter(q => q.difficulty === difficulty);
        
        // 未回答のものを優先
        let available = parentPool.filter(q => !answeredIds.includes(q.id));
        if (available.length === 0) {
          available = parentPool; // すべて回答済みの場合は再出題
        }

        // ランダムに最大5問をシャッフルして抽出
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        const limit = Math.min(5, shuffled.length);
        for (let i = 0; i < limit; i++) {
          quizList.push(shuffled[i]);
        }
      } else if (mode === 'test') {
        // 天文宇宙検定クイズ
        const historyIds = [...answeredIds];
        const sessionQuestions = [];
        const recentQuestions = storage.getRecentQuestions(30);
        for (let i = 0; i < 5; i++) {
          if (!active) return;
          try {
            const testQuiz = await generateAstronomyTestQuiz(difficulty, historyIds, sessionQuestions, recentQuestions);
            quizList.push(testQuiz);
            historyIds.push(testQuiz.id);
            const plainQuestion = testQuiz.question
              .replace(/<rt>.*?<\/rt>/g, '')
              .replace(/<[^>]*>/g, '');
            sessionQuestions.push(plainQuestion);
          } catch (e) {
            console.error('Failed loading test question ' + i, e);
          }
        }
      } else {
        // AIのひみつクイズ
        // 5回APIを叩いて問題をランダムに収集
        const historyIds = [...answeredIds];
        const sessionQuestions = [];
        const recentQuestions = storage.getRecentQuestions(30);
        for (let i = 0; i < 5; i++) {
          if (!active) return;
          try {
            const aiQuiz = await generateQuizFromAI(difficulty, historyIds, sessionQuestions, recentQuestions);
            quizList.push(aiQuiz);
            historyIds.push(aiQuiz.id); // 重複回避用の一時的追加
            const plainQuestion = aiQuiz.question
              .replace(/<rt>.*?<\/rt>/g, '')
              .replace(/<[^>]*>/g, '');
            sessionQuestions.push(plainQuestion);
          } catch (e) {
            console.error('Failed loading question ' + i, e);
          }
        }
      }

      if (active) {
        setQuizzes(quizList);
        setLoading(false);
        // 最近出題された問題履歴に登録
        quizList.forEach(quiz => {
          if (quiz && quiz.question) {
            storage.addRecentQuestion(quiz.question);
          }
        });
      }
    }

    loadQuizzes();

    return () => {
      active = false;
    };
  }, [mode, difficulty]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}>🚀</div>
        <p style={styles.loadingText}>
          {mode === 'ai' ? (
            <>AIが うちゅうの ひみつクイズを つくっているよ。<br />ちょっと まってね...</>
          ) : mode === 'test' ? (
            <>てんもん宇宙けんていの もんだいを じゅんびしているよ。<br />ちょっと まってね...</>
          ) : (
            'クイズを じゅんび しているよ...'
          )}
        </p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loadingText}>
          クイズが みつからなかったよ。<br />
          おとな用ページで 難易度（なんいど）に あった クイズを つくってみてね！
        </p>
        <button className="btn-action btn-back" onClick={onBackToTitle} style={{ marginTop: '20px' }}>
          タイトルにもどる
        </button>
      </div>
    );
  }

  const currentQuiz = quizzes[currentIdx];

  const handleAnswerSelect = (index) => {
    if (selectedAnswer !== null) return; // すでに回答済みなら処理しない

    setSelectedAnswer(index);
    const isCorrect = index === currentQuiz.answerIndex;

    if (isCorrect) {
      setScore(prev => prev + 1);
      audio.playCorrect(); // 正解音
    } else {
      setIsWrongShake(true);
      audio.playWrong(); // 不正解音
      setTimeout(() => setIsWrongShake(false), 500); // 揺れアニメーションリセット
    }

    // 回答履歴に保存（IDが存在する場合）
    if (currentQuiz.id) {
      storage.saveAnsweredId(currentQuiz.id);
      // 結果画面で表示するために履歴を保持
      setQuizHistory(prev => [...prev, {
        id: currentQuiz.id,
        question: currentQuiz.question,
        isCorrect: isCorrect
      }]);
    }

    setShowExplanation(true);
  };

  const handleNext = () => {
    audio.playClick();
    setSelectedAnswer(null);
    setShowExplanation(false);

    if (currentIdx + 1 < quizzes.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // 5問終了
      onFinishQuiz(score, quizzes.length, quizHistory);
    }
  };

  const getButtonClass = (index) => {
    let className = 'btn-giant';
    if (selectedAnswer !== null) {
      className += ' disabled';
      if (index === currentQuiz.answerIndex) {
        className += ' correct';
      } else if (index === selectedAnswer) {
        className += ' wrong';
      }
    }
    return className;
  };

  // 進捗インジケーター（ロケットが地球から星へ進むデザイン）
  const progressPercent = ((currentIdx) / quizzes.length) * 100;

  return (
    <div className="quiz-screen fade-in" style={styles.container}>
      {/* 画面ヘッダー（進行状況） */}
      <div style={styles.header}>
        <button 
          className="btn-action btn-back" 
          onClick={() => { audio.playClick(); onBackToTitle(); }} 
          style={styles.abortButton}
        >
          🏠 やめる
        </button>
        <div style={styles.progressContainer}>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressBar, width: `${progressPercent}%` }} />
            <div style={{ ...styles.progressRocket, left: `calc(${progressPercent}% - 15px)` }}>🚀</div>
          </div>
          <div style={styles.questionCounter}>
            だい {currentIdx + 1} もん / ぜんぶで {quizzes.length} もん
          </div>
        </div>
      </div>

      {/* クイズエリア */}
      <div className={`quiz-card ${isWrongShake ? 'shake-effect' : ''}`} style={styles.quizCard}>
        {/* 問題文 */}
        <div style={{
          ...styles.questionBox,
          ...(currentQuiz.choices.length === 4 ? { padding: '16px', marginBottom: '12px' } : {})
        }}>
          <h2 
            style={{
              ...styles.questionText,
              ...(currentQuiz.choices.length === 4 ? { fontSize: '1.3rem', lineHeight: '1.4' } : {})
            }}
            dangerouslySetInnerHTML={{ __html: currentQuiz.question }}
          />
        </div>

        {/* 選択肢（3択または4択） */}
        <div style={styles.choicesBox}>
          {currentQuiz.choices.map((choice, index) => {
            const isFourChoices = currentQuiz.choices.length === 4;
            const choiceBtnStyle = isFourChoices ? {
              padding: '12px 20px',
              marginBottom: '12px',
              fontSize: '1.2rem',
              borderRadius: '18px',
            } : {};

            return (
              <button
                key={index}
                className={getButtonClass(index)}
                onClick={() => handleAnswerSelect(index)}
                style={choiceBtnStyle}
              >
                <span style={styles.choiceNumber}>
                  {index === 0 ? '①' : index === 1 ? '②' : index === 2 ? '③' : '④'}
                </span>
                <span dangerouslySetInnerHTML={{ __html: choice }} />
              </button>
            );
          })}
        </div>

        {/* 回答後の解説エリア */}
        {showExplanation && (
          <div className="star-pop" style={{
            ...styles.explanationBox,
            ...(currentQuiz.choices.length === 4 ? { padding: '16px', bottom: '0' } : {})
          }}>
            <div style={styles.explanationHeader}>
              {selectedAnswer === currentQuiz.answerIndex ? (
                <span style={styles.correctLabel}>🎉 せいかい！ すごいね！</span>
              ) : (
                <span style={styles.wrongLabel}>😢 ざんねん！ つぎは がんばろう！</span>
              )}
            </div>
            <p 
              style={{
                ...styles.explanationText,
                ...(currentQuiz.choices.length === 4 ? { fontSize: '1.05rem', marginBottom: '12px', lineHeight: '1.4' } : {})
              }}
              dangerouslySetInnerHTML={{ __html: currentQuiz.explanation }}
            />
            <button className="btn-action btn-primary" onClick={handleNext} style={styles.nextButton}>
              {currentIdx + 1 === quizzes.length 
                ? (mode === 'test' ? 'けっかを みる 🏁' : 'ごほうびを もらう 🎁') 
                : 'つぎへ すすむ ➔'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px 20px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '40px',
    height: '100%',
  },
  spinner: {
    fontSize: '4rem',
    animation: 'spinAndFloat 2s ease-in-out infinite',
    marginBottom: '24px',
  },
  loadingText: {
    fontSize: '1.3rem',
    color: '#fff',
    lineHeight: '1.6',
    maxWidth: '500px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '20px',
    marginBottom: '15px',
  },
  abortButton: {
    padding: '10px 20px',
    fontSize: '1rem',
  },
  progressContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
  },
  progressTrack: {
    flex: 1,
    height: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
    borderRadius: '6px',
    transition: 'width 0.4s ease',
  },
  progressRocket: {
    position: 'absolute',
    top: '-10px',
    fontSize: '1.3rem',
    transition: 'left 0.4s ease',
  },
  questionCounter: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--color-text-sub)',
    whiteSpace: 'nowrap',
  },
  quizCard: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
  },
  questionBox: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--color-card-border)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '20px',
  },
  questionText: {
    fontSize: '1.6rem',
    fontWeight: '700',
    lineHeight: '1.6',
    textAlign: 'center',
  },
  choicesBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  choiceNumber: {
    marginRight: '12px',
    color: 'var(--color-primary)',
    fontWeight: 'bold',
  },
  explanationBox: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    background: 'rgba(10, 10, 30, 0.95)',
    border: '3px solid var(--color-accent)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10,
  },
  explanationHeader: {
    fontSize: '1.4rem',
    fontWeight: '700',
    marginBottom: '10px',
    textAlign: 'center',
  },
  correctLabel: {
    color: 'var(--color-correct)',
  },
  wrongLabel: {
    color: 'var(--color-wrong)',
  },
  explanationText: {
    fontSize: '1.15rem',
    lineHeight: '1.6',
    marginBottom: '20px',
    color: '#e0e5ff',
  },
  nextButton: {
    alignSelf: 'center',
    padding: '12px 36px',
    fontSize: '1.25rem',
  }
};

// CSS Keyframes 用のスタイル流し込み
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @keyframes spinAndFloat {
      0% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(180deg); }
      100% { transform: translateY(0) rotate(360deg); }
    }
  `;
  document.head.appendChild(styleEl);
}
