import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private settings = new BehaviorSubject<any>(null);
  public onSettings = this.settings.asObservable();

  private translate = new BehaviorSubject<any>(null);
  public onTranslate = this.translate.asObservable();

  private dateTranslator = new BehaviorSubject<any>(null);
  public onDateTranslator = this.dateTranslator.asObservable();

  private language = new BehaviorSubject<any>(null);
  public onLanguage = this.language.asObservable();

  private checkBasket = new BehaviorSubject<any>(null);
  public onCheckBasket = this.checkBasket.asObservable();
  constructor(
      private cookieService: CookieService
  ) { }

  setCheckBasket(data) {
    this.checkBasket.next(data);
  }
  setSettings(data) {
      this.settings.next(data);
  }
  setLanguage(data) {
    this.language.next(data);
    const lang = {
      def: 'uk',
      ua: 'uk',
      ru: 'ru-UA'
    };
    this.dateTranslator.next(lang[data]);
  }
  setTranslate(data) {
    this.translate.next(data);
  }

  isAuthAdmin() {
    if (this.cookieService.get('adminId') || localStorage.getItem('adminId')) {
      return true;
    }
    return false;
  }
}

