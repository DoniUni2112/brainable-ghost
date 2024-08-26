export interface SendQuestion {
  pin: string;
  questionId: string;
  correctAnswer: number;
}

export interface SendAnswer {
  pin: string;
  questionId: string;
  playerName: string;
  answer: number;
}

export interface AnswerStatistics {
  answerStatistics: {
    1: number;
    2: number;
    3: number;
    4: number;
  };
}