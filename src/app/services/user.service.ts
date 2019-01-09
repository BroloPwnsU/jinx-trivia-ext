import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {MessageService} from './message.service';
import {TwitchAuth} from '../classes/twitch-auth';

declare var amazon: any;

@Injectable({
  providedIn: 'root'
})
export class UserService  {

	userAuth: TwitchAuth = null; // this.fakeTwitchAuth();
	userAuthStorageKey: string = "app-user-auth";

	accessToken: string;
	accessTokenStorageKey: string = 'app-access-token';
    
	private loadTwitchAuth(theKey: string): TwitchAuth {
		let obj = JSON.parse(this.loadSomething(theKey));
		
		if (obj != null) {
			let auth = new TwitchAuth();
			auth.Token = obj.Token;
			auth.UserID = obj.UserID;
			auth.ChannelID = obj.ChannelID;
			return auth;
		}

		return null;
	}

	storeTwitchAuth(theKey: string, auth: TwitchAuth): void {
		let theString = JSON.stringify(auth);
		this.storeSomething(theKey, theString);
	}

	private loadSomething(theKey: string): string {
		return sessionStorage.getItem(theKey);
	}

	private storeSomething(theKey: string, theString: string): void {
		sessionStorage.setItem(theKey, theString);
	}

	clearStorage(): void {
		sessionStorage.clear();
	}
		
	logoutAmazonPay(): void {
		this.clearStorage();

		amazon.Login.logout();
		document.cookie = "amazon_Login_accessToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT";

		this.setAccessToken(null);		
		this.router.navigateByUrl('/terminator');
	}

	setAccessToken(accessToken: string): void { 
		this.accessToken = accessToken;
		this.storeSomething(this.accessTokenStorageKey, this.accessToken);
		
		//Also cookie it if necessary
		if (typeof this.accessToken === 'string' && this.accessToken.match(/^Atza/)) {
			document.cookie = "amazon_Login_accessToken=" + this.accessToken; // + ";secure";
		}
	}

	getAccessToken(): string {
		if (this.accessToken == null)
			this.accessToken = this.loadSomething(this.accessTokenStorageKey);
		return this.accessToken;
	}
	
    setUserAuth(userAuth: TwitchAuth) {
        this.userAuth = userAuth;
		this.storeTwitchAuth(this.userAuthStorageKey, this.userAuth);

        //this.messageService.debug(`Set Twitch user userId(${userAuth.userId})`);
        //this.messageService.debug(`Set Twitch user token(${userAuth.token})`);
        //this.messageService.debug(`Set Twitch user channelId(${userAuth.channelId})`);
    }

    getUserAuth(): TwitchAuth {
		if (this.userAuth == null)
			this.userAuth = this.loadTwitchAuth(this.userAuthStorageKey);
		return this.userAuth;
	}
	
	constructor(
		private messageService: MessageService,
		private router: Router
		) {		
	}

	ngOnInit(): void {
        console.log("user service init");
		//this.accessToken = this.loadSomething(this.accessTokenStorageKey);
        //this.userAuth = this.loadTwitchAuth(this.userAuthStorageKey);
	}
}
