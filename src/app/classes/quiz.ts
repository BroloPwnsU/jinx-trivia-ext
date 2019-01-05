export class Quiz {
    title: string;
    description: string;
    QuizID: number;
    CurrentQuestion: number;
    NumberOfQuestions: number;
    AverageScore: number;
    TimesTaken: number;
    
    Questions: Question[];
}

export class Question {
    Caption: string;
    Explanation: string;
    QuestionNumber: number;

    Answers: Answer[];
}

export class Answer {
    Caption: string;
    Correct: boolean;
    Letter: string;
}