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
  selector: 'app-quiz-manager',
  templateUrl: './quiz-manager.component.html',
  styleUrls: ['./quiz-manager.component.css']
})
export class QuizManagerComponent implements OnInit {

   //The quiz won't have any questions or answers in it to start, just title.
   // These will be added via pubsub messages.
  activeQuiz: Quiz = null;
  quizStarted: boolean = false;
  quizEnded: boolean = false;

  loadActiveQuiz(): void {
    this.activeQuiz = this.broadcasterService.activeQuiz;

    if (this.activeQuiz != null) {
      //Wait for the button press to start the quiz.
    }
    else {
      this.messageService.add("No active quiz.");
      this.router.navigateByUrl('/dashboard');
    }
  }
  
  nextQuestion(): void {
    this.quizStarted = true;

    //Grab the next question from the database.
    this.broadcasterService.nextQuestion().subscribe(
      (quizData) => {

        //Send a pubsub message to all the viewers so they get the new question.
        //The pubsub message will also come back to this panel.
        window.Twitch.ext.send(
          "broadcast",
          "application/json",
          {
            "content_type":"application/json",
            "message": {
              "action": "nextquestion",
              "QuizData": quizData
            },
            "targets":["broadcast"]
          }
        );

        if (quizData.CurrentQuestion != null) {
          //Once we've sent the pubsub, set a timer for when to pull the next question/answer.
          //This timer will not be visible on the quiz page. It's an internal timer.
          //Needs to be long enough to wait for the question period and the answer period.
          var totalTimerSeconds = environment.questionTimerSeconds + environment.pubsubBufferSeconds;
          if (quizData.PreviousAnswer != null) {
            //Only add time for an answer if this is not the first question.
            totalTimerSeconds += environment.answerTimerSeconds;
          }

          setTimeout(() => {
            //Automatically request another question.
            this.nextQuestion();
          },
          totalTimerSeconds * 1000);
        }
        else {
          //No more questions. The manager can disengage.
          this.quizEnded = true;
        }
      },
      (err) => { this.messageService.add(err); }
    );
  }

  constructor(
    private broadcasterService: BroadcasterService,
    private messageService: MessageService,
    private router: Router,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.loadActiveQuiz();
  }

}
