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

  versions = [];
  progress = {};
  states = {};

  level: number;
  building: number;
  user: string;
  correctAnswers: number;
  question: any;
  answersList: Array<any> = new Array<any>();

  /**
   *  Inside the parameters we declare the ApiService wich is the one that is going to do the connection to the API.
   *  the logger is the service that is going to do the Log service.
   *  the router is in charge of doing the redirection between components.
   */
  constructor(private service: ApiService, private router: Router, private logger: LogService) { }

  ngOnInit(): void {
    this.resetVariables();
    this.versions = JSON.parse(localStorage.getItem('versions'));
    this.states = JSON.parse(localStorage.getItem('states'));
    this.refreshInfo();
  }

  resetVariables() {
    this.versions = [];
    this.progress = {};
    this.states = {};
  }

  /**
   * This is the wrapper for any function that we are going to call to do the login in the application
   */
  getActions(functions: any, args: any) {
    return functions(args);
  }

  /**
   * This is the function that returns the last version of the states of the application
   */
  getLastVersion(args: any) {
    if (args.versions.length <= 0) {
      return 'v1.0';
    }
    return args.versions[args.versions.length - 1];
  }

  showQuestion() {
    // this.question = this.questions[Math.floor(Math.random() * this.questions.length)];
    const currentVersion = this.getActions(this.getLastVersion, {
      versions: this.versions
    });
    this.question = this.states[currentVersion].questions[Math.floor(Math.random() * this.states[currentVersion].questions.length)];
    this.answersList = this.states[currentVersion].answers.filter(x => x.question_id === this.question.question_id);
  }

  answerQuestion(answer: any) {
    console.log(answer);
    const currentVersion = this.getActions(this.getLastVersion, {
      versions: this.versions
    });

    if (answer.iscorrect) {
      const correctAnswers = this.states[currentVersion].correctAnswers;
      if (correctAnswers >= 2) {
        this.service.answerQuestions(this.states[currentVersion].user, this.level + 1,
          this.building + 1, answer.answer_id).subscribe(resp => {
            if (resp.ok) {
              this.service.getQuestions(this.states[currentVersion].user).subscribe(data => {
                let values = [];
                values = this.getActions(this.updateInfo, {
                  lastVersion: this.getActions(this.getLastVersion, {
                    versions: this.versions
                  }),
                  roundNumber: this.roundNumber,
                  states: this.states,
                  versions: this.versions,
                  progress: this.progress,
                  user: this.states[currentVersion].user,
                  level: this.level + 1,
                  building: this.building + 1,
                  questions: this.getActions(this.filterQuestions, {
                    questions: data.data[0].questions,
                    answers: data.data[0].answers,
                    userAnswers: data.data[0].user_answers
                  }),
                  answers: this.getActions(this.filterAnswers, {
                    questions: this.getActions(this.filterQuestions, {
                      questions: data.data[0].questions,
                      answers: data.data[0].answers,
                      userAnswers: data.data[0].user_answers
                    }),
                    answers: data.data[0].answers,
                  }),
                  correctAnswers: this.getActions(this.calculateCorrectAnswers, {
                    userAnswers: data.data[0].user_answers,
                    questions: data.data[0].questions,
                    answers: data.data[0].answers
                  })
                });
                this.states = values[0];
                this.progress = values[1];
                console.log(this.states);
                console.log(this.versions);
                this.refreshInfo();
                localStorage.setItem('versions', JSON.stringify(this.versions));
                localStorage.setItem('states', JSON.stringify(this.states));
              });
            }
          });
      } else {
        this.service.answerQuestions(this.states[currentVersion].user, this.level + 1,
          this.building, answer.answer_id).subscribe(resp => {
            if (resp.ok) {
              this.service.getQuestions(this.states[currentVersion].user).subscribe(data => {
                console.log(data);
                let values = [];
                values = this.getActions(this.updateInfo, {
                  lastVersion: this.getActions(this.getLastVersion, {
                    versions: this.versions
                  }),
                  roundNumber: this.roundNumber,
                  states: this.states,
                  versions: this.versions,
                  progress: this.progress,
                  user: this.states[currentVersion].user,
                  level: this.level + 1,
                  building: this.building,
                  questions: this.getActions(this.filterQuestions, {
                    questions: data.data[0].questions,
                    answers: data.data[0].answers,
                    userAnswers: data.data[0].user_answers
                  }),
                  answers: this.getActions(this.filterAnswers, {
                    questions: this.getActions(this.filterQuestions, {
                      questions: data.data[0].questions,
                      answers: data.data[0].answers,
                      userAnswers: data.data[0].user_answers
                    }),
                    answers: data.data[0].answers,
                  }),
                  correctAnswers: this.getActions(this.calculateCorrectAnswers, {
                    userAnswers: data.data[0].user_answers,
                    questions: data.data[0].questions,
                    answers: data.data[0].answers
                  })
                });
                this.states = values[0];
                this.progress = values[1];
                console.log(this.states);
                console.log(this.versions);
                this.refreshInfo();
                localStorage.setItem('versions', JSON.stringify(this.versions));
                localStorage.setItem('states', JSON.stringify(this.states));
              });
            }
          });
      }
    } else {
      this.service.answerQuestions(this.states[currentVersion].user, this.level,
        this.building, answer.answer_id).subscribe(resp => {
          if (resp.ok) {
            this.service.getQuestions(this.states[currentVersion].user).subscribe(data => {
              console.log(data);
              let values = [];
              values = this.getActions(this.updateInfo, {
                lastVersion: this.getActions(this.getLastVersion, {
                  versions: this.versions
                }),
                roundNumber: this.roundNumber,
                states: this.states,
                versions: this.versions,
                progress: this.progress,
                user: this.states[currentVersion].user,
                level: this.level,
                building: this.building,
                questions: this.getActions(this.filterQuestions, {
                  questions: data.data[0].questions,
                  answers: data.data[0].answers,
                  userAnswers: data.data[0].user_answers
                }),
                answers: this.getActions(this.filterAnswers, {
                  questions: this.getActions(this.filterQuestions, {
                    questions: data.data[0].questions,
                    answers: data.data[0].answers,
                    userAnswers: data.data[0].user_answers
                  }),
                  answers: data.data[0].answers,
                }),
                correctAnswers: this.getActions(this.calculateCorrectAnswers, {
                  userAnswers: data.data[0].user_answers,
                  questions: data.data[0].questions,
                  answers: data.data[0].answers
                })
              });
              this.states = values[0];
              this.progress = values[1];
              console.log(this.states);
              console.log(this.versions);
              this.refreshInfo();
              localStorage.setItem('versions', JSON.stringify(this.versions));
              localStorage.setItem('states', JSON.stringify(this.states));
            });
          }
        });
    }
  }

  updateInfo(args: any) {
    const newVersion = 'v' + args.roundNumber(Number(args.lastVersion.replace('v', '')) + 1, 1);
    args.versions.push(newVersion);
    args.progress.user = args.user;
    args.progress.building = args.building;
    args.progress.level = args.level;
    args.progress.questions = args.questions;
    args.progress.answers = args.answers;
    args.progress.correctAnswers = args.correctAnswers;
    args.states[newVersion] = args.progress;
    return [args.states, args.versions];
  }

  refreshInfo() {
    const currentVersion = this.getActions(this.getLastVersion, {
      versions: this.versions
    });
    this.level = this.states[currentVersion].level;
    this.building = this.states[currentVersion].building;
    this.user = this.states[currentVersion].user;
    this.correctAnswers = this.states[currentVersion].correctAnswers;
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

  /**
   * This function makes the upgrade of versions
   */
  roundNumber(value: any, decimals: any) {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
  }

  /**
   * This function rigth here filters the avalaible questions for the user in session
   */
  filterQuestions(args: any) {
    console.log(args);
    console.log('user_answers');
    console.log(args.userAnswers);
    console.log('answers');
    console.log(args.answers);
    if (args.userAnswers !== null) {
      // const filteredAnswers = args.answers.filter(x => x.question_id === args.questions[0].question_id);
      const filteredAnswers = args.answers.filter(({question_id}) =>
      args.questions.some(exclude => exclude.question_id === question_id)
      );
      const alreadyAsweredAnswers = filteredAnswers.filter(({answer_id}) =>
        args.userAnswers.some(exclude => exclude.answer_id === answer_id)
      );
      console.log('alreadyAsweredAnswers');
      console.log(alreadyAsweredAnswers);
      const areCorrects = alreadyAsweredAnswers.filter(x => x.iscorrect === true);
      console.log('areCorrects');
      console.log(areCorrects);
      const enableQuestions = args.questions.filter(({question_id}) =>
        !areCorrects.some(exclude => exclude.question_id === question_id)
      );
      console.log('enableQuestions');
      console.log(enableQuestions);
      return enableQuestions;
    }
    return args.questions;
  }

  /**
   * This function filters the answers that belongs to the user questions
   * @param args this variable receives questions and answers
   */
  filterAnswers(args: any) {
    if (args.answers !== null) {
      const enableAnswers = args.answers.filter(({ question_id }) =>
        args.questions.some(exclude => exclude.question_id === question_id)
      );
      // console.log(enableAnswers);
      return enableAnswers;
    }
    return args.answers;
  }

  /**
   * This function returns the number of correct answers at the moment of the user
   */
  calculateCorrectAnswers(args: any) {
    if (args.userAnswers !== null) {
      // const filteredAnswers = args.answers.filter(x => x.question_id === args.questions[0].question_id);
      const filteredAnswers = args.answers.filter(({question_id}) =>
      args.questions.some(exclude => exclude.question_id === question_id)
      );
      const alreadyAsweredAnswers = filteredAnswers.filter(({ answer_id }) =>
        args.userAnswers.some(exclude => exclude.answer_id === answer_id)
      );
      // console.log(alreadyAsweredAnswers);
      const areCorrects = alreadyAsweredAnswers.filter(x => x.iscorrect === true);
      console.log(areCorrects.length);
      return areCorrects.length;
    }
    return 0;
  }

}
