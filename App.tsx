import React, { useState, useCallback } from 'react';
import HomeScreen from './components/HomeScreen';
import GameSetupScreen from './components/GameSetupScreen';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import LoadingScreen from './components/LoadingScreen';
import TeamSetupScreen from './components/TeamSetupScreen';
import TeamGameScreen from './components/TeamGameScreen';
import TeamResultsScreen from './components/TeamResultsScreen';
import { GameState, GameSettings, QuizQuestion, GameResult, TeamGameSettings, TeamGameResult } from './types';
import { generateQuiz } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.HOME);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [teamGameSettings, setTeamGameSettings] = useState<TeamGameSettings | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [teamGameResult, setTeamGameResult] = useState<TeamGameResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetCommonState = () => {
    setError(null);
    setQuestions([]);
    setGameSettings(null);
    setGameResult(null);
    setTeamGameSettings(null);
    setTeamGameResult(null);
  };

  const handleStartSetup = () => {
    resetCommonState();
    setGameState(GameState.SETUP);
  };
  
  const handleStartTeamSetup = () => {
    resetCommonState();
    setGameState(GameState.TEAM_SETUP);
  };

  const startQuizGeneration = useCallback(async (settings: GameSettings | TeamGameSettings) => {
    setGameState(GameState.LOADING);
    setError(null);
    try {
      const newQuestions = await generateQuiz(settings.level, settings.questionType, 10);
      if (newQuestions.length === 0) {
        throw new Error("생성된 문제가 없습니다. 설정을 변경하여 다시 시도해주세요.");
      }
      setQuestions(newQuestions);
      return newQuestions;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '단어 생성 중 오류가 발생했습니다.');
      setGameState(GameState.SETUP);
      return null;
    }
  }, []);

  const handleStartGame = useCallback(async (settings: GameSettings) => {
    setGameSettings(settings);
    const generatedQuestions = await startQuizGeneration(settings);
    if (generatedQuestions) {
      setGameState(GameState.PLAYING);
    }
  }, [startQuizGeneration]);

  const handleStartTeamGame = useCallback(async (settings: TeamGameSettings) => {
    setTeamGameSettings(settings);
    const generatedQuestions = await startQuizGeneration(settings);
    if (generatedQuestions) {
      setGameState(GameState.TEAM_PLAYING);
    }
  }, [startQuizGeneration]);

  const handleGameEnd = (result: GameResult) => {
    setGameResult(result);
    setGameState(GameState.RESULTS);
  };
  
  const handleTeamGameEnd = (result: TeamGameResult) => {
    setTeamGameResult(result);
    setGameState(GameState.TEAM_RESULTS);
  };
  
  const handlePlayAgain = () => {
    const fromTeamMode = !!teamGameSettings;
    resetCommonState();
    setGameState(fromTeamMode ? GameState.TEAM_SETUP : GameState.SETUP);
  };

  const handleGoHome = () => {
    resetCommonState();
    setGameState(GameState.HOME);
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.HOME:
        return <HomeScreen onStart={handleStartSetup} onStartTeam={handleStartTeamSetup} />;
      case GameState.SETUP:
        return <GameSetupScreen onStartGame={handleStartGame} error={error} />;
      case GameState.TEAM_SETUP:
        return <TeamSetupScreen onStartGame={handleStartTeamGame} error={error} />;
      case GameState.LOADING:
        return <LoadingScreen />;
      case GameState.PLAYING:
        return <GameScreen questions={questions} onGameEnd={handleGameEnd} />;
      case GameState.TEAM_PLAYING:
        return teamGameSettings && <TeamGameScreen questions={questions} settings={teamGameSettings} onGameEnd={handleTeamGameEnd} />;
      case GameState.RESULTS:
        return gameResult && <ResultsScreen result={gameResult} onPlayAgain={handlePlayAgain} onGoHome={handleGoHome} />;
      case GameState.TEAM_RESULTS:
        return teamGameResult && <TeamResultsScreen result={teamGameResult} onPlayAgain={handlePlayAgain} onGoHome={handleGoHome} />;
      default:
        return <HomeScreen onStart={handleStartSetup} onStartTeam={handleStartTeamSetup} />;
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen text-brand-text font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
