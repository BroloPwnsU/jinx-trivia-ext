import { Component, OnInit } from '@angular/core';
import { Quiz, Question, Answer } from '../classes/quiz';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-quiz-active',
  templateUrl: './quiz-active.component.html',
  styleUrls: ['./quiz-active.component.css']
})
export class QuizActiveComponent implements OnInit {

  activeQuiz: Quiz;
  currentQuestion: Question;
  selectedAnswer: Answer;

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit() {
  }

}
