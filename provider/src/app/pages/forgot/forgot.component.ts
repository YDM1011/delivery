import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  public obj = {
    login: ''
  };
  public codeObj = {
    login: '',
    smsCode: '',
    pass: ''
  };
  public error = {
    text: ''
  };
  public showCode = false;
  public showSuccess = false;
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
  }

  forgot(e) {
    e.preventDefault();
    if (this.obj.login === '') {
      this.error['text'] = 'Номер телефона введен не верно';
      return;
    }
    this.crud.post('forgotPass', this.obj, null, false).then((v: any) => {
      if (!v) {return; }
      this.showCode = true;
      this.codeObj.login = this.obj.login;
    });
  }
  code(e) {
    e.preventDefault();
    if (this.codeObj.smsCode === '') {
      this.error['text'] = 'Введите код из смс';
      return;
    }
    if (this.codeObj.pass === '') {
      this.error['text'] = 'Введите новый пароль';
      return;
    }
    this.crud.post('confirmPass', this.codeObj, null, false).then((v: any) => {
      if (!v) {return; }
      this.showSuccess = true;
    }).catch((error) => {
      if (error.error === 'no pass or less 6 symbol') {
        this.error['text'] = 'Слишком слабый пароль! Пароль должен быть минимум 6 символов';
      }
    });
  }
}
