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
  constructor(
      private crud: CrudService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id) {
        this.crud.get('basket', this.id).then((b: any) => {
          if (b) {
            this.basket = b;
          }
        });
      }
    });
  }

}
