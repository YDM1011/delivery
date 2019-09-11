import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-product-id',
  templateUrl: './product-id.component.html',
  styleUrls: ['./product-id.component.scss']
})
export class ProductIDComponent implements OnInit {
  public language: string;
  public favoriteShow: boolean = false;
  public count: number = 0;
  public favoriteLocal;

  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.favoriteLocal = JSON.parse(localStorage.getItem('favorite'));
    if (!this.favoriteLocal) {
      this.favoriteLocal  = {
        providers: [],
        products: []
      };
    }
    if (this.favoriteLocal && this.favoriteLocal.products.length > 0) {
      let index;
      index = this.crud.find('_id', 1, this.favoriteLocal.products);
      if(index !== undefined){
        this.favoriteShow = true;
      }
    }
  }

  increment(){
    this.count ++;
  }
  decrement(){
    if (this.count === 0) return;
    this.count --;
  }

  favorite(e){
    if (e === true) {
      this.favoriteShow = e;
      let obj = {
        _id: 1
      };
      this.favoriteLocal.products.push(obj);
      localStorage.setItem('favorite', JSON.stringify(this.favoriteLocal))
    } else {
      this.favoriteLocal = JSON.parse(localStorage.getItem('favorite'));
      if (this.favoriteLocal) {
        let index;
        index = this.crud.find('_id', 1, this.favoriteLocal.products);
        if(index !== undefined){
          this.favoriteShow = false;
          this.favoriteLocal.products.splice(index, 1);
          localStorage.setItem('favorite', JSON.stringify(this.favoriteLocal))
        }
      }
    }
  }
}
