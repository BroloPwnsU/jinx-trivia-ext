export class Quiz {
    Title: string;
    Description: string;
    QuizID: string;
    NumberOfQuestions: number;
    AverageScore: number;
    TimesTaken: number;

    MyScore: number;
    
    CurrentAnswer: Answer;
    CurrentQuestion: Question;
    CurrentQuestionIndex: number;
    NextQuestion: Question;
    NextQuestionIndex: number;

    Questions: Question[];
}

export class Question {
    QuestionIndex: number;
    Caption: string;
    Explanation: string;
    QuestionNumber: number;

    MyScore: number;

    CorrectAnswer: Answer;
    SelectedAnswer: Answer;

    Answers: Answer[];
}

export class Answer {
    Caption: string;
    Correct: boolean;
    Letter: string;
}