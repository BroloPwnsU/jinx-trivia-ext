import { Component, NgZone } from '@angular/core';
import { UserService } from './services/user.service';
import { MessageService } from './services/message.service';
import { BroadcasterService } from './services/broadcaster.service';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'J!NX Trivia';

  authLoaded: boolean = false;
  authError: boolean = false;
  role: string = "loading";

  fakeAuth(): void {
    this.broadcasterService.getFakeToken().subscribe(
      (token) => { this.verifyUserToken(token); },
      (err) => {this.messageService.add(err); }
    )
  }

  verifyUserToken(token: string): void {
    //Before letting the user play trivia, we need to verify their Twitch identity on our server.
    // Their Twitch identity will tell us if they are the broadcaster or not.
    this.broadcasterService.verifyUserAuth(token).subscribe(
      (validAuth) => { this.setUserAuth(validAuth); },
      (err) => {
        this.authError = true;
        this.messageService.add("Invalid authentication. Please refresh the page and try again.");
      }
    );
  }

	setUserAuth(twitchAuth): void {
    this.zone.run(() => {
      console.log(twitchAuth.role);
      this.userService.setUserAuth(twitchAuth);
      this.role = twitchAuth.Role;
      this.authLoaded = true;

      //Now we navigate elsewhere. The destination depends on the role...
      if (twitchAuth.Role == 'broadcaster') {
        this.router.navigateByUrl('/dashboard');
      }
      else {
        this.router.navigateByUrl('/active');
      }
    });
  }
  
  nextQuestion(question): void {
    //need to pipe this into the app.
  }

	constructor(
		private userService: UserService,
		private messageService: MessageService,
		private broadcasterService: BroadcasterService,
    public zone: NgZone,
    private router: Router
		)
	{
		if ((<any>window).twitchTunnel != null 
			&& (<any>window).twitchTunnel.token != null)
		{
			console.log("Existing auth");
			this.verifyUserToken((<any>window).twitchTunnel.token);
		}

	    (<any>window).twitchTunnel = {
	      zone: this.zone, 
        verifyUserToken: (token) => this.verifyUserToken(token),
	      component: this
	    };
	    this.messageService.add('Twtich tunnel drilled.');
	}
}
