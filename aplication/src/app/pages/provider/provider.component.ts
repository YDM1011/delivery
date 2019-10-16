import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {ActivatedRoute} from "@angular/router";
import {query} from "@angular/animations";

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit {
  public language: string;
  public favoriteShow;
  public id;
  public me;
  public company;
  public products = {};
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
      this.init()
    });
    this.auth.onMe.subscribe((v: string) => {
      this.me = v;
      if (this.me && this.me.favoriteCompany && (this.me.favoriteCompany.indexOf(this.id)>-1))
        this.favoriteShow = true;
    });
  }
  init() {
    this.crud.getDetailCompany(this.id, this.company).then((v:any)=>{
      if (v) {
        this.company = v;
      }
    })
  }
  getProduct(categoryId){
    let skip = this.products[categoryId] ? this.products[categoryId].length : 0;
    const query = `?query={"companyOwner":"${this.id}","categoryOwner":"${categoryId}"}&limit=2&skip=${skip}`;
    this.crud.get('order', '', query).then(v=>{
      if(!this.products[categoryId]) {
        this.products[categoryId] = []
      }
      this.products[categoryId] = this.products[categoryId].concat(v)
    })
  }
  favoriteCompany(){
    this.crud.favoriteCompany({companyId:this.id}).then((v:any)=>{
      if (v) {
        this.me.favoriteCompany = v;
        if (v && (v.indexOf(this.id)>-1)) {
          this.favoriteShow = true;
        } else {
          this.favoriteShow = false;
        }

      }
    })
  }
}
