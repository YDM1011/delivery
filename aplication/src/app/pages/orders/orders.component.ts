import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {MatSnackBar} from "@angular/material";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  public language;
  public toggleMain = true;
  public orders = [];
  public loading = false;
  public user: any;
  private _subscription: Subscription[] = [];
  public translate ={
    title: {
      ru: 'Заказы',
      ua: 'Замовлення'
    },
    wait: {
      ru: 'В ожидании',
      ua: 'В очікуванні'
    },
    done: {
      ru: 'Доставлены',
      ua: 'Доставлені'
    },
    empty: {
      ru: 'У вас нет активных заказов',
      ua: 'У вас немає активних заказів'
    },
    empty_done: {
      ru: 'У вас нет доставленых или отменненых заказов',
      ua: 'У вас немає доставлених або відмінених заказів'
    }
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private snackBar: MatSnackBar
  ) { }
  ngOnInit() {
    this._subscription.push(this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    }));
    this._subscription.push(this.auth.onMe.subscribe((me: any) => {
      if (!me) {return; }
      this.user = me;
      this.crud.get(`basket?query={"createdBy":"${this.user._id}","$or":[{"status":1},{"status":2},{"status":3}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name"}]&skip=0&limit=5&sort={"date":-1}`).then((v: any) => {
        this.orders = v;
        this.loading = true;
      });
    }));
    this._subscription.push(this.auth.onUpdateOrder.subscribe((order: any) => {
      if (order  && this.orders) {
        const index = this.crud.find('_id', order._id, this.orders);
        if (this.orders[index]) {
          this.orders[index].status = order.status;
        } else {
          this.orders.unshift(order);
        }
      }
    }));
  }
  ngOnDestroy() {
    this._subscription.forEach((item) => {
      item.unsubscribe();
    })
  }
  confirmOrder(e) {
    if (e) {
      this.openSnackBar('Ваш заказ был подтвержден',  'Ok');
      this.orders[this.crud.find('_id', e, this.orders)].status = 2;
    }
  }
  removeOrder(e) {
    if (e) {
      this.orders[this.crud.find('_id', e, this.orders)].status = 5;
      this.openSnackBar('Ваш заказ был отменен',  'Ok');
    }
  }
  getBaskets() {
    this.toggleMain = true;
    this.crud.get(`basket?query={"createdBy":"${this.user._id}","$or":[{"status":1},{"status":2},{"status":3}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name"}]&skip=0&limit=5&sort={"date":-1}`).then((v: any) => {
      this.orders = v;
    });
  }
  getSuccessBasket() {
    this.toggleMain = false;
    this.crud.get(`basket?query={"createdBy":"${this.user._id}","$or":[{"status":4},{"status":5}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name"}]&skip=0&limit=5&sort={"date":-1}`).then((v: any) => {
      this.orders = v;
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  getOutput(e) {
    if (e) {
      this.orders = this.orders.concat(e);
    }
  }
}
