import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {ActivatedRoute} from "@angular/router";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-category-id',
  templateUrl: './category-id.component.html',
  styleUrls: ['./category-id.component.scss']
})
export class CategoryIDComponent implements OnInit {
  public id: string;
  public language: string;
  public companies;
  public showFilter: boolean = false;
  constructor(
      private route: ActivatedRoute,
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.init()
    });
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });

  }
  init(){
    this.auth.onCity.subscribe((city:any) => {
      if (city) {
        this.crud.getCategoryName(this.id, city._id).then((companies)=>{
          this.companies = companies;

        });
      }
    })
  }

  closeFilter(e){
    this.showFilter = e;
  }
}
