import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-category-provider',
  templateUrl: './category-provider.component.html',
  styleUrls: ['./category-provider.component.scss']
})
export class CategoryProviderComponent implements OnInit {
  public language;
  public id;
  public category = [];

  public translate ={
    title: {
      ru: 'Категории',
      ua: 'Категорії'
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
    this.crud.get(`company?query={"_id":"${id}"}&select="categories"&populate={"path":"categories","populate":"mainCategory"}`).then((v: any) => {
      if (v) {
        this.category = v[0].categories;
      }
    })
  }

}
