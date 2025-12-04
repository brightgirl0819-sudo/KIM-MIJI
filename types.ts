export enum GameState {
  HOME = 'HOME',
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  RESULTS = 'RESULTS',
  TEAM_SETUP = 'TEAM_SETUP',
  TEAM_PLAYING = 'TEAM_PLAYING',
  TEAM_RESULTS = 'TEAM_RESULTS',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SHORT_ANSWER = 'SHORT_ANSWER',
}

export interface QuizQuestion {
  questionType: QuestionType;
  word: string;
  koreanMeaning: string;
  options?: string[];
}

export interface GameSettings {
  level: string;
  questionType: string; // '객관식', '주관식', '혼합'
}

export interface TeamGameSettings extends GameSettings {
  player1Name: string;
  player2Name: string;
}

export interface AnswerRecord extends QuizQuestion {
  userAnswer: string;
  isCorrect: boolean;
  answeredBy?: string;
  isRescued?: boolean;
}

export interface GameResult {
  score: number;
  totalQuestions: number;
  answers: AnswerRecord[];
}

export interface TeamGameResult {
  teamScore: number;
  totalQuestions: number;
  answers: AnswerRecord[];
  player1Score: number;
  player2Score: number;
  player1Name: string;
  player2Name: string;
}
