import { Component, NgZone } from '@angular/core';
import { UserService } from './services/user.service';
import { MessageService } from './services/message.service';
import { BroadcasterService } from './services/broadcaster.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'J!NX Trivia';

  authLoaded: boolean = false;

  fakeAuth(): void {
    this.broadcasterService.getFakeAuth().subscribe(
      (auth) => { this.setUserAuth(auth); },
      (err) => {this.messageService.add(err); }
    )
  }

	setUserAuth(twitchAuth): void {
    this.zone.run(() => {
      this.userService.setUserAuth(twitchAuth);
      this.authLoaded = true;
      this.messageService.debug("Set user auth: " + twitchAuth.token);
    });
  }
  
  nextQuestion(question): void {
    //need to pipe this into the app.
  }

	constructor(
		private userService: UserService,
		private messageService: MessageService,
		private broadcasterService: BroadcasterService,
		public zone: NgZone
		)
	{
		if ((<any>window).twitchTunnel != null 
			&& (<any>window).twitchTunnel.authObject != null)
		{
			console.log("Existing auth");
			this.setUserAuth((<any>window).twitchTunnel.authObject);
		}

	    (<any>window).twitchTunnel = {
	      zone: this.zone, 
        setTwitchAuth: (value) => this.setUserAuth(value),
        nextQuestion: (value) => this.nextQuestion(value),
	      component: this
	    };
	    this.messageService.add('Twtich tunnel drilled.');
	}
}
