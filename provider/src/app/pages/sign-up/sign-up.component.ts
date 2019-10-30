import { Component, OnInit } from '@angular/core';
import {CrudService} from '../../crud.service';
interface SignUp {
  login: string;
  pass: string;
  name: string;
  role: string;
  smsCode?: string;
}
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public city = [];
  public cityChoose;
  public language = 'ru';
  public verificationShow = false;
  public company = {
    name: '',
    city: '',
    address: '',
  };

  public client: SignUp = new class implements SignUp {
    smsCode: string;
    login: string;
    name: string;
    pass: string;
    role: string = 'provider';
  };
  public dataError = {login: '', name: '', pass: '', nameCompany: '', address: '', loginError: ''};
  public t_nameplaceholder = {
    ru: 'ФИО',
    ua: 'ПІБ'
  };
  public t_submit = {
    ru: 'Продолжить',
    ua: 'Продолжить'
  };
  public title_signup = {
    ru: 'Регистрация поставщика',
    ua: 'Реєстрація постачальника'
  };
  public t_signup = {
    ru: 'Регистрация',
    ua: 'Регистрация'
  };
  public errors = {
    login_err: {ru: 'Введите номер мобильного', ua: 'Введіть номер телефону'},
    name_err: {ru: 'Введите ФИО', ua: 'Введіть ПІБ'},
    pass_err: {ru: 'Создайте пароль', ua: 'Створіть пароль'},
    nameCompany_err: {ru: 'Введите название компании', ua: 'Введіть назву компанії'},
    address_err: {ru: 'Введите адрес', ua: 'Введіть адресу'},
    login_error: {
      ru: 'Номер уже зарегестрирован в системе',
      ua: 'Номер уже зарегестрирован в системе'
    }
  };
  constructor(
      private crud: CrudService,
  ) { }

  ngOnInit() {
    this.crud.get('city').then((v: any) => {
      if (!v) {return; }
      this.city = v;
      this.cityChoose = this.city[0]._id;
      this.company.city = this.cityChoose;
    });
  }
  changeCity(e) {
    this.company.city = e;
  }
  signup(e) {
    e.preventDefault();
    if (this.checkDetaSignUp(this.client) && this.checkDetaCompanySignUp(this.company)) {return; }
    this.crud.signup(this.client, this.company).then(v => {
      if (v) {
        this.verificationShow = true;
        console.log(v);
      }
    }).catch((error) => {
      if (error) {
        if (error.error.slice(0, 20) === 'User with this login') {
          this.dataError.loginError = 'login_error';
        }
      }
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
  checkDetaCompanySignUp(data) {
    let isErr = false;
    if (!data.name) {
      this.dataError.nameCompany = 'nameCompany_err';
      isErr = true;
    }
    if (!data.address) {
      this.dataError.address = 'address_err';
      isErr = true;
    }
    return isErr;
  }
}
