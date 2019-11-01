import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth.service';
import {CrudService} from "../../crud.service";
import {WebsocketService} from "../../websocket";
import {WS} from "../../websocket/websocket.events";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  public id: string;
  public baskets = [];
  public language: string;
  public loading: boolean = false;
  public removeItem: boolean = false;
  public showConfirm: boolean = false;
  constructor(
      private route: ActivatedRoute,
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
    });
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    const query = `?query={"status":0}&populate={"path":"companyOwner","select":"name img createdBy"}`;
    this.crud.get('basket', '', query).then((v: any) => {
      if (v) {
        this.baskets = v;
        this.loading = true;
      }
    });
  }
  removeBasket(e) {
    this.loading = false;
    if (e) {
      setTimeout(() => {
        const query = `?query={"status":0}&populate={"path":"companyOwner","select":"name img createdBy"}`;
        this.crud.get('basket', '', query).then((v: any) => {
          if (v) {
            this.baskets = v;
            // console.log(v);
            this.loading = true;
          }
        });
        this.auth.setCheckBasket(true);
      }, 10)
    }
  }
}
