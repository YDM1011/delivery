import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  public language: string;
  public category = [];

  public translate ={
    title: {
      ru: 'Категории',
      ua: 'Категорії'
    }
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.init();
  }

  async init() {
    await this.crud.getCategory().then((v: any) => {
      this.category = v;
    });
  }
}
