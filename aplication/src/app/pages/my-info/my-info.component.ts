import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {Me} from '../../interfaces/me';
import {MatSnackBar} from '@angular/material';
@Component({
  selector: 'app-my-info',
  templateUrl: './my-info.component.html',
  styleUrls: ['./my-info.component.scss']
})
export class MyInfoComponent implements OnInit {
  public language;
  public pass = 'password';
  public img;
  public me: Me;
  public copyMe;
  public isBlok = false;
  public data = {
    mydata: {ua: 'Мої дані', ru: 'Мои даные'},
    article: {ua: 'Вкажіть Ваше ім\'я і номер телефону', ru: 'Укажите Ваше имя и номер телефона'},
    save: {ua: 'Зберегти', ru: 'Сохранить'},
    saved: {ua: 'Збережено', ru: 'Сохранино'},
    back: {ua: 'Назад', ru: 'Назад'},
    input: {ua: 'ПІП', ru: 'ФИО'}
  };
  public snackMessage = {
    ru: 'Даные сохранены',
    ua: 'Дані збережено'
};
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.auth.onMe.subscribe(v => {
      if (!v) {return; }
      this.me = v;
      this.copyMe = Object.assign({}, this.me)
    });
  }

  showPass() {
    if (this.pass !== 'password') {
      this.pass = 'password';
    } else {
      this.pass = 'text';
    }
  }
  onFs(body) {
    if (this.me.img === body.file) {
      return this.me.img = null;
    }
    this.me.img = null;
    setTimeout(() => {
      this.me.img = body.file;
      body = null;
      this.crud.post('client', {img: this.me.img}, this.me._id).then((v: any) => {
        this.openSnackBar(this.snackMessage[this.language],  'Ok');
      });
    }, 0);
  }

  save(e) {
    e.preventDefault();
    this.crud.post('client', {name: this.me.name, mobile: this.me.mobile, img: this.me.img}, this.me._id).then((v: any) => {
      this.me = v;
      this.copyMe = Object.assign({}, this.me);
      this.formCheck();
      this.openSnackBar(this.snackMessage[this.language],  'Ok');
    });
  }
  replace() {
    this.me.img = '';
  }

  validate() {
    let isTrue = false;
    for (const key in this.me) {
      if (this.me[key] !== this.copyMe[key]) {isTrue = true; }
    }
    return isTrue;
  }

  btnBlok(is) {
    this.isBlok = is;
  }

  formCheck() {
    this.btnBlok(this.validate());
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
