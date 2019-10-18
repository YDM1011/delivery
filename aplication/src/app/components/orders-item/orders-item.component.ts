import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CrudService} from '../../crud.service';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-orders-item',
  templateUrl: './orders-item.component.html',
  styleUrls: ['./orders-item.component.scss']
})
export class OrdersItemComponent implements OnInit {
  @Input() order;
  public removeOrders: boolean = true;
  public language: string;
  @Output() removeOrder = new EventEmitter();
  public getProducts = [];
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: any) => {
      if (v) {
        this.language = v;
      }
    });
  }
  getProduct() {
    if (this.getProducts.length > 0) {
      return;
    } else {
      this.crud.get(`product?query={"basketOwner":"${this.order._id}"}&populate=[{"path":"orderOwner","select":"price name img discount"}]`).then((v: any) => {
        if (v) {
          this.getProducts = v;
          this.order.products = this.getProducts;
        }
      });
    }
  }
  cancelOrder() {
    this.crud.post('basket', {status: 5}, this.order._id).then((v: any) => {
      if (v) {
        this.removeOrder.emit(true);
      }
    })
  }
}
