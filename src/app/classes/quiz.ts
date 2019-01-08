export class Quiz {
    Title: string;
    Description: string;
    QuizID: string;
    CurrentQuestionIndex: number;
    NumberOfQuestions: number;
    AverageScore: number;
    TimesTaken: number;
    
    NextQuestion: Question;
    Questions: Question[];
}

export class Question {
    Caption: string;
    Explanation: string;
    QuestionNumber: number;

    CorrectAnswer: Answer;

    Answers: Answer[];
}

export class Answer {
    Caption: string;
    Correct: boolean;
    Letter: string;
}