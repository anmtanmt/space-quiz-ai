import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import WelcomeScreen from './components/WelcomeScreen';
import TitleScreen from './components/TitleScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import CollectionScreen from './components/CollectionScreen';
import ParentPortal from './components/ParentPortal';
import SpotDifferenceScreen from './components/SpotDifferenceScreen';
import LegalModal from './components/LegalModal';

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const [screen, setScreen] = useState('WELCOME'); // 'WELCOME', 'TITLE', 'QUIZ', 'RESULT', 'COLLECTION', 'PARENT'
  const [quizMode, setQuizMode] = useState('ai');
  const [difficulty, setDifficulty] = useState('easy');
  const [selectedBadgeId, setSelectedBadgeId] = useState(null);
  const [result, setResult] = useState({ score: 0, total: 5 });
  const [directLegalTab, setDirectLegalTab] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');
      if (page === 'tokusho' || page === 'legal') {
        setDirectLegalTab('tokusho');
      } else if (page === 'terms') {
        setDirectLegalTab('terms');
      } else if (page === 'privacy') {
        setDirectLegalTab('privacy');
      }
    }
  }, []);

  const handleStartQuiz = (mode, diff) => {
    setQuizMode(mode);
    setDifficulty(diff);
    if (mode === 'spot_diff') {
      setScreen('SPOT_THE_DIFFERENCE');
    } else {
      setScreen('QUIZ');
    }
  };

  const handleFinishQuiz = (score, total) => {
    setResult({ score, total });
    setScreen('RESULT');
  };

  const handlePlayAgain = () => {
    setScreen('QUIZ');
  };

  const handleViewCollection = (badgeId = null) => {
    setSelectedBadgeId(badgeId);
    setScreen('COLLECTION');
  };

  const handleGoToParent = () => {
    setScreen('PARENT');
  };

  const handleBackToTitle = () => {
    setScreen('TITLE');
  };

  return (
    <div className="app-container">
      {/* 宇宙空間のまたたく星の背景デコレーション */}
      <div className="space-stars" />

      {/* 画面切り替え */}
      {screen === 'WELCOME' && (
        <WelcomeScreen
          onStartApp={() => setScreen('TITLE')}
        />
      )}

      {screen === 'TITLE' && (
        <TitleScreen
          onStartQuiz={handleStartQuiz}
          onViewCollection={handleViewCollection}
          onGoToParent={handleGoToParent}
        />
      )}

      {screen === 'QUIZ' && (
        <QuizScreen
          mode={quizMode}
          difficulty={difficulty}
          onFinishQuiz={handleFinishQuiz}
          onBackToTitle={handleBackToTitle}
        />
      )}

      {screen === 'SPOT_THE_DIFFERENCE' && (
        <SpotDifferenceScreen
          difficulty={difficulty}
          onBackToTitle={handleBackToTitle}
          onViewCollection={handleViewCollection}
        />
      )}

      {screen === 'RESULT' && (
        <ResultScreen
          score={result.score}
          total={result.total}
          mode={quizMode}
          difficulty={difficulty}
          onPlayAgain={handlePlayAgain}
          onViewCollection={handleViewCollection}
          onBackToTitle={handleBackToTitle}
        />
      )}

      {screen === 'COLLECTION' && (
        <CollectionScreen
          initialBadgeId={selectedBadgeId}
          onBackToTitle={handleBackToTitle}
        />
      )}

      {screen === 'PARENT' && (
        <ParentPortal
          onBackToTitle={handleBackToTitle}
        />
      )}

      {/* URLパラメータによる直接法務モーダル表示（Stripe審査・直リンク用） */}
      {directLegalTab && (
        <LegalModal
          isOpen={true}
          onClose={() => {
            setDirectLegalTab(null);
            // URLクエリを綺麗にクリーンアップ
            const url = new URL(window.location);
            url.searchParams.delete('page');
            window.history.replaceState({}, '', url.pathname);
          }}
          initialTab={directLegalTab}
        />
      )}
    </div>
  );
}
