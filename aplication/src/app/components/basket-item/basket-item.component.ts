import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.scss']
})
export class BasketItemComponent implements OnInit {
  public user;
  public count = null;
  public loadingCount = false;
  public language: string;
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) {return; }
      this.user = v;
      if (this.user && this.user._id) {
        this.crud.get(`basket/count?query={"createdBy":"${this.user._id}","status":0}`).then((count: any) => {
          if (count) {
            this.count = count.count;
            this.loadingCount = true;
          }
        });
      }
    });
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });

    this.auth.onCheckBasket.subscribe((v: any) => {
      if (this.user && this.user._id) {
        this.crud.get(`basket/count?query={"createdBy":"${this.user._id}","status":0}`).then((count: any) => {
          if (count) {
            this.count = count.count;
            this.loadingCount = true;
          }
        });
      }
    });
  }

}
