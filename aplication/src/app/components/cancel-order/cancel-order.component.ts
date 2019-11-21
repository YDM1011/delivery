import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CrudService} from "../../crud.service";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.scss']
})
export class CancelOrderComponent implements OnInit {

  public language;
  @Input() data;
  @Output() closeRemove = new EventEmitter();
  @Output() successRemove = new EventEmitter();
  public translate = {
    t1: {
      ru: 'Вы действительно хотите отменить заказ?',
      ua: 'Ви дійсно хочете скасувати замовлення?'
    },
    t2: {
      ru: 'Отменить',
      ua: 'Відмінити'
    },
    t3: {
      ru: 'Назад',
      ua: 'Назад'
    }
  };
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((l: any) => {
      this.language = l;
    })
  }
}
