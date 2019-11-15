import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';

interface Company {
  img: string;
  name: string;
  rating?: number;
  ratingCount?: number;
  address?: string;
  categories?: [];
  action?: [];
  actionCount?: number;
  city: object;
  workTime?: object;
  verify: boolean;
  date: string;
  lastUpdate: string;
  _id: string;
}

@Component({
  selector: 'app-provider-item',
  templateUrl: './provider-item.component.html',
  styleUrls: ['./provider-item.component.scss']
})
export class ProviderItemComponent implements OnInit, OnDestroy {
  @Input() data: Company;
  @Input() isTop = false;
  @Output() getIt = new EventEmitter();
  public language: string;
  public translate = {
    t1: {
      ru: 'акции',
      ua: 'акції'
    },
    t2: {
      ru: 'акций',
      ua: 'акцій'
    }
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
      this.init();
    });
    if(this.data.rating && this.data.ratingCount)
    this.data.rating = Math.round(this.data.rating/this.data.ratingCount)
  }

  init() {
    const query = `/count?query=${JSON.stringify({$or: [{actionGlobal: true}, {client: {$in: localStorage.getItem('userId')}}], companyOwner: this.data._id})}`; //
    this.crud.get('action', '', query).then((v: any) => {
      this.data.actionCount = v.count;
    });
  }

  ngOnDestroy() {

  }
}
