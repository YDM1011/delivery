import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {NavigationEnd, Router} from '@angular/router';
import {Me} from '../../interfaces/me';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public language: string;
  public url;
  public me: Me;
  public data = {
    mydata: {ua: 'Мої дані', ru: 'Мои данные'},
    address: {ua: 'Aдреси доставки', ru: 'Адреса доставки'},
    enter: {ua: 'Вхід', ru: 'Вход'},
    exit: {ua: 'Вихід', ru: 'Выйти'}
  };
  public login: boolean = false;
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private route: Router
  ) { }

  ngOnInit() {
    this.url = decodeURI(this.route.url.substring(4));
    this.route.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.url = decodeURI(this.route.url.substring(4));
    });
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.auth.onMe.subscribe(v => {
      if (!v) {return; }
      this.me = v;
    });
    this.login = this.auth.isAuth();
  }

  logut() {
    this.crud.post('logout', {}, null).then((v: any) => {
      if (v) {
        this.auth.setBasketCount(0);
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        this.route.navigate(['/']);
      }
    });
  }
}
