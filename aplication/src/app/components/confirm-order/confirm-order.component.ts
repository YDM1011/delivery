import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit {
  @Input() basket;
  @Output() closeConfirm = new EventEmitter();
  public language: string;
  public user: any;
  public blockBTN = false;
  public changeCity = false;
  public method = {
    1: 'Наличными',
    2: 'Отстрочка'
  };
  public obj = {
    address: null,
    payMethod: 1
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.auth.onMe.subscribe((v: string) => {
      if (v) {
        this.user = v;
        this.crud.get(`shopAddress?query={"createdBy":"${this.user._id}"}&populate={"path":"city"}`).then((v: any) => {
          if (v) {
            this.obj.address = v[0];
          }
        });
      }
    });
    this.auth.resetConfirm()
  }
  confirm() {
    if (!this.obj.address || !this.obj.payMethod) {
      this.openSnackBar('Выберете адрес и способ оплаты',  'Ok');
      return;
    } else {
      this.blockBTN = true;
      this.crud.post(`basket`, {status: 1, deliveryAddress: this.obj.address._id, payMethod: this.method[this.obj.payMethod]}, this.basket._id).then((v: any) => {
        if (v) {
          this.openSnackBar('Ваш заказ оформлен',  'Ok');
          this.auth.setCheckBasket(true);
          this.closeConfirm.emit(false);
        }
      });
    }
  }
  outputAddress(e) {
    if (e) {
      this.obj.address = e;
      this.changeCity = false;
    }
  }
  cancelConfirmAddress(e) {
    this.changeCity = e.value;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
