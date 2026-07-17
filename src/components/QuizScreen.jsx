import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { generateQuizFromAI, generateAstronomyTestQuiz } from '../services/gemini';
import { storage } from '../utils/storage';
import { audio } from '../utils/audio';
import { QUIZ_IMAGES } from '../data/quizImages';

// HTMLから音声読み上げ用のひらがなテキストを抽出する関数
function getReadingText(htmlString, isEasy = false) {
  if (typeof document === 'undefined') return htmlString;
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<span>${htmlString}</span>`, 'text/html');
  const span = doc.body.firstChild;

  // ruby要素を探して、親文字を削除しつつ、ルビテキストと送り仮名を正しく結合する
  const rubies = span.querySelectorAll('ruby');
  rubies.forEach(ruby => {
    const childNodes = Array.from(ruby.childNodes);
    const newNodes = [];

    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];

      if (node.nodeType === 1 && node.tagName.toLowerCase() === 'rt') { // ELEMENT_NODE
        newNodes.push(doc.createTextNode(node.textContent));
      } else if (node.nodeType === 3) { // TEXT_NODE
        const nextNode = childNodes[i + 1];
        const isParentText = nextNode &&
          nextNode.nodeType === 1 &&
          nextNode.tagName.toLowerCase() === 'rt';

        // 直後に rt タグが控えていないテキストノード（送り仮名など）は残す
        if (!isParentText) {
          newNodes.push(doc.createTextNode(node.textContent));
        }
      }
    }

    // 子ノード群を置換してフラット化する
    const fragment = doc.createDocumentFragment();
    newNodes.forEach(n => fragment.appendChild(n));
    ruby.parentNode.replaceChild(fragment, ruby);
  });

  let text = span.textContent;

  // 1. 括弧内のひらがな・カタカナ（8文字以下）を削除（例: 「場所（ばしょ）」→「場所」）
  text = text.replace(/[（(][\u3040-\u309F\u30A0-\u30FF\u30FC]{1,8}[）)]/g, '');

  // 2. 「やさしい」モードの場合の追加処理
  if (isEasy) {
    // 助詞の「は」「へ」を正しい発音（わ、え）に置換（文末、スペース、句読点の前が対象）
    text = text.replace(/は([ 　、。？！\?\!：:]|$)/g, 'わ$1');
    text = text.replace(/へ([ 　、。？！\?\!：:]|$)/g, 'え$1');

    // イントネーション改善のためのひらがな→漢字簡易置換マッピング
    const wordMap = {
      'うちゅうひこうし': '宇宙飛行士',
      'うちゅうふく': '宇宙服',
      'てんのうせい': '天王星',
      'かいおうせい': '海王星',
      'しんかんせん': '新幹線',
      'たいようけい': '太陽系',
      'おほしさま': 'お星さま',
      'のりもの': '乗り物',
      'ピカピカ': 'ぴかぴか',
      'ポカポカ': 'ぽかぽか',
      'ぴかぴか': 'ぴかぴか',
      'ぽかぽか': 'ぽかぽか',
      'うちゅう': '宇宙',
      'ちきゅう': '地球',
      'たいよう': '太陽',
      'もくせい': '木星',
      'ひこうき': '飛行機',
      'なまえ': '名前',
      'にほん': 'にっぽん',
      'かせい': '火星',
      'どせい': '土星',
      'すいせい': '水星',
      'きんせい': '金星',
      'せいざ': '星座',
      'ぎんが': '銀河',
      'わくせい': '惑星',
      'えいせい': '衛星',
      'よる': '夜',
      'した': '下',
      'あさ': '朝',
      'ひかる': '光る',
      'まわって': '回って',
      'まわる': '回る',
      'ねむる': '眠る',
      'ほのお': '炎',
      'けむり': '煙',
      'おと': '音',
      'みず': '水',
      'つき': '月',
      'おとなり': 'お隣',
      'となり': '隣',
      'かるい': '軽い',
      'かるく': '軽く',
      'じかん': '時間',
      'あとひとつ': 'あと一つ',
      'ひとつ': '一つ',
      'べが': 'ヴェガ'
    };

    for (const [kana, kanji] of Object.entries(wordMap)) {
      text = text.replaceAll(kana, kanji);
    }

    // スペースを「、」に置換してイントネーションを改善
    text = text.replace(/[ 　]+/g, '、');
    text = text.replace(/、+/g, '、');
  }

  // 3. 全難易度共通の発音・ポーズ補正
  text = text.replaceAll('ベガ', 'ヴェガ');
  text = text.replaceAll('日本', 'にっぽん');
  text = text.replace(/、/g, '。');    // 読点「、」もすべて句点「。」に変換して確実にポーズを置く
  text = text.replace(/。+/g, '。');   // 連続する句点を1つにまとめる

  return text;
}

// 選択肢をシャッフルし、正解インデックスを再計算する関数
function shuffleChoices(quiz) {
  if (!quiz || !quiz.choices || quiz.choices.length === 0) return quiz;

  const mapped = quiz.choices.map((choice, index) => ({
    choice,
    isCorrect: index === quiz.answerIndex
  }));

  // Fisher-Yates シャッフル
  for (let i = mapped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
  }

  return {
    ...quiz,
    choices: mapped.map(item => item.choice),
    answerIndex: mapped.findIndex(item => item.isCorrect)
  };
}

export default function QuizScreen({ mode, difficulty, onFinishQuiz, onBackToTitle }) {
  const [quizzes, setQuizzes] = useState([]);
  const totalQuestions = mode === 'parent' ? quizzes.length : 5;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // null, 0, 1, 2
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isWrongShake, setIsWrongShake] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);

  // 音声読み上げ用ステートと参照
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [autoSpeech, setAutoSpeech] = useState(() => {
    try {
      const saved = localStorage.getItem('auto_speech');
      return saved !== null ? saved === 'true' : true;
    } catch (e) {
      return true;
    }
  });
  const utteranceRef = useRef(null);

  // マーカー（Canvas）用ステートと参照
  const [isPenActive, setIsPenActive] = useState(true);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // 誤タップ防止用トランジションロック
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimerRef = useRef(null);

  // 読み上げテキストを取得する関数
  const getQuizReadingText = () => {
    const currentQuiz = quizzes[currentIdx];
    if (!currentQuiz) return '';

    if (showExplanation) {
      const isCorrect = selectedAnswer === currentQuiz.answerIndex;
      const headerText = isCorrect ? 'せいかい！ すごいね！' : 'ざんねん！ つぎは がんばろう！';
      const expText = getReadingText(currentQuiz.explanation, difficulty === 'easy');
      return `${headerText}。${expText}`;
    } else {
      const questionText = getReadingText(currentQuiz.question, difficulty === 'easy');
      const choicesText = currentQuiz.choices.map((choice, idx) => {
        const numText = idx === 0 ? 'いち' : idx === 1 ? 'に' : idx === 2 ? 'さん' : 'よん';
        const choiceText = getReadingText(choice, difficulty === 'easy');
        return `${numText}。${choiceText}`;
      }).join('。');
      return `${questionText}。${choicesText}`;
    }
  };

  // 音声読み上げ開始
  const startSpeech = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    audio.duckBgm();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.rate = 0.88; // 子ども向けに少しゆっくり
    u.volume = 1.0; // 音量を最大に明示設定

    u.onend = () => {
      setIsPlayingSpeech(false);
      audio.unduckBgm();
    };
    u.onerror = () => {
      setIsPlayingSpeech(false);
      audio.unduckBgm();
    };

    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
    setIsPlayingSpeech(true);
  };

  // 音声読み上げ停止
  const stopSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsPlayingSpeech(false);
    audio.unduckBgm();
  };

  // 読み上げの再生/停止切り替え
  const toggleSpeech = () => {
    audio.playClick();
    if (isPlayingSpeech) {
      stopSpeech();
    } else {
      const readingText = getQuizReadingText();
      if (readingText) {
        startSpeech(readingText);
      }
    }
  };

  // ペンの有効/無効切り替え
  const togglePen = () => {
    audio.playClick();
    setIsPenActive(prev => !prev);
  };

  // 自動読み上げトグル
  const handleToggleAutoSpeech = () => {
    audio.playClick();
    setAutoSpeech(prev => {
      const newVal = !prev;
      try {
        localStorage.setItem('auto_speech', String(newVal));
      } catch (e) { }
      return newVal;
    });
  };

  // Canvas初期化
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = 'rgba(255, 65, 54, 0.15)'; // 半透明の赤
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  // Canvasクリア
  const clearCanvas = () => {
    if (isPenActive) {
      audio.playClick();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
  };

  // ペン有効時の初期化とリサイズ監視
  useEffect(() => {
    if (isPenActive && !loading) {
      const timer = setTimeout(initCanvas, 50);

      const handleResize = () => {
        initCanvas();
      };
      window.addEventListener('resize', handleResize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isPenActive, currentIdx, loading]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    const pos = getCoordinates(e);
    lastPos.current = pos;
    isDrawingRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x + 0.1, pos.y);
    ctx.stroke();
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPos.current = pos;
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  // 自動読み上げ & 画面遷移時のクリーンアップ
  useEffect(() => {
    if (!loading && quizzes.length > 0 && quizzes[currentIdx]) {
      let timer;
      if (autoSpeech) {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        const readingText = getQuizReadingText();
        timer = setTimeout(() => {
          startSpeech(readingText);
        }, 600);
      }

      return () => {
        if (timer) clearTimeout(timer);
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        setIsPlayingSpeech(false);
        audio.unduckBgm();
      };
    }
  }, [currentIdx, loading, quizzes[currentIdx], autoSpeech, showExplanation]);

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      audio.unduckBgm();
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  // クイズデータの取得・初期化
  useEffect(() => {
    let active = true;

    async function loadQuizzes() {
      setLoading(true);
      const quizList = [];
      const answeredIds = storage.getAnsweredIds();

      if (mode === 'parent') {
        // おとなの手作りクイズから出題 (LocalStorageから瞬時にロード)
        const parentPool = storage.getParentQuizzes().filter(q => q.difficulty === difficulty);
        let available = parentPool.filter(q => !answeredIds.includes(q.id));
        if (available.length === 0) {
          available = parentPool;
        }
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        const limit = Math.min(5, shuffled.length);
        for (let i = 0; i < limit; i++) {
          quizList.push(shuffled[i]);
        }
        if (active) {
          const shuffledList = quizList.map(q => q ? shuffleChoices(q) : q);
          setQuizzes(shuffledList);
          setLoading(false);
          shuffledList.forEach(quiz => {
            if (quiz && quiz.question) {
              storage.addRecentQuestion(quiz.question);
            }
          });
        }
        return;
      }

      // AIクイズ (検定 & ひみつクイズ) - 最初の2問を同期取得して即プレイ開始
      const historyIds = [...answeredIds];
      const sessionQuestions = [];
      const recentQuestions = storage.getRecentQuestions(30);

      // 章リストの準備 (検定用)
      let chapters = [];
      if (difficulty === '4') {
        chapters = [0, 1, 2, 3, 4, 5, 6];
      } else if (difficulty === '3') {
        chapters = [1, 2, 3, 4, 5, 6];
      }
      const shuffledChapters = [...chapters].sort(() => 0.5 - Math.random()).slice(0, 5);

      const targetQuizCount = 5;
      const initialQuizCount = 1;

      // 1. 最初の1問を同期取得
      for (let i = 0; i < initialQuizCount; i++) {
        if (!active) return;
        try {
          let quiz;
          if (mode === 'test') {
            const targetChapter = shuffledChapters[i] !== undefined ? shuffledChapters[i] : null;
            let targetImage = null;
            if (targetChapter !== null && Math.random() < 0.3) {
              const matchingImages = QUIZ_IMAGES.filter(img => 
                img.grades.includes(difficulty) && img.chapters[difficulty] === targetChapter
              );
              if (matchingImages.length > 0) {
                targetImage = matchingImages[Math.floor(Math.random() * matchingImages.length)];
              }
            }
            quiz = await generateAstronomyTestQuiz(difficulty, historyIds, sessionQuestions, recentQuestions, targetChapter, targetImage);
          } else {
            quiz = await generateQuizFromAI(difficulty, historyIds, sessionQuestions, recentQuestions);
          }

          if (quiz) {
            quizList.push(quiz);
            historyIds.push(quiz.id);
            const plainQuestion = quiz.question
              .replace(/<rt>.*?<\/rt>/g, '')
              .replace(/<[^>]*>/g, '');
            sessionQuestions.push(plainQuestion);
          }
        } catch (e) {
          console.error(`Failed loading initial question ${i}`, e);
        }
      }

      if (!active) return;

      // 最初の2問でゲーム開始
      const initialList = quizList.map(q => q ? shuffleChoices(q) : q);
      setQuizzes(initialList);
      setLoading(false);
      initialList.forEach(quiz => {
        if (quiz && quiz.question) {
          storage.addRecentQuestion(quiz.question);
        }
      });

      // 2. 残りの3問をバックグラウンドで非同期に順次取得
      for (let i = initialQuizCount; i < targetQuizCount; i++) {
        if (!active) return;
        try {
          let quiz;
          if (mode === 'test') {
            const targetChapter = shuffledChapters[i] !== undefined ? shuffledChapters[i] : null;
            let targetImage = null;
            if (targetChapter !== null && Math.random() < 0.3) {
              const matchingImages = QUIZ_IMAGES.filter(img => 
                img.grades.includes(difficulty) && img.chapters[difficulty] === targetChapter
              );
              if (matchingImages.length > 0) {
                targetImage = matchingImages[Math.floor(Math.random() * matchingImages.length)];
              }
            }
            quiz = await generateAstronomyTestQuiz(difficulty, historyIds, sessionQuestions, recentQuestions, targetChapter, targetImage);
          } else {
            quiz = await generateQuizFromAI(difficulty, historyIds, sessionQuestions, recentQuestions);
          }

          if (quiz) {
            if (!active) return;
            const shuffledQuiz = shuffleChoices(quiz);
            setQuizzes(prev => {
              if (!active) return prev;
              return [...prev, shuffledQuiz];
            });
            historyIds.push(quiz.id);
            const plainQuestion = quiz.question
              .replace(/<rt>.*?<\/rt>/g, '')
              .replace(/<[^>]*>/g, '');
            sessionQuestions.push(plainQuestion);
            storage.addRecentQuestion(quiz.question);
          }
        } catch (e) {
          console.error(`Failed loading background question ${i}`, e);
        }
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

  // 次の問題がバックグラウンドロード中でまだ届いていない場合のガード
  if (!currentQuiz) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}>🚀</div>
        <p style={styles.loadingText}>
          つぎの もんだいを つくっているよ。<br />
          ちょっと まってね...
        </p>
      </div>
    );
  }

  const handleAnswerSelect = (index) => {
    if (selectedAnswer !== null || isTransitioning) return; // すでに回答済みまたは遷移中なら処理しない

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

  const handleCloseZoomModal = (e) => {
    if (e) e.stopPropagation();
    audio.playClick();
    setIsImageZoomed(false);

    // 誤タップ防止ロック (閉じた直後の誤回答を防ぐ)
    setIsTransitioning(true);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const handleNext = () => {
    audio.playClick();
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsImageZoomed(false);

    // 誤タップ防止ロック (連打による次問題の誤回答を防ぐ)
    setIsTransitioning(true);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 600); // 600msの入力ロック

    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // 5問終了
      onFinishQuiz(score, totalQuestions, quizHistory);
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

  const hasImage = !!(currentQuiz && currentQuiz.imageId);
  const isFourChoices = currentQuiz && currentQuiz.choices && currentQuiz.choices.length === 4;
  const isTightLayout = isFourChoices && hasImage;

  // 進捗インジケーター（ロケットが地球から星へ進むデザイン）
  const progressPercent = totalQuestions > 0 ? (currentIdx / totalQuestions) * 100 : 0;

  return (
    <div className="quiz-screen fade-in" style={{
      ...styles.container,
      padding: isTightLayout ? '12px 15px' : '20px 20px'
    }}>
      {/* 画面ヘッダー（進行状況） */}
      <div style={{
        ...styles.header,
        marginBottom: isTightLayout ? '8px' : '15px'
      }}>
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
            だい {currentIdx + 1} もん / ぜんぶで {totalQuestions} もん
          </div>
        </div>
      </div>

      {/* クイズエリア */}
      <div className={`quiz-card ${isWrongShake ? 'shake-effect' : ''}`} style={styles.quizCard}>
        {/* 音声＆マーカーコントロールバー */}
        <div className="control-bar" style={{
          ...styles.controlBar,
          padding: isTightLayout ? '6px 12px' : '10px 16px',
          marginBottom: isTightLayout ? '8px' : '15px'
        }}>
          <div className="audio-controls" style={styles.audioControls}>
            <button
              className={`btn-control-audio ${isPlayingSpeech ? 'playing' : ''}`}
              onClick={toggleSpeech}
              style={{
                ...styles.audioButton,
                padding: isTightLayout ? '6px 12px' : '8px 16px',
                fontSize: isTightLayout ? '0.85rem' : '0.95rem'
              }}
            >
              {isPlayingSpeech ? '⏸️ よみあげ とめる' : '🔊 こえで よむ'}
            </button>
            <label className="auto-speech-label" style={styles.autoSpeechLabel}>
              <input
                type="checkbox"
                checked={autoSpeech}
                onChange={handleToggleAutoSpeech}
                className="auto-speech-checkbox"
                style={styles.autoSpeechCheckbox}
              />
              <span className="auto-speech-text" style={styles.autoSpeechText}>つぎも自動（じどう）でよむ</span>
            </label>
          </div>

          <div className="marker-controls" style={styles.markerControls}>
            <button
              className={`btn-control-pen ${isPenActive ? 'active' : ''}`}
              onClick={togglePen}
              style={{
                ...styles.penButton,
                padding: isTightLayout ? '6px 12px' : '8px 16px',
                fontSize: isTightLayout ? '0.85rem' : '0.95rem'
              }}
            >
              🖍️ {isPenActive ? 'あかペン OFF' : 'あかペンで線をひく'}
            </button>
            {isPenActive && (
              <button
                className="btn-control-clear"
                onClick={clearCanvas}
                style={{
                  ...styles.clearButton,
                  padding: isTightLayout ? '6px 12px' : '8px 14px',
                  fontSize: isTightLayout ? '0.85rem' : '0.95rem'
                }}
              >
                🗑️ けす
              </button>
            )}
          </div>
        </div>

        {/* 画像クイズ用画像表示 */}
        {(() => {
          const quizImage = currentQuiz.imageId 
            ? QUIZ_IMAGES.find(img => img.id === currentQuiz.imageId) 
            : null;
          if (!quizImage) return null;
          return (
            <div style={{
              ...styles.quizImageWrapper,
              marginBottom: isTightLayout ? '8px' : '15px'
            }}>
              <img 
                src={quizImage.path} 
                alt="Quiz Diagram" 
                style={{
                  ...styles.quizImage,
                  maxHeight: isTightLayout ? '100px' : '180px'
                }}
                onClick={() => {
                  audio.playClick();
                  setIsImageZoomed(true);
                }}
              />
              <div style={styles.zoomHint}>🔍 タップで 大きくする</div>
            </div>
          );
        })()}

        {/* 問題文 */}
        <div className="question-container" style={styles.questionContainer}>
          <div style={{
            ...styles.questionBox,
            padding: isTightLayout ? '12px 16px' : (isFourChoices ? '16px' : '24px'),
            marginBottom: isTightLayout ? '8px' : (isFourChoices ? '12px' : '20px')
          }}>
            <h2
              style={{
                ...styles.questionText,
                fontSize: isTightLayout ? '1.2rem' : (isFourChoices ? '1.3rem' : '1.6rem'),
                lineHeight: isTightLayout ? '1.35' : (isFourChoices ? '1.4' : '1.6')
              }}
              dangerouslySetInnerHTML={{ __html: currentQuiz.question }}
            />
          </div>

          {/* マーカー描画用Canvas */}
          {isPenActive && (
            <canvas
              ref={canvasRef}
              className="marker-canvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          )}
        </div>

        {/* 選択肢（3択または4択） */}
        <div style={styles.choicesBox}>
          {currentQuiz.choices.map((choice, index) => {
            const choiceBtnStyle = isFourChoices ? {
              padding: isTightLayout ? '8px 16px' : '12px 20px',
              marginBottom: isTightLayout ? '8px' : '12px',
              fontSize: isTightLayout ? '1.1rem' : '1.2rem',
              borderRadius: isTightLayout ? '14px' : '18px',
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
              {currentIdx + 1 === totalQuestions
                ? (mode === 'test' ? 'けっかを みる 🏁' : 'ごほうびを もらう 🎁')
                : 'つぎへ すすむ ➔'}
            </button>
          </div>
        )}

        {/* 画像拡大モーダル（ルール7準拠：画面のどこをタップしても閉じられる） */}
        {isImageZoomed && (() => {
          const quizImage = currentQuiz.imageId 
            ? QUIZ_IMAGES.find(img => img.id === currentQuiz.imageId) 
            : null;
          if (!quizImage) return null;
          return ReactDOM.createPortal(
            <div 
              style={styles.modalOverlay}
              onClick={handleCloseZoomModal}
            >
              <div 
                style={styles.modalContent}
                onClick={handleCloseZoomModal}
              >
                <img 
                  src={quizImage.path} 
                  alt="Quiz Diagram Zoomed" 
                  style={styles.modalImage}
                />
                <button 
                  style={styles.modalCloseButton}
                  onClick={handleCloseZoomModal}
                >
                  ❌ とじる
                </button>
              </div>
            </div>,
            document.body
          );
        })()}
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
  },
  controlBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--color-card-border)',
    borderRadius: '16px',
    padding: '10px 16px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  audioControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  audioButton: {
    padding: '8px 16px',
    fontSize: '0.95rem',
    borderRadius: '12px',
    cursor: 'pointer',
    border: 'none',
  },
  autoSpeechLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  autoSpeechCheckbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  autoSpeechText: {
    fontSize: '0.85rem',
    color: 'var(--color-text-sub)',
  },
  markerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  penButton: {
    padding: '8px 16px',
    fontSize: '0.95rem',
    borderRadius: '12px',
    cursor: 'pointer',
    border: 'none',
  },
  clearButton: {
    padding: '8px 14px',
    fontSize: '0.95rem',
    borderRadius: '12px',
    cursor: 'pointer',
    border: 'none',
  },
  questionContainer: {
    position: 'relative',
    width: '100%',
  },
  markerCanvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '20px',
    pointerEvents: 'auto',
    touchAction: 'none',
    zIndex: 5,
    cursor: 'crosshair',
  },
  quizImageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '15px',
    width: '100%',
  },
  quizImage: {
    maxWidth: '100%',
    maxHeight: '180px',
    borderRadius: '16px',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    objectFit: 'contain',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.2s ease',
  },
  zoomHint: {
    fontSize: '0.8rem',
    color: 'var(--color-text-sub)',
    marginTop: '6px',
    fontWeight: '700',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    cursor: 'zoom-out',
  },
  modalContent: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '90%',
    maxHeight: '90%',
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: '80vh',
    objectFit: 'contain',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
  },
  modalCloseButton: {
    marginTop: '20px',
    padding: '10px 24px',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#fff',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
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
