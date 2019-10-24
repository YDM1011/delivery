import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.scss']
})
export class BasketItemComponent implements OnInit, OnDestroy {
  public user;
  public count = null;
  public loadingCount = false;
  public language: string;
  private _subscription: Subscription[] = [];
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this._subscription.push(this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    }));

    this._subscription.push(this.auth.onBasketCount.subscribe((v: any) => {
      this.count = v;
      this.loadingCount = true;
    }));
  }
  ngOnDestroy() {
    this._subscription.forEach(it => it.unsubscribe());
  }

}
