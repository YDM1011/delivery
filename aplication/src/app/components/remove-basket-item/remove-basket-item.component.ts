import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CrudService} from '../../crud.service';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-remove-basket-item',
  templateUrl: './remove-basket-item.component.html',
  styleUrls: ['./remove-basket-item.component.scss']
})
export class RemoveBasketItemComponent implements OnInit {
  public language;
  @Input() data;
  @Output() closeRemove = new EventEmitter();
  @Output() successRemove = new EventEmitter();
  public translate: {
    t1: {
      ru: 'Вы уверены, что хотите удалить товар?',
      ua: 'Ви впевнені що бажаєте видалити товар?'
    },
    t2: {
      ru: 'Удалить',
      ua: 'Видалити'
    },
    t3: {
      ru: 'Отмена',
      ua: 'Відміна'
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
  remove() {
    this.crud.delete('product', this.data.obj._id).then((v: any) => {
      this.successRemove.emit(this.data.index);
      this.closeRemove.emit(false);
    });
  }
}
