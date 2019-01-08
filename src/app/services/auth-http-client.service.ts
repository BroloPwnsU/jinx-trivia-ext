import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from './user.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthHttpClient {

  get<T>(url: string): Observable<T> {
      const header = new HttpHeaders({
          'Authorization': this.userService.userAuth.token
      });

      return <Observable<T>>this.http.get(
          url
          , { headers: header }
      );
  }

  post<T>(url: string, data): Observable<T> {
      const header = new HttpHeaders({
          'Authorization': this.userService.userAuth.token
      });
      return <Observable<T>>this.http.post(
          url
          , data
          , { headers: header }
      );
  }

  postInsecure<T>(url: string, data): Observable<T> {
      
      return <Observable<T>>this.http.post(
          url
          , data
      );
  }

  appendAuthParams(authUrl: string): string {
    let authParams: string = this.userService.buildUserAuthParams(false);
    if (authUrl.indexOf("?") > -1) {
      return authUrl + "&" + authParams;
    }
    else {
      return authUrl + "?" + authParams;
    }
  }

  constructor(
      private http: HttpClient,
      private userService: UserService
      ) {}
}