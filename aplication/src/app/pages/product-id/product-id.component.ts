import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {ActivatedRoute} from "@angular/router";
import {Me} from "../../interfaces/me";

@Component({
  selector: 'app-product-id',
  templateUrl: './product-id.component.html',
  styleUrls: ['./product-id.component.scss']
})
export class ProductIDComponent implements OnInit {
  public language: string;
  public count: number = 0;
  public favoriteShow;
  public id;
  public me:Me;
  public product;

  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.route.params.subscribe((params: any) => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.init();
    });
    this.auth.onMe.subscribe((v: any) => {
      this.me = v;
      if (this.me && this.me.favoriteProduct && (this.me.favoriteProduct.indexOf(this.id) >- 1))
        this.favoriteShow = true;
    });
  }
  init() {
    this.crud.getDetailProduct(this.id).then((v: any) => {
      if (v) {
        this.product = v;
      }
    });
  }

  favorite(e){
    this.crud.favoriteProduct({productId: this.id}).then((v: any) => {
      if (v) {
        this.me.favoriteProduct = v;
        if (v && (v.indexOf(this.id) >- 1)) {
          this.favoriteShow = true;
        } else {
          this.favoriteShow = false;
        }
      }
    });
  }
  increment(){}
  decrement(){}
}
