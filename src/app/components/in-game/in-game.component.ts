import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-in-game',
  templateUrl: './in-game.component.html',
  styleUrls: ['./in-game.component.css']
})
export class InGameComponent implements OnInit {

  question: any;
  versions = ['v1.0'];
  progress = {
    user: 'leo',
    building: 1,
    questions: [],
    correctAnswers: 0
  };
  states = {
    'v1.0': this.progress
  };

  /**
   *  Inside the parameters we declare the ApiService wich is the one that is going to do the connection to the API.
   *  the logger is the service that is going to do the Log service.
   *  the router is in charge of doing the redirection between components.
   */
  constructor(private service: ApiService, private router: Router, private logger: LogService) { }

  ngOnInit(): void {
    this.getQuestions();
    // this.versions = JSON.parse(localStorage.getItem('versions'));
    // this.progress = JSON.parse(localStorage.getItem('progress'));
    // this.states = JSON.parse(localStorage.getItem('states'));
  }

  /**
   * This is the wrapper for any function that we are going to call to do the login in the application
   */
  get_actions(functions, args) {
    return functions(args);
  }

  /**
   * This is the function that returns the last version of the states of the application
   */
  get_last_version(args) {
    return args.versions[-1];
  }

  showQuestion() {
    // this.question = this.questions[Math.floor(Math.random() * this.questions.length)];
  }

  /**
   * 
   * @param args 
   */
  answerQuestion(args) {
    return 'hola';
  }

  getQuestions() {

  }

  /**
   * This function calls the ApiService to do the logout of the application
   */
  logout() {
    this.service.logout().subscribe(data => {
      if (data.ok) {
        localStorage.clear();
        this.router.navigate(['/login']);
      } else {
        this.logger.error('Ocurrió un error al desloguear', data);
      }
    });
  }

}
