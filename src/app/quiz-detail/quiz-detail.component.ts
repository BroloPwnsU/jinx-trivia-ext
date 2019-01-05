import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    const id = +this.route.snapshot.paramMap.get('id');
    this.broadcasterService.getQuiz(id)
      .subscribe(
        (quiz) => { this.quiz = quiz; this.messageService.add(JSON.stringify(quiz)); },
        (error) => { this.messageService.add(error); }
        );
  }

  startQuiz(): void {
    //Need to initialize the results portion of the quiz.
    //Create a TwitchChannelQuiz record.
    //Create a TwitchChannel record, if necessary.
    //Set the TwitchChannel record equal to the 
  }

  constructor(
    private messageService: MessageService,
    private broadcasterService: BroadcasterService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.loadQuiz();
  }

}
