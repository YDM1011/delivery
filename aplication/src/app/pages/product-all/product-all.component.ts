import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-product-all',
  templateUrl: './product-all.component.html',
  styleUrls: ['./product-all.component.scss']
})
export class ProductAllComponent implements OnInit, OnDestroy {
  public language;
  public loading = false;
  public orders = [];
  public translate ={
    title: {
      ru: 'Продукты',
      ua: 'Продукти'
    }
  };
  private _subscription: Subscription[] = [];
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this._subscription.push(this.auth.onLanguage.subscribe((l: any) => {
      if (l) {
        this.language = l;
      }
    }));
    this.crud.getTopProduct(0, 5).then((v: any) => {
      if (v) {
        this.orders = v;
        this.loading = true;
      }
    });
  }
  output(e) {
    if (e) {
      this.orders.concat(e);
    }
  }

  ngOnDestroy() {
    this._subscription.forEach((item) => {
      item.unsubscribe();
    })
  }
}
