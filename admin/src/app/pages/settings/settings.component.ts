import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public loading = false;
  public cardEmpty = false;
  public user;
  public setting;
  public cityChoose;
  public city = [];
  public loaded = true;
  public showAddCity = false;
  public showAddCard = false;
  public acceptedCreditCards = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
    diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
  };
  public cardError = {
    number: true,
    year: true,
    month: true,
    ccv: true,
  };
  public card = {
    number: '',
    year: '',
    month: '',
    ccv: ''
  };
  public objPayInfo = {
    price: 0,
    period: ''
  };

  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) {
        return;
      }
      this.user = Object.assign({}, v);
      this.loading = true;
      if (this.user.card.number === '') {
        this.cardEmpty = false;
        return;
      }
      this.cardEmpty = true;
    });
    this.crud.get('setting?populate={"path":"city"}').then((s: any) => {
      if (!s) {return; }
      this.setting = Object.assign({}, s);
      this.objPayInfo.price = this.setting.payInfo.price;
      this.objPayInfo.period = this.setting.payInfo.period;
    });
    this.crud.get('city').then((c: any) => {
      if (!c || c.lenght === 0) {return; }
      this.city = c;
      this.cityChoose = this.city[0]._id;
    });
  }
  checkSupported(v) {
    const value = v.replace(/\D/g, '');
    let accepted = false;
    Object.keys(this.acceptedCreditCards).forEach((key) => {
      const regex = this.acceptedCreditCards[key];
      if (regex.test(value)) {
        accepted = true;
      }
    });
    return this.cardError.number = accepted;
  }
  openAddCity() {
    this.showAddCity = true;
  }
  openAddCard() {
    this.showAddCard = true;
    this.cardEmpty = true;
  }
  cancelAddCity() {
    this.showAddCity = false;
  }
  cancelAddCard() {
    this.showAddCard = false;
    this.cardEmpty = false;
    this.card = {
      number: '',
      year: '',
      month: '',
      ccv: ''
    };
  }
  removeCard() {
    this.crud.post('admin', {card: {number: '', month: '', year: '', ccv: ''}}, this.user._id).then((v: any) => {
      if (v) {
        this.auth.setMe(v);
        this.cardEmpty = false;
      }
    });
  }
  createCard(e) {
    e.preventDefault();
    const c = this.card;
    if (c.number === '' || c.year === '' || c.month === '' || c.ccv === '') {
      Swal.fire('Error', 'Все поля должны быть заполтены', 'error');
      return;
    }
    if (!this.cardError.number) {
      Swal.fire('Error', 'Номер карты ввееден не коректно', 'error');
      return;
    }
    this.card.number = this.card.number.replace(/\s/g, '');
    this.crud.post('admin', {card: this.card}, this.user._id).then((v: any) => {
      if (v) {
        this.auth.setMe(v);
        this.showAddCard = false;
        this.cardEmpty = true;
      }
    });
  }
  savePayInfo(){
    this.crud.post('setting', {payInfo: this.objPayInfo}).then()
  }
  confirmCity() {
    if (!this.cityChoose && this.cityChoose === '') {
      Swal.fire('Error', 'Город не выбран', 'error');
      return;
    }
    this.crud.post('setting', {city: this.cityChoose}).then((c: any) => {
      if (!c) {return; }
      this.crud.get('setting?populate={"path":"city"}').then((s: any) => {
        if (!s) {return; }
        this.setting = Object.assign({}, s);
      });
    });
  }
}
