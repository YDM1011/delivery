import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-rating-service-history-item',
  templateUrl: './rating-service-history-item.component.html',
  styleUrls: ['./rating-service-history-item.component.scss']
})
export class RatingServiceHistoryItemComponent implements OnInit {
  @Input() data;
  @Output() removeHistory = new EventEmitter();
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
  }

  remove() {
    this.crud.post('rating', {show: false}, this.data._id).then((v) => {
      if (v) {
        this.removeHistory.emit(true);
      }
    })
  }
}
