import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {MatSnackBar} from '@angular/material';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit, OnDestroy {
  public count = 0;
  public language: string;
  public user;
  @Input() data;
  @Input() company;
  private _subscription: Subscription[] = [];
  public snackMessage = {
    ru: 'Товар додан в корзину',
    ua: 'Товар доданий у кошик'
  };
  public translate = {
    t1: {
      ru: 'Добавить в',
      ua: 'Додати в'
    }
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this._subscription.push(
        this.auth.onMe.subscribe((u: any) => {
          if (u) {
            this.user = u;
          }
        })
    );
    this._subscription.push(
        this.auth.onLanguage.subscribe((v: string) => {
          this.language = v;
        })
    );
  }
  ngOnDestroy() {
    this._subscription.forEach((i) => i.unsubscribe());
  }
  increment() {
    this.count ++;
  }
  decrement() {
    if (this.count === 0) {return; }
    this.count --;
  }

  addProduct(order) {
    if (!this.user) {
      this.openSnackBar('Войдите или зарегестрируйтеся',  'Ok');
      return;
    }
    this.crud.post('product', {orderOwner: order._id, count: this.count}).then((v: any) => {
      if (v) {
        this.count = 0;
        this.auth.setCheckBasket(true);
        this.openSnackBar(this.snackMessage[this.language],  'Ok');
      }
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
