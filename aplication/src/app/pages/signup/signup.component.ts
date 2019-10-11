import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../auth.service";

interface SignUp {
  login: string,
  pass: string,
  name: string,
  confirm?: string
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public verification = false;
  public language: string;
  public phone;
  public data:SignUp = new class implements SignUp {
    confirm: string;
    login: string;
    name: string;
    pass: string;
  };
  public dataError = {login:'',name:'',pass:'',};
  public t_nameplaceholder = {
    ru: 'ФИО',
    ua: 'ПІБ'
  };
  public t_submit = {
    ru: 'Продолжить',
    ua: 'Продолжить'
  };
  public t_cancel = {
    ru: 'Отмена',
    ua: 'Отмена'
  };
  public t_enter = {
    ru: 'войти',
    ua: 'войти'
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
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }

  signup(e){
    e.preventDefault()
    if (this.checkDetaSignUp(this.data)) return;
    this.verification = true;
  }

  checkDetaSignUp(data) {
    let isErr = false;
    if (!data.login) {
      this.dataError.login = "login_err";
      isErr = true;
    }
    if (!data.name) {
      this.dataError.name = "login_err";
      isErr = true;
    }
    if (!data.pass) {
      this.dataError.pass = "login_err";
      isErr = true;
    }
    return isErr
  }
}
