import {Component, Input, OnInit, Output} from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  public count: number = 0;
  public language: string;
  @Input() data;
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }
  increment() {
    this.count ++;
  }
  decrement() {
    if (this.count === 0) {return; }
    this.count --;
  }

  addProduct(order) {
    this.crud.post('product', {orderOwner: order._id, count: this.count}).then((v: any) => {
      if (v) {
        this.count = 0;
        this.auth.setCheckBasket(true);
        this.openSnackBar('Товар додан в корзину',  'Ok');
      }
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
