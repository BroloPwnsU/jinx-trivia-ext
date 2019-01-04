export class ViewerResult {
    viewerId: string;
    score: number;
    questions: ViewerAnswer[];
}

export class ViewerAnswer {
    questionNumber: number;
    answers: string[];
}