import { Component, OnInit, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Quiz, Question, Answer } from '../classes/quiz';
import { MessageService } from '../services/message.service';
import { BroadcasterService } from '../services/broadcaster.service';
import { Router } from '@angular/router';

declare var window: any;
const nextQuestionTargetTopic: string = "nextquestion"; 

@Component({
  selector: 'app-quiz-active',
  templateUrl: './quiz-active.component.html',
  styleUrls: ['./quiz-active.component.css']
})
export class QuizActiveComponent implements OnInit {

  devMode: boolean = false;

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

  listenForQuestions(): void {
    //Starts listening for questions to come in over the "nextquestion" blurb
    window.Twitch.ext.listen("broadcast", (target, contentType, payload) => {
      this.zone.run(() => {
        this.messageService.debug("Listen payload: " + payload);

        var payloadObj = JSON.parse(payload);

        this.currentQuestion = payloadObj.message.NextQuestion;

        //this.currentAnswer = payloadObj.message.currentAnswer;
        //this.nextQuestion = payloadObj.message.NextQuestion;

        //if (this.currentAnswer != null) {
          //Show the answer for a few seconds, then go to the next question.
        //}
      });      
    });
  }

  constructor(
    private broadcasterService: BroadcasterService,
    private messageService: MessageService,
    private router: Router,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.listenForQuestions();
    this.loadActiveQuiz();
  }

}
