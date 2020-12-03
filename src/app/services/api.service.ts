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
  // baseUrl = 'http://localhost:5000/';

  /**
   * This contructor initialize the first time that the service get loaded
   * @param http this is the service that performs HTTP calls
   * @param logger this is the Logger service that performs all the logs
   *
   */
  constructor(private http: HttpClient, private logger: LogService) { }

  /**
   * The register function sends the parameters to register a new user
   * @param email the user email
   * @param userLogin the user name
   * @param password the user password
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

  /**
   * This funtion post all the information of the user answers
   * @param userLogin the user name
   * @param level the user level
   * @param building the user building level
   * @param answerId the answerId that belongs to an especific question
   */
  answerQuestions(userLogin, level, building, answerId): Observable<any> {
    const url = `${this.baseUrl}game_000/game_001/answerQuestions`;
    const data = {
      userLogin,
      level,
      building,
      answerId
    };
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    });
    return this.http.post(url, data, {headers: httpOptions}).pipe(
      catchError(this.error)
    );
  }

  /**
   * This function get the questions of an specific
   * @param user this is the current user
   */
  getQuestions(user): Observable<any> {
    const url = `${this.baseUrl}game_000/game_001/getQuestions/${user}`;
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    });
    return this.http.get(url, {headers: httpOptions}).pipe(
      catchError(this.error)
    );
  }

  /**
   * The login function sends the parameteres to authenticate an existing user
   * @param userLogin this is the username
   * @param password this is the user password
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

  /**
   * The logout function calls the logout service and with the token in the header disconnect the user from the application
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

  /**
   * This function handles the error
   * @param error this is the error to handler
   */
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
