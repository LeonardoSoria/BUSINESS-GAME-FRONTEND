import { Component, OnInit } from '@angular/core';
import { LogService } from '../../services/log.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userLogin = '';
  email = '';
  password = '';
  mensaje: number;

  /**
   * This contructor initialize the first time that the component get loaded
   * @param service ApiService wich is the one that is going to do the connection to the API.
   * @param router the router is in charge of doing the redirection between components.
   * @param logger this is the service that is going to do the Log service.
   */
  constructor(private logger: LogService, private service: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Inside the register function we call the validaRegister function. Then the ApiService is the instance that is
   * to register the user in the database
   */
  register() {
    const flag = this.validateRegister();
    if (flag === 0) {
      this.service.register(this.email, this.userLogin, this.password).subscribe(data => {
        if (data.ok) {
          this.logger.info('El usuario ' + localStorage.getItem('user') + ' se registró en la aplicación');
          this.router.navigate(['/login']);
        } else {
          this.logger.error('Ocurrió un error', data);
        }
      });
    }
    if (flag === 1) {
      this.mensaje = flag;
    }
    if (flag === 2) {
      this.mensaje = flag;
    }
    if (flag === 3) {
      this.mensaje = flag;
    }
  }

  /**
   * The validate function uses regular expresions to validate the inputs of the register fileds
   */
  validateRegister() {
    const strongRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');
    const emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    if (this.userLogin !== '' || this.password !== '' || this.email !== '' ||
      this.userLogin !== undefined || this.password !== undefined || this.email !== undefined) {
      if (strongRegex.test(this.password)) {
        if (emailRegex.test(this.email)) {
          this.logger.info('Todas las validaciones fueron cumplidas correctamente');
          return 0;
        }
        this.logger.warn('El email no cumple con los parametros necesarios');
        return 3;
      }
      this.logger.warn('La contraseña no cumple con los parametros necesarios');
      return 2;
    }
    this.logger.warn('Intento de registro sin haber rellenado los campos');
    return 1;
  }
}


