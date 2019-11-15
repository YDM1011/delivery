import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-confirm-address',
  templateUrl: './confirm-address.component.html',
  styleUrls: ['./confirm-address.component.scss']
})
export class ConfirmAddressComponent implements OnInit, OnDestroy {
  @Output() cancelConfirmAddress = new EventEmitter();
  @Output() outputConfirmAddress = new EventEmitter();
  public language;
  public address = [];
  public user;
  public loading = false;
  public addressChoose = null;

  public translate ={
    choose: {
      ru: 'Выберите адрес доставки',
      ua: 'Виберіть адрес доставки'
    },
    empty: {
      ru: 'У вас нет адресов',
      ua: 'У вас немає адресів'
    },
    create: {
      ru: 'Создать адрес',
      ua: 'Створити адресу'
    },
    buil: {
      ru: 'Дом',
      ua: 'Буд'
    },
    street: {
      ru: 'ул.',
      ua: 'вул.'
    },
    department: {
      ru: 'Квартира',
      ua: 'Квартира'
    },
    btn1: {
      ru: 'Выбрать',
      ua: 'Вибрати'
    },
    btn2: {
      ru: 'Отмена',
      ua: 'Відмінити'
    }
  };
  public _subscription: Subscription[] = [];
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this._subscription.push(this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    }));
    this._subscription.push(this.auth.onMe.subscribe((v: string) => {
      if (v) {
        this.user = v;
        this.crud.get(`shopAddress?query={"createdBy":"${this.user._id}"}&populate={"path":"city"}`).then((v: any) => {
          if (v) {
            this.address = v;
            this.addressChoose = v[0];
            this.loading = true;
          }
        });
      }
    }));
  }
  ngOnDestroy() {
    this._subscription.forEach((item) => {
      item.unsubscribe()
    })
  }
}
