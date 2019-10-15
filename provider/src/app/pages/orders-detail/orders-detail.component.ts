import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss']
})
export class OrdersDetailComponent implements OnInit {
  public id;
  public basket;
  public defLang = 'ru-UA';
  constructor(
      private crud: CrudService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id) {
        const populate = JSON.stringify([{path: 'products', select: 'price count', populate: {path: 'orderOwner', select: 'name'}}, {path: 'createdBy', select: 'name address'}]);
        this.crud.get(`basket?query={"_id":"${this.id}"}&populate=${populate}`).then((b: any) => {
          if (b && b.length > 0) {
            this.basket = b[0];
          }
        });
      }
    });
  }

}
