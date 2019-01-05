import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Quiz, Question, Answer } from '../classes/quiz';
import { MessageService } from '../services/message.service';
import { BroadcasterService } from '../services/broadcaster.service';

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
      if (this.activeQuiz.CurrentQuestion > 0) {
        this.currentQuestion = this.activeQuiz.Questions[this.activeQuiz.CurrentQuestion];
      }
    }
    else {
      this.messageService.add("No active quiz.");
      this.location.go("dashboard");
    }
  }

  constructor(
    private broadcasterService: BroadcasterService,
    private messageService: MessageService,
    private location: Location
  ) { }

  ngOnInit() {
    this.loadActiveQuiz();
  }

}
