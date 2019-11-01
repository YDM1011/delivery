import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CrudService} from '../../crud.service';
import {MatSnackBar} from '@angular/material';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-basket-order-item',
  templateUrl: './basket-order-item.component.html',
  styleUrls: ['./basket-order-item.component.scss']
})
export class BasketOrderItemComponent implements OnInit {
  @Input() data;
  @Output() removeBasket = new EventEmitter();
  public removeObj = {
    index: null,
    obj: null
  };
  public chooseAll: boolean = false;
  public showConfirm: boolean = false;
  public removeItemShow: boolean = false;
  public items = [];
  constructor(
      private crud: CrudService,
      private auth: AuthService,
      private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.mainChack();
    this.crud.get(`product?query={"basketOwner":"${this.data._id}"}&populate={"path":"orderOwner","select":"img name price count discount"}`).then((v: any) => {
      if (v && v.length > 0) {
        this.data.product = v;
        this.data.product.forEach((item) => {
          this.items.push({isChoise: item.verify, _id: item._id});
        });
      }
    });
    this.auth.onConfirmOrder.subscribe(v=>{
      if (!v) return;
      this.showConfirm = true;
      this.auth.resetConfirm()
    })
  }
  closeConfirm(e) {
    this.showConfirm = e.value;
    this.removeBasket.emit(true);
  }
  closeRemoveItem(e) {
    this.removeItemShow = e;
  }
  mainChack() {
    this.chooseAll = !this.chooseAll;
    if (this.chooseAll) {
      this.items.forEach((item, index) => {
        this.items[index]['isChoise'] = true;
        this.crud.post(`product`, {verify: true}, item._id).then((v: any) => {
          if (v) {
            this.refreshBasket();
          }
        });
      });
    } else {
      this.items.forEach((item, index) => {
        this.items[index]['isChoise'] = false;
        this.crud.post(`product`, {verify: false}, item._id).then((v: any) => {
          if (v) {
            this.refreshBasket();
          }
        });
      });
    }
  }
  otherChack(it) {
    this.items[it].isChoise = !this.items[it].isChoise;
    this.crud.post(`product`, {verify: this.items[it].isChoise}, this.data.product[it]._id).then((v: any) => {
      if (v) {
        this.refreshBasket();
      }
    });
    let isAll = true;
    this.items.forEach((item, index) => {
      if (!this.items[index].isChoise) {
        isAll = false;
      }
    });
    this.chooseAll = isAll;
  }
  minus(i) {
    let count = this.data.product[i].count;
    count--;
    if (count < 1) {
      this.crud.delete(`product`, this.data.product[i]._id).then((v: any) => {
        if (v) {
          this.data.product.splice(i, 1);
          this.removeBasket.emit(this.data._id);
        }
      });
    } else {
      this.data.product[i].count--;
      this.crud.post(`product`, {count: this.data.product[i].count}, this.data.product[i]._id).then((v: any) => {
        if (v) {
          this.refreshBasket();
        }
      });
    }
  }
  plus(i) {
    this.data.product[i].count++;
    this.crud.post(`product`, {count: this.data.product[i].count}, this.data.product[i]._id).then((v: any) => {
      if (v) {
        this.refreshBasket();
      }
    });
  }
  refreshBasket() {
    this.crud.get(`basket?query={"_id":"${this.data._id}"}&select="totalPrice"`).then((v: any) => {
      this.data.totalPrice = v[0].totalPrice;
    });
  }
  removeProduct(i) {
    this.removeItemShow = true;
    this.removeObj = {
      index: i,
      obj: this.data.product[i]
    };
  }
  successRemove(e) {
    this.data.product.splice(e, 1);
    if (this.data.product.length === 0) {
      this.removeBasket.emit(true);
    } else {
      this.refreshBasket();
    }
  }
  openConfirmComponent() {
    if (this.data.totalPrice === 0) {
      this.openSnackBar('Выберете товар поставщика',  'Ok');
      return;
    }
    this.showConfirm = true;
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
