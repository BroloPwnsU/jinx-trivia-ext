import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Quiz, Question, Answer } from '../classes/quiz';
import { MessageService } from '../services/message.service';
import { BroadcasterService } from '../services/broadcaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-active',
  templateUrl: './quiz-active.component.html',
  styleUrls: ['./quiz-active.component.css']
})
export class QuizActiveComponent implements OnInit {

  //Hosts will be able to trigger the next question, but can't vote.
  hostMode: boolean = true;

   //The quiz won't have any questions or answers in it to start, just title.
   // These will be added via pubsub messages.
  activeQuiz: Quiz = null;

  //Current question will be provided by the pubsub messages.
  currentQuestion: Question = null;
  selectedAnswer: Answer = null;

  loadActiveQuiz(): void {
    this.activeQuiz = this.broadcasterService.activeQuiz;

    if (this.activeQuiz != null) {
      if (this.activeQuiz.NextQuestion != null && this.activeQuiz.CurrentQuestionIndex >= 0) {
        this.activeQuiz[this.activeQuiz.CurrentQuestionIndex] = this.activeQuiz.NextQuestion;
        this.currentQuestion = this.activeQuiz.NextQuestion;
      }
      else {
        //No current question... error.
        this.messageService.add("No current question.");
        this.router.navigateByUrl('/dashboard');
      }
    }
    else {
      this.messageService.add("No active quiz.");
      this.router.navigateByUrl('/dashboard');
    }
  }

  nextQuestion(): void {
    this.broadcasterService.nextQuestion().subscribe(
      (quiz) => {
        this.activeQuiz = this.broadcasterService.activeQuiz;
        this.currentQuestion = this.activeQuiz.NextQuestion;
      },
      (err) => { this.messageService.add(err); }
    );
  }

  constructor(
    private broadcasterService: BroadcasterService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadActiveQuiz();
  }

}
