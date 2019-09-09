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
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    // this.init();
    this.crud.getCategory().then((v: any) => {
      console.log(v);
    });
  }


  // async init() {
  //   let category;
  //   await this.crud.getCategory().then((v: any) => {
  //     category = v;
  //     console.log(category);
  //   });
  // }
}
