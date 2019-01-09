import { Component, OnInit, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Quiz, Question, Answer } from '../classes/quiz';
import { MessageService } from '../services/message.service';
import { BroadcasterService } from '../services/broadcaster.service';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';

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

  //Current question will be provided by the pubsub messages.
  activeQuiz: Quiz = null;
  currentQuestion: Question = null;
  currentQuestionIndex: number = -1;
  correct: boolean = false;

  questionTimerSeconds: number =  environment.questionTimerSeconds;
  answerTimerSeconds: number =  environment.answerTimerSeconds;
  timerIncrements: number = 0.5;
  
  timerRemaining: number = 0;
  timerStartValue: number = 1;
  waitingForNext: boolean = false;
  quizOver: boolean = false;

  listenForQuestions(): void {
    //Starts listening for questions to come in over the "nextquestion" blurb
    this.messageService.debug("Listening for broadcast.");
    
    window.Twitch.ext.listen("broadcast", (target, contentType, payload) => {
      
      var payloadData = JSON.parse(payload);
      //Need to use the zone because this function might get called out of the angular app pipeline.
      // Running this code in the zone makes sure that changes to the data model get enforced in the view.
      this.zone.run(() => {

        console.log("fuck this too2: " + payloadData.message.action);
        //Only handle messages that ask for the next question.
        this.messageService.debug("pubsub action: " + payloadData.message.action);
        if (payloadData.message.action == "nextquestion") {
      
          //The wait is over!
          this.waitingForNext = false;
          //Make sure the page thinks we still alive and kicking puppies!
          this.quizOver = false;

          //Parse the pubsub message into something useful!
          var quizData = payloadData.message.QuizData;
          
          //Make sure the quiz object is the same as the one that came from the pubsub. If this app is
          // out of sync, then we will need to give it up-to-date quiz info.
          if (this.activeQuiz == null || this.activeQuiz.QuizID != quizData.QuizID) {
            this.activeQuiz = new Quiz();
            this.activeQuiz.QuizID = quizData.QuizID;
            this.activeQuiz.Title = quizData.Title;
            this.activeQuiz.Description = quizData.Description;
            this.activeQuiz.NumberOfQuestions = quizData.NumberOfQuestions;
            this.activeQuiz.Questions = [];
          }
          
          this.activeQuiz.NextQuestionIndex = quizData.CurrentQuestionIndex;
          this.activeQuiz.NextQuestion = quizData.CurrentQuestion;
          this.activeQuiz.CurrentQuestionIndex = quizData.PreviousQuestionIndex;
          this.activeQuiz.CurrentAnswer = quizData.PreviousAnswer;

          //If the pubsub sent a correct answer, use it to grade the previous answer.
          if (this.activeQuiz.CurrentAnswer != null) {          
            if (this.currentQuestion != null) {
              this.currentQuestion.CorrectAnswer = this.activeQuiz.CurrentAnswer;

              //Store the question in the activeQuiz question list so we can reference it after the quiz.
              this.activeQuiz.Questions[this.currentQuestionIndex] = this.currentQuestion;
    
              //Now see if they answered it correct.
              if (this.currentQuestion.SelectedAnswer != null 
                && this.currentQuestion.SelectedAnswer.Letter == this.currentQuestion.CorrectAnswer.Letter) {
                this.correct = true;
              }
              else {
                this.correct = false;
              }
            }
            else {
              //We know the correct answer, but there is no selected answer.
              //Mark it zero, Donny.
              this.correct = false;
            }
          }

          this.messageService.debug("NQ: " + this.activeQuiz.NextQuestion + " CA: " + this.activeQuiz.CurrentAnswer);

          //The combination of NextQuestion and CurrentAnswer tells us where we are in the quiz.
          if (this.activeQuiz.NextQuestion != null && this.activeQuiz.CurrentAnswer == null) {
            //First question. Just show the question. No foreplay.
            this.startQuestionScreen();
          }
          else if (this.activeQuiz.NextQuestion != null && this.activeQuiz.CurrentAnswer != null) {
            //Middle question. Grade and save the previous question, show the answer, then show the next question.
            this.startAnswerScreen();
          }
          else if (this.activeQuiz.NextQuestion == null && this.activeQuiz.CurrentAnswer != null) {
            //Last question. Grade and save the previous question, show the answer, then show the quiz summary.
            this.startAnswerScreen();
          }
          else {
            //This message has nothing useful. Why does it even exist?
            console.log("fuck it all");
          }
          
          console.log("fuck this most");
        }
      });      
    });
  }

  startAnswerScreen(): void {
    //TickTimer() counts down to zero, then executes the lambda function shown here.
    this.timerStartValue = this.answerTimerSeconds;
    this.timerRemaining = this.timerStartValue;
    this.tickTimer(() => {
      this.startQuestionScreen();
    });
  }

  startQuestionScreen(): void {
    //Answer timer is over. They've read about their wrongdoing. Now show the next question and clear out the last question's stuff.
    this.correct = false;

    if (this.activeQuiz.NextQuestion != null) {
      this.messageService.debug("CQIndex: " + this.currentQuestionIndex);
      this.currentQuestion = this.activeQuiz.NextQuestion;
      this.currentQuestionIndex = this.activeQuiz.NextQuestionIndex;
      
      //TickTimer() counts down to zero, then executes the lambda function shown here.
      this.timerStartValue = this.questionTimerSeconds;
      this.timerRemaining = this.timerStartValue;
      this.tickTimer(() => {
        //Question timer is over... but we don't have the answer or the next question.
        //Timer will disappear, then we will wait for the pubsub to send us a new question.
        this.waitingForNext = true;
      });
    }
    else {
      //If there is no next question, then we are done here.
      this.startResultsScreen();
    }
  }

  startResultsScreen(): void {
    this.activeQuiz.MyScore = 0;
    for(let questor of this.activeQuiz.Questions) {
      questor.MyScore = 0;
      if (questor.SelectedAnswer != null && questor.CorrectAnswer != null
        && questor.SelectedAnswer.Letter == questor.CorrectAnswer.Letter) {
          questor.MyScore = 1;
          this.activeQuiz.MyScore++;
      }
    }
    this.quizOver = true;
    this.currentQuestion = null;
    this.currentQuestionIndex = -1;
  }

  tickTimer(callback): void {
    //Recursively set tiny timers until the overall timer is down to zero.
    if (this.timerRemaining > 0) {
      this.timerRemaining -= this.timerIncrements;
      if (this.timerRemaining < 0) this.timerRemaining = 0;
      setTimeout(() => {this.tickTimer(callback)}, this.timerIncrements * 1000);
    }
    else {
      //Timer is over. Activate Order 66.
      callback();
    }
  }

  chooseAnswer(answer: Answer): void {
    this.currentQuestion.SelectedAnswer = answer;
  }

  constructor(
    private broadcasterService: BroadcasterService,
    private messageService: MessageService,
    private router: Router,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.listenForQuestions();
  }

}
