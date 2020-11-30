import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'https://business-game-backend.herokuapp.com/';

  /*  Inside the parameters we declare the httpClient wich is the one that is going to do the connection to the API
      and the logger is the service that is going to do the Log service*/
  constructor(private http: HttpClient, private logger: LogService) { }

  /*  The register function sends the parameters to register a new user
  */
  register(email, userLogin, password): Observable<any> {
    const data = {
      userLogin,
      password,
      email
    };
    const url = `${this.baseUrl}auth_000/auth_001/register`;
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(url, data, {headers}).pipe(
      catchError(this.error)
    );
  }

  /*  The login function sends the parameteres to authenticate an existing user
  */
  login(userLogin, password): Observable<any> {
    const data = {
      userLogin,
      password
    };
    const url = `${this.baseUrl}auth_000/auth_001/login`;
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(url, data, {headers}).pipe(
      catchError(this.error)
    );
  }

  /*  The logout function calls the logout service and with the token in the header disconnect the user from
      the application
  */
  logout(): Observable<any> {
    const url = `${this.baseUrl}auth_000/auth_001/logout`;
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    });
    return this.http.post(url, {}, {headers: httpOptions}).pipe(
      catchError(this.error)
    );
  }

  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.logger.error(errorMessage);
    return throwError(errorMessage);
  }
}
