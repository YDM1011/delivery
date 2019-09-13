import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit {
  public favoriteShow: boolean = false;
  public language: string;
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
    if (this.favoriteLocal && this.favoriteLocal.providers.length > 0) {
      let index;
      index = this.crud.find('_id', 1, this.favoriteLocal.providers);
      if(index !== undefined){
        this.favoriteShow = true;
      }
    }
  }
  favorite(e){
    if (e === true) {
      this.favoriteShow = e;
      let obj = {
        _id: 1
      };
      this.favoriteLocal.providers.push(obj);
      localStorage.setItem('favorite', JSON.stringify(this.favoriteLocal))
    } else {
      this.favoriteLocal = JSON.parse(localStorage.getItem('favorite'));
      if (this.favoriteLocal) {
        let index;
        index = this.crud.find('_id', 1, this.favoriteLocal.providers);
        if(index !== undefined){
          this.favoriteShow = false;
          this.favoriteLocal.providers.splice(index, 1);
          localStorage.setItem('favorite', JSON.stringify(this.favoriteLocal))
        }
      }
    }
  }
}
