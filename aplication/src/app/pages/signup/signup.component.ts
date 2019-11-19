import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';

interface SignUp {
  login: string;
  pass: string;
  name: string;
  role: string;
  smsCode?: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public verification = false;
  public language;
  public phone;
  public data: SignUp = new class implements SignUp {
    smsCode: string;
    login: string;
    name: string;
    pass: string;
    role: string = 'client';
  };
  public dataError = {login: '', name: '', pass: ''};
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
  public errors = {
    login_err: {ru: 'Введите номер мобильного', ua: 'тест'},
    name_err: {ru: 'Введите ФИО', ua: 'тест'},
    pass_err: {ru: 'Создайте пароль', ua: 'тест'}
  };
  constructor(
    private crud: CrudService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }

  signup(e) {
    e.preventDefault();
    if (this.checkDetaSignUp(this.data)) {return; }
    this.crud.signup(this.data).then(v => {
      console.log(v);
      this.verification = true;
    });
  }

  checkDetaSignUp(data) {
    let isErr = false;
    if (!data.login) {
      this.dataError.login = 'login_err';
      isErr = true;
    }
    if (!data.name) {
      this.dataError.name = 'name_err';
      isErr = true;
    }
    if (!data.pass) {
      this.dataError.pass = 'pass_err';
      isErr = true;
    }
    return isErr;
  }
}
