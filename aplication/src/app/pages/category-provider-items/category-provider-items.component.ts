import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-category-provider-items',
  templateUrl: './category-provider-items.component.html',
  styleUrls: ['./category-provider-items.component.scss']
})
export class CategoryProviderItemsComponent implements OnInit {
  public id:string;
  public companyId:string;
  public category;
  public loading = false;
  public orders = [];
  public language;
  public city;
  public sort;
  public selectedSort = 0;
  public CityLinksArr = [];
  public companyIdArr = [];
  public copyfilterObj;
  public translate ={
    sort1: {
      ru: 'Новинки',
      ua: 'Бренди'
    },
    sort2: {
      ru: 'От дешевых к дорогим',
      ua: 'Від дешевих до дорогих'
    },
    sort3: {
      ru: 'От дорогих к дешевым',
      ua: 'Від дорогих до дешевих'
    },
    filter:{
      ru: 'Фильтр',
      ua: 'Фільтр'
    },
    empty:{
      ru: 'Продукты отсутствуют',
      ua: 'Продукти відсутні'
    }
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.companyId = this.route.snapshot.paramMap.get('company');
      this.init();
    });
  }

  init(){
    this.crud.get(`category`, this.id).then((v: any)=> {
      if(v) {
        this.category = v;
        this.loading = true;
      }
    });
    this.crud.get(`order?query={"categoryOwner":"${this.id}","companyOwner":"${this.companyId}"}&populate={"path":"companyOwner"}&skip=0&limit=5&sort=${this.sort}`).then((v:any) => {
      if (v){
        this.orders = v;
      }
    })
  }
  reinit(){
    this.init();
  }
  copyFilter(e) {
    this.copyfilterObj = e;
  }
  sortChanges() {
    switch (this.selectedSort) {
      case 0:
        this.sort = JSON.stringify({date: -1});
        break;
      case 1:
        this.sort = JSON.stringify({price: 1});
        break;
      case 2:
        this.sort = JSON.stringify({price: -1});
        break;
      default: return;
    }
    this.reinit();
  }

  getOutput(e) {
    this.orders = this.orders.concat(e);
  }
}
