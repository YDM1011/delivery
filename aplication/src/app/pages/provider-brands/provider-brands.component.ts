import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-provider-brands',
  templateUrl: './provider-brands.component.html',
  styleUrls: ['./provider-brands.component.scss']
})
export class ProviderBrandsComponent implements OnInit {
  public brands = [];
  public id;
  public language;
  public translate ={
    title: {
      ru: 'Бренды',
      ua: 'Бренди'
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
      this.init(this.id)
    });
  }

  init(id){
    this.crud.get(`company?query={"_id":"${id}"}&select="brands"&populate={"path":"brands","populate":"mainCategory"}`).then((v: any) => {
      if (v && v.length>0){
        this.brands = v[0].brands;
      }
    })
  }
}
