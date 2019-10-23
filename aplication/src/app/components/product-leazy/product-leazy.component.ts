import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-product-leazy',
  templateUrl: './product-leazy.component.html',
  styleUrls: ['./product-leazy.component.scss']
})
export class ProductLeazyComponent implements OnInit {
  public count: number = 0;
  public orderCount: number = 0;
  public language: string;
  public order = [];
  @Input() value;
  @Input() filter = 'category';
  constructor(
    private auth: AuthService,
    private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    if (this.filter === 'category' || !this.filter) {
      this.crud.orderByCategoryCount(this.value)
        .then((orderCount: any) => {
          this.orderCount = orderCount.count;
          this.crud.orderByCategory(this.value, 0)
            .then((order) => {
              // console.log(order)
              this.order = this.order.concat(order);
              // console.log(this.order)
            });
        });
    } else if (this.filter === 'brand') {
      this.crud.orderByBrandCount(this.value)
        .then((orderCount: any) => {
          this.orderCount = orderCount.count;
          this.crud.orderByBrand(this.value, 0)
            .then((order) => {
              // console.log(order)
              this.order = this.order.concat(order);
              // console.log(this.order)
            });
        });
    }

  }
  increment() {
    this.count ++;
  }
  decrement() {
    if (this.count === 0) {return; }
    this.count --;
  }

  alert(text) {
    alert(text);
  }
  loadOrder() {
    this.crud.orderByCategory(this.value, this.order.length)
      .then((order) => {
        this.order.push(order);
      });
  }
}
