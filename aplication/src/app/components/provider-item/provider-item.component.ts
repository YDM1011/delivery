import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from "../../auth.service";

interface Company {
  img: string,
  name: string,
  rating?: number,
  address?: string,
  categories?: [],
  action?: [],
  city: object,
  workTime?: object,
  verify: boolean,
  date: string,
  lastUpdate: string,
  _id:string,
}

@Component({
  selector: 'app-provider-item',
  templateUrl: './provider-item.component.html',
  styleUrls: ['./provider-item.component.scss']
})
export class ProviderItemComponent implements OnInit {
  @Input() data: Company;
  @Input() isTop = false;
  @Output() getIt = new EventEmitter();
  public language: string;
  constructor(
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
      this.init()
    })
  }

  init(){

  }

}
