import { Component, OnInit } from '@angular/core';
import {MessageService} from '../services/message.service';
import {Notification} from '../classes/notification';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

	showMessages: boolean = false;
	notifications: Notification[] = new Array();

	clear(): void {
		this.messageService.clear();
	}

	loadNotifications(): void {
		this.notifications = this.messageService.notifications;
	}

	toggleMessages(): void {
		this.showMessages = (this.showMessages) ? false : true;
	}

	constructor(
		public messageService: MessageService
		)
	{ }

	ngOnInit() {
		console.log("message component");
		this.loadNotifications();
	}

}
