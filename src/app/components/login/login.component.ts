import { Component, OnInit } from '@angular/core';
import { LogService } from '../../services/log.service';
import { ApiService } from '../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  versions = [];
  progress = {
    user: 'leo',
    level: 1,
    building: 1,
    questions: [],
    correctAnswers: 0
  };
  states = {
    'v1.0': this.progress
  };

  userLogin = '';
  password = '';
  mensaje = false;
  mensaje2 = false;

  /**
   *  Inside the parameters we declare the ApiService wich is the one that is going to do the connection to the API.
   *  the logger is the service that is going to do the Log service.
   *  the router is in charge of doing the redirection between components.
   */
  constructor(private logger: LogService, private service: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Inside the login function we call the validateLogin. Then we call the ApiService to do the authentication
   * and we manage the data in a functional programming way
   */
  login() {
    const flag = this.validateLogin();
    if (flag) {
      this.service.login(this.userLogin, this.password).subscribe(data => {
        console.log(data);
        if (data.ok) {
          localStorage.setItem('token', data.token);
          let values = [];
          // tslint:disable-next-line: no-unused-expression
          values = this.getActions(this.loginUser, {
            lastVersion: this.getActions(this.getLastVersion, {
              versions: this.versions
            }),
            roundNumber: this.roundNumber,
            states: this.states,
            versions: this.versions,
            progress: this.progress,
            user: data.data.user_name,
            building: data.data.building,
            level: data.data.user_level,
            questions: data.data.questions,
            answers: this.getActions(this.filterAnswers, {
              questions: data.data.questions,
              answers: data.data.answers,
              userAnswers: data.data.user_answers,
              userId: data.data.user_id
            }),
            correctAnswers: this.getActions(this.calculateCorrectAnswers, {
              userAnswers: data.data.user_answers,
              questions: data.data.questions,
              answers: data.data.answers
            })
          });
          // this.states = values[0];
          // this.progress = values[1];
          this.logger.info('El usuario ' + localStorage.getItem('user') + ' se logueó en la aplicación');
          this.router.navigate(['/in-game']);
        } else {
          this.logger.error('Ocurrió un error', data);
          this.mensaje = false;
          this.mensaje2 = true;
        }
      });
    } else {
      this.mensaje = true;
    }
  }

  /**
   * This is the wrapper for any function that we are going to call to do the login in the application
   */
  getActions(functions, args) {
    return functions(args);
  }

  /**
   * This is the function that returns the last version of the states of the application
   */
  getLastVersion(args) {
    if (args.versions.length <= 0) {
      return 'v1.0';
    }
    return args.versions[args.versions.length - 1];
  }

  /**
   * This function makes the upgrade of versions
   */
  roundNumber(value, decimals) {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
  }

  /**
   * This function saves the user's data in our states manager
   */
  loginUser(args) {
    const newVersion = 'v' + args.roundNumber(Number(args.lastVersion.replace('v', '')) + 1, 1);
    args.versions.push(newVersion);
    args.progress.user = args.user;
    args.progress.building = args.building;
    args.progress.level = args.level;
    args.progress.questions = args.questions;
    args.progress.answers = args.answers;
    args.states[newVersion] = args.progress;
    return [args.states, args.versions];
  }

  /**
   * This function rigth here filters the avalaible questions for the user in session
   */
  filterAnswers(args) {
    if (args.userAnswers !== null) {
      const filteredAnswers = args.answers.filter(x => x.question_id === args.questions[0].question_id);
      const alreadyAsweredAnswers = filteredAnswers.filter(({answer_id}) =>
        args.userAnswers.some(exclude => exclude.answer_id === answer_id)
      );
      // console.log(alreadyAsweredAnswers);
      const areCorrects = alreadyAsweredAnswers.filter(x => x.iscorrect === true);
      // console.log(areCorrects);
      const enableQuestions = args.questions.filter(({question_id}) =>
        !areCorrects.some(exclude => exclude.question_id === question_id)
      );
      // console.log(enableQuestions);
      return enableQuestions;
    }
    return args.questions;
  }

  /**
   * This function returns the number of correct answers at the moment of the user
   */
  calculateCorrectAnswers(args) {

  }

  /**
   * This function validate all the fields of the html to see if there's any problem with the inputs
   */
  validateLogin() {
    const strongRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');
    if (this.userLogin !== '' || this.password !== '' || this.userLogin !== undefined || this.password !== undefined) {
      if (strongRegex.test(this.password)) {
        this.logger.info('Todas las validaciones fueron cumplidas correctamente');
        return true;
      }
      this.logger.warn('La contraseña en el login no cumplió con los parámetros requeridos');
      return false;
    }
    this.logger.warn('Intento de login sin haber rellenado los campos');
    return false;
  }

}

