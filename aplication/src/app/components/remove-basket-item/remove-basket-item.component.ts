import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-remove-basket-item',
  templateUrl: './remove-basket-item.component.html',
  styleUrls: ['./remove-basket-item.component.scss']
})
export class RemoveBasketItemComponent implements OnInit {
  @Output() closeRemove = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
