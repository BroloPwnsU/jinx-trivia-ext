import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {MessageService} from './message.service';
import {UserService} from './user.service';
import {AuthHttpClient} from './auth-http-client.service';

import {Quiz} from '../classes/quiz';
import {QuizResults} from '../classes/quiz-results';

@Injectable({
  providedIn: 'root'
})
export class BroadcasterService implements OnInit {

    broadcasterUrl: string = "https://8tvnwrbrze.execute-api.us-east-2.amazonaws.com/default/trivia-broadcaster";

    getQuizList(): Observable<Quiz[]> {
        const payload = {
            'action': 'getquizlist'
        };

        return this.authHttp.post<Quiz>(this.broadcasterUrl, JSON.stringify(payload)).pipe(
            //tap(order => { this.order = <Order>order; }),
            catchError(this.handleError(payload.action, null))
        );
    }

    getQuiz(quizId: number): Observable<Quiz> {
        const payload = {
            action: 'getquiz',
            quizId: quizId
        };

        return this.authHttp.post<Quiz>(this.broadcasterUrl, payload).pipe(
            //tap(order => { this.order = <Order>order; }),
            catchError(this.handleError(payload.action, null))
        );
    }

    startQuiz(quizId: number): Observable<QuizResults> {
        const payload = {
            action: 'startquiz',
            quizId: quizId
        }

        return this.authHttp.post<QuizResults>(this.broadcasterUrl, payload).pipe(
            //tap(order => { this.order = <Order>order; }),
            catchError(this.handleError(payload.action, null))
        );
    }

    nextQuestion(): Observable<QuizResults> {
        const payload = {
            action: 'nextquestion'
        };

        return this.authHttp.post<QuizResults>(this.broadcasterUrl, payload).pipe(
            //tap(order => { this.order = <Order>order; }),
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
        console.log("broadcaster service");
    }
}
