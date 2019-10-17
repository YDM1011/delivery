import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-remove-basket-item',
  templateUrl: './remove-basket-item.component.html',
  styleUrls: ['./remove-basket-item.component.scss']
})
export class RemoveBasketItemComponent implements OnInit {
  @Input() data;
  @Output() closeRemove = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log(this.data)
  }

}
