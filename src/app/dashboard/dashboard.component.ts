import { Component, OnInit } from '@angular/core';
import { Quiz } from '../classes/quiz';
import { BroadcasterService } from '../services/broadcaster.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  quizzes: Quiz[];

  loadQuizList(): void {
    //Grab all the quizzes ever from the service.
    this.broadcasterService.getQuizList().subscribe(
      (quizList) => { this.quizzes = quizList; }
      , (error) => { this.messageService.add(error, true); }
    );
  }

  constructor(
    private broadcasterService: BroadcasterService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    console.log("dashboard component");
    this.loadQuizList();
    this.messageService.add("dashboard component finished init.");
  }

}
