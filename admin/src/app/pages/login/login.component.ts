import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CrudService} from "../../crud.service";
import {AuthService} from "../../auth.service";

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
      private auth: AuthService,
      private route: Router
  ) { }

  ngOnInit() {
  }
  signIn(e) {
    e.preventDefault();
    if (this.obj.login === '') {
      this.error['text'] = 'Номер телефона введен не верно';
      return;
    }
    if (this.obj.pass === '') {
      this.error['text'] = 'Пароль введен не верно';
      return;
    }
    this.crud.post('adminSignin', this.obj, null, false).then((v: any) => {
      if (!v) return;
      console.log(v);
      localStorage.setItem('adminId', v.adminId);
      localStorage.setItem('adminToken', v.token);
      this.obj = {
        login: '',
        pass: ''
      };
      this.route.navigate(['']);
    }).catch((error) => {
      if (error.status === 404) {
        this.error['text'] = 'Логин или пароль введены не верно';
      }
    });
  }
}
