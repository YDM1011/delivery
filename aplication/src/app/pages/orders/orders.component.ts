import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {MatSnackBar} from "@angular/material";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public language: string;
  public toggleMain = true;
  public orders = [];
  public loading = false;
  public user: any;
  private _subscription: Subscription[] = [];

  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private snackBar: MatSnackBar
  ) { }
  ngOnInit() {
    this._subscription.push(this.auth.onUpdateOrder.subscribe((order: any) => {
      if (order) {
        const index = this.crud.find('_id', order._id, this.orders);
        if (index !== -1) {
          this.orders[index].status = order.status;
        } else {
          this.orders.unshift(order);
        }
      }
    }));
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
  }
  confirmOrder(e) {
    if (e) {
      this.openSnackBar('Ваш заказ был подтвержден',  'Ok');
      this.crud.get(`basket?query={"_id":"${e}","$or":[{"status":1},{"status":2},{"status":3}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name"}]&skip=0&limit=5&sort={"date":-1}`).then((v: any) => {
        this.orders[this.crud.find('_id', e, this.orders)] = v[0];
      });
    }
  }
  removeOrder(e, i) {
      this.openSnackBar('Ваш заказ был отменен',  'Ok');
      this.orders.splice(i, 1);
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
