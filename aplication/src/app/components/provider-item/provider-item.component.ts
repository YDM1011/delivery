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
  public language;
  public translate = {
    t1: {
      ru: 'акции',
      ua: 'акції'
    },
    t2: {
      ru: 'акций',
      ua: 'акцій'
    },
    t3: {
      ru: 'акция',
      ua: 'акція'
    },
    work: {
      ru: 'График работы',
      ua: 'Графік роботи'
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
    let date = new Date(new Date().getTime() - new Date().getHours()*60*60*1000 - new Date().getMinutes()*60*1000  - new Date().getSeconds()*1000).getTime();
    let query = `?query=${JSON.stringify({$or:[{actionGlobal:true},{client:{$in:localStorage.getItem('userId')}}],companyOwner:this.data._id,dateEnd:{$gte:date}})}`;
    this.crud.get('action/count', '', query).then((v:any)=>{
      this.data.actionCount = v.count;
    });
  }

  ngOnDestroy() {

  }
}
