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
  correct: boolean = false;

  questionTimerSeconds: number = 10;
  answerTimerSeconds: number = 5;
  timerIncrements: number = 0.1;
  timerRemaining: number = 0;
  waitingForNext: boolean = false;

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

        //If there's a previous answer, attach it to the question.
        if (payloadObj.message.CorrectAnswer != null && this.selectedAnswer != null) {
          this.currentQuestion.CorrectAnswer = payloadObj.message.CorrectAnswer;
          
          if (this.selectedAnswer.Letter == this.currentQuestion.CorrectAnswer.Letter) {
            this.correct = true;
          }
          else {
            this.correct = false;
          }
        }

        this.startAnswerScreen();
      });      
    });
  }

  startAnswerScreen(): void {
    this.timerRemaining = this.answerTimerSeconds;
    this.tickTimer(() => {
      //Answer timer is over. They've read about they're wrongdoing. Now show the next question.
      this.currentQuestion = this.activeQuiz.NextQuestion;
      this.currentQuestion.CorrectAnswer = null;

      this.startQuestionScreen();
    });
  }

  startQuestionScreen(): void {
    this.timerRemaining = this.questionTimerSeconds;
    this.tickTimer(() => {
      //Question timer is over... but we don't kick over until the twitch listener receives a new question.
      //Timer will disappear, but we need the answers to disappear, too.
      //This boolean will hide those answers.
      this.waitingForNext = true;
    });
  }

  tickTimer(callback): void {
    //Recursively set tiny timers until the overall timer is down to zero.
    if (this.timerRemaining > 0) {
      this.timerRemaining -= this.timerIncrements;
      if (this.timerRemaining < 0) this.timerRemaining = 0;
      setTimeout(() => {this.tickTimer(callback)}, this.timerIncrements);
    }
    else {
      //Timer is over. Activate Order 66.
      callback();
    }
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
