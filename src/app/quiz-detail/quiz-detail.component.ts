import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from '../services/message.service';
import { BroadcasterService } from '../services/broadcaster.service';
import { Quiz } from '../classes/quiz';

@Component({
  selector: 'app-quiz-detail',
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.css']
})
export class QuizDetailComponent implements OnInit {

  quiz: Quiz;

  loadQuiz(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.broadcasterService.getQuiz(id)
      .subscribe(
        (quiz) => { this.quiz = quiz; },
        (error) => { this.messageService.add(error); }
        );
  }

  startQuiz(): void {
    //Need to initialize the results portion of the quiz.
    //Create a Quiz record for this Channel. Set current question to 0.
    // -> If the record already exists, reset the current question to 0.
    //Create a TwitchChannel record, if necessary.
    //Set the TwitchChannel ActiveQuizID setting to this quiz ID
    this.broadcasterService.startQuiz(this.quiz.QuizID).subscribe(
      (quiz) => { this.router.navigateByUrl('/active'); },
      (err) => { this.messageService.add(err); }
    );
    //Redirect to the active quiz page. This page will have the timer that
    // triggers the next questions and shows the active question.
    //Interface can be very similar to the viewer's interface, minus the voting button.
    
  }

  constructor(
    private messageService: MessageService,
    private broadcasterService: BroadcasterService,
    private route: ActivatedRoute,
		private router: Router
  ) { }

  ngOnInit() {
    this.loadQuiz();
  }

}
