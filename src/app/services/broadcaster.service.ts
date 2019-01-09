import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import {MessageService} from './message.service';
import {UserService} from './user.service';
import {AuthHttpClient} from './auth-http-client.service';

import {Quiz} from '../classes/quiz';
import {QuizResults} from '../classes/quiz-results';
import { TwitchAuth } from '../classes/twitch-auth';

@Injectable({
  providedIn: 'root'
})
export class BroadcasterService implements OnInit {

    broadcasterUrl: string = "https://8tvnwrbrze.execute-api.us-east-2.amazonaws.com/default/trivia-broadcaster";

    activeQuiz: Quiz = null;

    getQuizList(): Observable<Quiz[]> {
        const payload = {
            'action': 'getquizlist'
        };

        //Won't get the questions, just the quiz titles and basic deets.
        return this.authHttp.post<Quiz>(this.broadcasterUrl, JSON.stringify(payload)).pipe(
            catchError(this.handleError(payload.action, null))
        );
    }

    getQuiz(quizId: string): Observable<Quiz> {
        const payload = {
            action: 'getquiz',
            QuizID: quizId
        };

        //Won't get the whole quiz, just some basic details.
        return this.authHttp.post<Quiz>(this.broadcasterUrl, payload).pipe(
            //tap(order => { this.order = <Order>order; }),
            catchError(this.handleError(payload.action, null))
        );
    }

    startQuiz(quizID: string): Observable<Quiz> {
        const payload = {
            action: 'startquiz',
            QuizID: quizID
        }

        return this.authHttp.post<Quiz>(this.broadcasterUrl, payload).pipe(
            tap(activeQuiz => {
                this.activeQuiz = <Quiz>activeQuiz;
                this.messageService.add(activeQuiz.Title);
            }),
            catchError(this.handleError(payload.action, null))
        );
    }

    nextQuestion(): Observable<any> {
        const payload = {
            action: 'nextquestion',
            QuizID: this.activeQuiz.QuizID
        };

        return this.authHttp.post<any>(this.broadcasterUrl, payload).pipe(
            /*tap(quiz => {
                //First save the last question.
                this.activeQuiz[quiz.CurrentQuestionIndex] = this.activeQuiz.NextQuestion;

                //Now set the next question from the one that was returned.
                this.activeQuiz.CurrentQuestionIndex = quiz.CurrentQuestionIndex;
                this.activeQuiz.NextQuestion = quiz.NextQuestion;
            }),*/
            catchError(this.handleError(payload.action, null))
        );
    }

    getFakeToken(): Observable<string> {
        const payload = {
            action: 'faketoken'
        }

        return this.authHttp.postInsecure<string>(this.broadcasterUrl, payload).pipe(
            tap(auth => { this.messageService.add("faked! " + auth)}),
            catchError(this.handleError(payload.action, null))
        );
    }

    verifyUserAuth(token: string): Observable<TwitchAuth> {
        //Verify the token details in the backend.
        const payload = {
            action: 'verifyauth',
            token: token
        }

        return this.authHttp.postInsecure<TwitchAuth>(this.broadcasterUrl, payload).pipe(
            //tap(auth => { this.messageService.add("faked!")}),
            catchError(this.handleError(payload.action, null))
        );
    }

	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T> (operation = 'operation', result?: T) {
	  return (error: any): Observable<T> => {
	    this.logError(`${operation} failed: ${error.message}`);
     
        // Let the app keep running by returning an empty result.
        //return of(result as T);

        //Don't want the app to keep running.
        throw error;
	  };
	}

	private logError(message: string) {
		this.messageService.add(`OrderService: ${message}`, true);
	}

	constructor(
        private userService: UserService,
        private messageService: MessageService,
        private authHttp: AuthHttpClient
        ) {
    }
    
    ngOnInit(): void {
    }
}
