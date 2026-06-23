import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import TitleScreen from './components/TitleScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import CollectionScreen from './components/CollectionScreen';
import ParentPortal from './components/ParentPortal';

export default function App() {
  const [screen, setScreen] = useState('WELCOME'); // 'WELCOME', 'TITLE', 'QUIZ', 'RESULT', 'COLLECTION', 'PARENT'
  const [quizMode, setQuizMode] = useState('ai');
  const [difficulty, setDifficulty] = useState('easy');
  const [result, setResult] = useState({ score: 0, total: 0 });

  const handleStartQuiz = (mode, diff) => {
    setQuizMode(mode);
    setDifficulty(diff);
    setScreen('QUIZ');
  };

  const handleFinishQuiz = (score, total) => {
    setResult({ score, total });
    setScreen('RESULT');
  };

  const handlePlayAgain = () => {
    setScreen('QUIZ');
  };

  const handleViewCollection = () => {
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

      {screen === 'RESULT' && (
        <ResultScreen
          score={result.score}
          total={result.total}
          onPlayAgain={handlePlayAgain}
          onViewCollection={handleViewCollection}
          onBackToTitle={handleBackToTitle}
        />
      )}

      {screen === 'COLLECTION' && (
        <CollectionScreen
          onBackToTitle={handleBackToTitle}
        />
      )}

      {screen === 'PARENT' && (
        <ParentPortal
          onBackToTitle={handleBackToTitle}
        />
      )}
    </div>
  );
}
