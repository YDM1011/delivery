import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-address-item',
  templateUrl: './address-item.component.html',
  styleUrls: ['./address-item.component.scss']
})
export class AddressItemComponent implements OnInit {
  public language: string;
  @Input() data;
  @Output() chackAddress = new EventEmitter();

  public translate ={
    remove: {
      ru: 'Удалить',
      ua: 'Видалити'
    },
    edit: {
      ru: 'Изменить',
      ua: 'Змінити'
    },
    buil: {
      ru: 'Дом',
      ua: 'Буд'
    },
    street: {
      ru: 'ул.',
      ua: 'вул.'
    },
    department: {
      ru: 'Квартира',
      ua: 'Квартира'
    },
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }
  removeAddress() {
    this.crud.delete('shopAddress', this.data._id).then((v: any) => {
      if (v) {
        this.chackAddress.emit(true);
      }
    });
  }
}
