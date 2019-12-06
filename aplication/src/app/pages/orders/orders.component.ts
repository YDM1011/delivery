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
  public showCloseModal = false;
  public cancelOrderId = null;
  public user: any;

  public dateStart = new Date();
  public dateEnd = new Date();
  public newStart;
  public newEnd;
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
    this.dateStart.setDate(this.dateStart.getDate() -1);
    this._subscription.push(this.auth.onUpdateDebtor.subscribe((v: any) => {
      if (v) {
        let index = this.crud.find('_id', v.basket, this.orders);
        if (this.orders[index]) {
          this.orders[index]['newDebtor'] = v.value;
        }
      }
    }));
    this._subscription.push(this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    }));
    this._subscription.push(this.auth.onMe.subscribe((me: any) => {
      if (!me) {return; }
      this.user = me;
      this.crud.get(`basket?query={"createdBy":"${this.user._id}","$or":[{"status":1},{"status":2},{"status":3}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name img"}]&skip=0&limit=5&sort={"date":-1}`).then((v: any) => {
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
      this.cancelOrderId = e;
      this.showCloseModal = true;
    }
  }
  getBaskets() {
    this.loading = false;
    this.toggleMain = true;
    this.crud.get(`basket?query={"createdBy":"${this.user._id}","$or":[{"status":1},{"status":2},{"status":3}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name img"}]&skip=0&limit=5&sort={"date":-1}`).then((v: any) => {
      this.orders = v;
      this.loading = true;
    });
  }
  getSuccessBasket() {
    this.toggleMain = false;
    this.loading = false;
    const timeStart = new Date(this.dateStart.getTime() - this.dateStart.getHours()*60*60*1000 - this.dateStart.getMinutes()*60*1000  - this.dateStart.getSeconds()*1000).getTime();
    const timeEnd = new Date(this.dateEnd.getTime() - this.dateEnd.getHours()*60*60*1000 - this.dateEnd.getMinutes()*60*1000  - this.dateEnd.getSeconds()*1000).getTime();
    this.crud.get(`basket?query={"createdBy":"${this.user._id}","date":{"$gte":"${timeStart}","$lte":"${timeEnd}"},"$or":[{"status":4},{"status":5}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name img"}]&skip=0&limit=5&sort={"date":-1}`).then((v: any) => {
      this.orders = v;
      this.loading = true;
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
  closeOrder(e) {
    this.showCloseModal = e;
  }
  successRemove(){
    this.showCloseModal = false;
    this.crud.post('basket', {status: 5}, this.cancelOrderId).then((v: any) => {
      if (v) {
        this.orders[this.crud.find('_id', this.cancelOrderId, this.orders)].status = 5;
        this.openSnackBar('Ваш заказ был отменен',  'Ok');
      }
    });
  }
}
