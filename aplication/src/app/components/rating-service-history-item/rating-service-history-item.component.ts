import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CrudService} from "../../crud.service";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-rating-service-history-item',
  templateUrl: './rating-service-history-item.component.html',
  styleUrls: ['./rating-service-history-item.component.scss']
})
export class RatingServiceHistoryItemComponent implements OnInit {
  public language;
  @Input() data;
  @Output() removeHistory = new EventEmitter();
  public translate = {
    t1: {
      ru: 'Поставщик',
      ua: 'Постачальник'
    }
  };
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((l: any) => {
      if (l) {
        this.language = l;
      }
    })
  }

  remove() {
    this.crud.post('rating', {show: false}, this.data._id).then((v) => {
      if (v) {
        this.removeHistory.emit(true);
      }
    })
  }
}
