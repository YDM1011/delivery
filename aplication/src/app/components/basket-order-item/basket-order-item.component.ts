import {Component, Input, OnInit} from '@angular/core';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-basket-order-item',
  templateUrl: './basket-order-item.component.html',
  styleUrls: ['./basket-order-item.component.scss']
})
export class BasketOrderItemComponent implements OnInit {
  @Input() data;
  public removeObj = {
    index: null,
    obj: null
  };
  public chooseAll: boolean = true;
  public showConfirm: boolean = false;
  public removeItemShow: boolean = false;
  public items = [{isChoise: true, _id: 123}, {isChoise: true, _id: 1233}];
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.mainChack();
    this.crud.get(`product?query={"basketOwner":"${this.data._id}"}&populate={"path":"orderOwner","select":"img name price count"}`).then((v: any) => {
      if (v && v.length > 0) {
        this.data.product = v;
      }
    });
  }
  closeConfirm(e) {
    this.showConfirm = e.value;
  }
  closeRemoveItem(e) {
    this.removeItemShow = e;
  }
  mainChack() {
    this.chooseAll = !this.chooseAll;
    if (this.chooseAll) {
      this.items.forEach((item, index) => {
        this.items[index]['isChoise'] = true;
      });
    } else {
      this.items.forEach((item, index) => {
        this.items[index]['isChoise'] = false;
      });
    }
  }
  otherChack(it) {
    this.items[it].isChoise = !this.items[it].isChoise;
    let count = 0;
    let isAll = true;
    // this.items.forEach((item, index)=> {
    //   if (it == index) {
    //     item.isChoise = !item.isChoise
    //   }
    // });
    this.items.forEach((item, index) => {
      if (!this.items[index].isChoise) {
        isAll = false;
      }
    });
    this.chooseAll = isAll;
  }
  minus(i) {
    const count = this.data.product[i].count--;
    if (count < 1) {
      this.crud.delete(`product`, this.data.product[i]._id).then((v: any) => {
        if (v) {
          this.data.product.splice(i, 1);
          this.refreshBasket();
          return;
        }
      });
    } else {
      this.data.product[i].count--
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
    console.log(e);
    this.data.product.splice(e, 1);
    this.refreshBasket();
  }
  checkAll() {

  }
}
