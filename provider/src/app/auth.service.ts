import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private settings = new BehaviorSubject<any>(null);
  public onSettings = this.settings.asObservable();

  private me = new BehaviorSubject<any>(null);
  public onMe = this.me.asObservable();

  private translate = new BehaviorSubject<any>(null);
  public onTranslate = this.translate.asObservable();

  private dateTranslator = new BehaviorSubject<any>(null);
  public onDateTranslator = this.dateTranslator.asObservable();

  private language = new BehaviorSubject<any>(null);
  public onLanguage = this.language.asObservable();

  private wsOrder = new BehaviorSubject<any>(null);
  public onWsOrder = this.wsOrder.asObservable();

  private defCrop = new BehaviorSubject<any>(null);
  public onDefCrop = this.defCrop.asObservable();

  constructor() { }

  setWsOrder(data) {
    this.wsOrder.next(data);
  }
  setSettings(data) {
      this.settings.next(data);
  }
  setMe(data) {
    this.me.next(data);
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
    if (localStorage.getItem('userId')) {
      return true;
    }
    return false;
  }
  callDefCrop(){
    this.defCrop.next(true);
    this.defCrop = new BehaviorSubject<any>(null);
    this.onDefCrop = this.defCrop.asObservable();
  }
}

