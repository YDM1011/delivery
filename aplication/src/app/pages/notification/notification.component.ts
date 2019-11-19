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
  public language;
  public action = [];
  public toggleMain: boolean = true;
  public showRaiting: boolean = false;
  public loading = false;
  public ratingArr = [];
  public ratingArrHistory = [];
  public city;
  public action_t = {
    ru: 'Акции',
    ua: 'Акції'
  };
  public rating_t = {
    ru: 'Оценить сервис',
    ua: 'Оцініть сервіс'
  };
  public translate = {
    title: {
      ru: 'Уведомления',
      ua: 'Повідомлення'
    },
    empty_action: {
      ru: 'У вас нет персональных акций',
      ua: 'У вас немає персональних акцій'
    },
    empty_history: {
      ru: 'У вас нет историй оценок',
      ua: 'У вас не має історій оцінок'
    },
    history: {
      ru: 'История отзывов',
      ua: 'Історія відгуків'
    }
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
  getRating() {
    const queryCompany = `?query={"clientOwner":"${localStorage.getItem('userId')}","show":true,"rating":"0"}&populate={"path":"companyOwner","select":"name"}`;
    this.crud.get('rating', '', queryCompany).then((v: any) => {
      if (v) {
        this.ratingArr = Object.assign([], v);
        this.loading = true;
      }
    });
    const queryCompanyHistory = JSON.stringify({clientOwner:localStorage.getItem('userId'), show: true, rating: {$ne: 0} });
    const populateCompanyHistory = JSON.stringify({path:"companyOwner",select: "name"});
    this.crud.get(`rating?query=${queryCompanyHistory}&populate=${populateCompanyHistory}`).then((v: any) => {
      if (v) {
        this.ratingArrHistory = Object.assign([], v);
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
  updateHistory(e){
    if (e) {
      this.getRating();
    }
  }
  ngOnDestroy() {
    this._subscription.forEach((item) => {
      item.unsubscribe();
    })
  }
}
