import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";
import {AuthService} from "../../auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public error = {
    text: ''
  };
  public obj = {
    login: '',
    pass: ''
  };
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
  }
  signIn() {
    if (this.obj.login === '') {
      Swal.fire('Error', 'Введите номер телефона', 'error');
      return;
    }
    if (this.obj.pass === '') {
      Swal.fire('Error', 'Введите пароль', 'error');
      return;
    }
    this.crud.post('signIn', this.obj).then((v: any) => {
      this.auth.setMe(v);
    }).catch((error) => {
    if (error.status === 404) {
      this.error['text'] = 'Логин или пароль введены не верно';
    }
    });
  }
}
