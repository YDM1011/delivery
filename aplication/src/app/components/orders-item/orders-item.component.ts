import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-orders-item',
  templateUrl: './orders-item.component.html',
  styleUrls: ['./orders-item.component.scss']
})
export class OrdersItemComponent implements OnInit {
  public removeOrders: boolean = true;
  @Output() removeOrder = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
