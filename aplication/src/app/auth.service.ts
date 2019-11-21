import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CookieService} from "ngx-cookie-service";
import {CrudService} from "./crud.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private updateOrder = new BehaviorSubject<any>(null);
  public onUpdateOrder = this.updateOrder.asObservable();

  private settings = new BehaviorSubject<any>(null);
  public onSettings = this.settings.asObservable();

  private company = new BehaviorSubject<any>(null);
  public onCompany = this.company.asObservable();

  private city = new BehaviorSubject<any>(null);
  public onCity = this.city.asObservable();

  private me = new BehaviorSubject<any>(null);
  public onMe = this.me.asObservable();

  private basketCount = new BehaviorSubject<any>(null);
  public onBasketCount = this.basketCount.asObservable();

  private translate = new BehaviorSubject<any>(null);
  public onTranslate = this.translate.asObservable();

  private language = new BehaviorSubject<any>(null);
  public onLanguage = this.language.asObservable();

  private dateTranslator = new BehaviorSubject<any>(null);
  public onDateTranslator = this.dateTranslator.asObservable();

  private checkBasket = new BehaviorSubject<any>(null);
  public onCheckBasket = this.checkBasket.asObservable();

  private defCrop = new BehaviorSubject<any>(null);
  public onDefCrop = this.defCrop.asObservable();

  private ConfirmOrder = new BehaviorSubject<any>(null);
  public onConfirmOrder = this.ConfirmOrder.asObservable();

  constructor(
      private cookieService: CookieService
  ) { }

  callDefCrop(){
    this.defCrop.next(true);
    this.defCrop = new BehaviorSubject<any>(null);
    this.onDefCrop = this.defCrop.asObservable();
  }

  setConfirmOrder(data) {
    this.ConfirmOrder.next(data);
  }
  resetConfirm(){
    this.ConfirmOrder = new BehaviorSubject<any>(null);
    this.onConfirmOrder = this.ConfirmOrder.asObservable();
  }
  setUpdateOrder(data) {
    this.updateOrder.next(data);
  }
  setCheckBasket(data) {
    this.checkBasket.next(data);
  }
  setSettings(data) {
      this.settings.next(data);
  }
  setMe(data) {
    this.me.next(data);
  }
  setBasketCount(data) {
    this.basketCount.next(data);
  }
  setLanguage(data) {
    this.language.next(data);
    const lang = {
      def: 'ru-UA',
      ua: 'uk',
      ru: 'ru-UA'
    };
    this.dateTranslator.next(lang[data]);
  }
  setTranslate(data) {
    this.translate.next(data);
  }
  setCity(data) {
    this.city.next(data);
  }
  isAuth() {
    if (this.cookieService.get('userId') || localStorage.getItem('userId')) {
      return true;
    } else {
      return false;
    }
  }

  setCompanyCity(arr) {
    this.company.next(arr);
  }

}

