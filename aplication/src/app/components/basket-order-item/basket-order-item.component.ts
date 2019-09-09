import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basket-order-item',
  templateUrl: './basket-order-item.component.html',
  styleUrls: ['./basket-order-item.component.scss']
})
export class BasketOrderItemComponent implements OnInit {
  public showConfirm: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  closeConfirm(e) {
    this.showConfirm = e.value;
  }
}
