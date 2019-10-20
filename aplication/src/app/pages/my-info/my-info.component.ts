import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {Me} from '../../interfaces/me';

@Component({
  selector: 'app-my-info',
  templateUrl: './my-info.component.html',
  styleUrls: ['./my-info.component.scss']
})
export class MyInfoComponent implements OnInit {
  public language: string;
  public pass = 'password';
  public img;
  public me: Me;
  public data = {
    mydata: {ua: 'Мої дані', ru: 'Мои даные'},
    article: {ua: 'Вкажіть Ваше ім\'я і номер телефону', ru: 'Укажите Ваше имя и номер телефона'},
    save: {ua: 'Зберегти', ru: 'Сохранить'},
    back: {ua: 'Назад', ru: 'Назад'}
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.auth.onMe.subscribe(v => {
      if (!v) {return; }
      this.me = v;
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
    // this.crud.post('upload2', {body: body}).then((v: any) => {
    //   if (!v) {return; }
    //   this.img = v.file;
    // }).catch( e => console.log(e));
    this.me.img = null;
    setTimeout(() => {
      this.me.img = body.file;
    }, 0);
  }

  save(e) {
    e.preventDefault();
    this.crud.post('client', this.me, this.me._id).then((v: any) => {
      console.log('success update');
    });
  }
  replace() {
    this.me.img = '';
  }
}
