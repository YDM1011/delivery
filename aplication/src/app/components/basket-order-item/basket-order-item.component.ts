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
  removeItem(e) {
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
    console.log(this.items);
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

  }
  plus(i) {
    this.refreshBasket();
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
    if (e) {
      this.data.product.splice(e, 1);
      this.refreshBasket();
    }
  }
  checkAll() {

  }
}
