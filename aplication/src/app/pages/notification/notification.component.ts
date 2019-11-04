import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  public language: string;
  public action = [];
  public toggleMain: boolean = true;
  public showRaiting: boolean = false;
  public loading = false;
  public company;
  public city;
  public chooseCompany;
  public action_t = {
    ru: 'Акции',
    ua: 'Акції'
  };
  public rating_t = {
    ru: 'Оценить сервис',
    ua: 'Оценіть сервіс'
  };
  private _subscription: Subscription[] = [];

  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this._subscription.push(this.auth.onCity.subscribe((v: any) => {
      if (v) {
        this.city = v;
        this.init();
      }
    }));
    this._subscription.push(this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    }));
  }

  init() {
    const query = `?query=${JSON.stringify({client: {$in: localStorage.getItem('userId')}})}&sort={"date":-1}&skip=0&limit=3`;
    this.crud.get('action', '', query).then((v: any) => {
      if (v) {
        this.action = v;
        this.loading = true;
      }
     });
  }
  getCompany() {
    const queryCompany = `?query={"city":"${this.city._id}","verify":true}&select=_id,name`;
    this.crud.get('company', '', queryCompany).then((v: any) => {
      if (v) {
        this.company = Object.assign([], v);
        this.loading = true;
      }
    });
  }
  closeRaiting(e) {
    this.showRaiting = e.value;
  }
  getOutput(e) {
    if (e) {
      this.action = this.action.concat(e);
    }
  }
  ngOnDestroy() {
    this._subscription.forEach((item) => {
      item.unsubscribe();
    })
  }
}
