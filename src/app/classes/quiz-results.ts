import { ViewerResult } from './viewer-result';
import { Quiz } from './quiz';

export class QuizResults {
    quiz: Quiz;
    averageScore: number;
    viewers: ViewerResult[];
}