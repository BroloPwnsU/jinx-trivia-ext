import { Component, OnInit, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Quiz, Question, Answer } from '../classes/quiz';
import { MessageService } from '../services/message.service';
import { BroadcasterService } from '../services/broadcaster.service';
import { Router } from '@angular/router';

declare var window: any;
const nextQuestionTargetTopic: string = "nextquestion"; 

@Component({
  selector: 'app-quiz-manager',
  templateUrl: './quiz-manager.component.html',
  styleUrls: ['./quiz-manager.component.css']
})
export class QuizManagerComponent implements OnInit {

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

        //Send a pubsub message to all the viewers so they get the new question.
        //The pubsub message will also come back to this panel.
        window.Twitch.ext.send(
          "broadcast",
          "application/json",
          {"content_type":"application/json", "message":{"NextQuestion": this.activeQuiz.NextQuestion}, "targets":["broadcast"]}
        );
      },
      (err) => { this.messageService.add(err); }
    );
  }

  listenForQuestions(): void {
    //Starts listening for questions to come in over the "nextquestion" blurb
    window.Twitch.ext.listen("broadcast", (target, contentType, payload) => {
      this.zone.run(() => {
        this.messageService.debug("Listen payload: " + payload);

        var payloadObj = JSON.parse(payload);
        this.currentQuestion = payloadObj.message.NextQuestion;
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
