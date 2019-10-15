import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {Router} from "@angular/router";
import {CrudService} from "../../crud.service";

interface SignIn {
  login: string,
  pass: string,
  role: string,
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  public language: string;
  public data:SignIn = new class implements SignIn {
    login: string;
    pass: string;
    role: string = 'client';
  };
  public dataError = {login:'',name:'',pass:'',};
  public t_enter = {
    ru: 'Войти',
    ua: 'Войти'
  };
  public t_cancel = {
    ru: 'Отмена',
    ua: 'Отмена'
  };
  public t_or = {
    ru: 'или',
    ua: 'или'
  };
  public t_signup = {
    ru: 'Регистрация',
    ua: 'Регистрация'
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private route: Router
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }

  signin(e) {
    e.preventDefault();
    if (this.checkDetaSignUp(this.data)) return;
    this.crud.signin(this.data).then((v:any)=>{
      localStorage.setItem('userId', v.userId);
      localStorage.setItem('token', v.token);
      this.auth.setMe(v.user);
      this.route.navigate(['']);
    })
  }

  checkDetaSignUp(data) {
    let isErr = false;
    if (!data.login) {
      this.dataError.login = "login_err";
      isErr = true;
    }
    if (!data.pass) {
      this.dataError.pass = "pass_err";
      isErr = true;
    }
    return isErr
  }
}
