import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private settings = new BehaviorSubject<any>(null);
  public onSettings = this.settings.asObservable();

  private colaborator = new BehaviorSubject<any>(null);
  public onColaborator = this.colaborator.asObservable();

  private newOrder = new BehaviorSubject<any>(null);
  public onNewOrder = this.newOrder.asObservable();

  private translate = new BehaviorSubject<any>(null);
  public onTranslate = this.translate.asObservable();
  private done = new BehaviorSubject<any>(null);
  public onDone = this.done.asObservable();

  private language = new BehaviorSubject<any>(null);
  public onLanguage = this.language.asObservable();

  private dateTranslator = new BehaviorSubject<any>(null);
  public onDateTranslator = this.dateTranslator.asObservable();

  private checkBasket = new BehaviorSubject<any>(null);
  public onCheckBasket = this.checkBasket.asObservable();
  constructor() { }

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
    this.dateTranslator.next(lang[data])
  }
  setTranslate(data) {
    this.translate.next(data);
  }
  isAuthAdmin() {
    if (localStorage.getItem('adminId')) {
      return true;
    } else {
      return false;
    }
  }
  setNewOrder(data) {
    this.newOrder.next(data);
  }
}

