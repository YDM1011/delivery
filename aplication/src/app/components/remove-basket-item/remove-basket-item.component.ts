import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-remove-basket-item',
  templateUrl: './remove-basket-item.component.html',
  styleUrls: ['./remove-basket-item.component.scss']
})
export class RemoveBasketItemComponent implements OnInit {
  @Input() data;
  @Output() closeRemove = new EventEmitter();
  @Output() successRemove = new EventEmitter();

  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
  }
  remove() {
    this.crud.delete('product', this.data.obj._id).then((v: any) => {
      this.successRemove.emit(this.data.index);
      this.closeRemove.emit(false);
    });
  }
}
