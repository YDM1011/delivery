import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public language: string;
  public toggleMain: boolean = true;
  public orders = [];
  public loading = false;
  public user: any;
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private snackBar: MatSnackBar

  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.auth.onMe.subscribe((me: any) => {
      if (!me) {return; }
      this.user = me;
      this.crud.get(`basket?query={"createdBy":"${this.user._id}","$or":[{"status":1},{"status":2},{"status":3}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name"}]`).then((v: any) => {
        this.orders = v;
      });
    });
  }
  removeOrder(e) {
    if (e) {
      this.openSnackBar('Ваш заказ был отменен',  'Ok');
      this.crud.get(`basket?query={"createdBy":"${this.user._id}","$or":[{"status":1},{"status":2},{"status":3}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name"}]`).then((v: any) => {
        this.orders = v;
      });
    }
  }
  getBaskets() {
    this.toggleMain = true;
    this.crud.get(`basket?query={"createdBy":"${this.user._id}","$or":[{"status":1},{"status":2},{"status":3}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name"}]`).then((v: any) => {
      this.orders = v;
    });
  }
  getSuccessBasket() {
    this.toggleMain = false;
    this.crud.get(`basket?query={"createdBy":"${this.user._id}","$or":[{"status":4},{"status":5}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name"}]`).then((v: any) => {
      this.orders = v;
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
