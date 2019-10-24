import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {ActivatedRoute} from '@angular/router';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-category-id',
  templateUrl: './category-id.component.html',
  styleUrls: ['./category-id.component.scss']
})
export class CategoryIDComponent implements OnInit {
  public id: string;
  public language: string;
  public orders;
  public city;
  public mainCategory;
  public showFilter = false;
  public selectedSort = 0;
  constructor(
      private route: ActivatedRoute,
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.init();
    });
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });

  }
  init() {
    this.auth.onCity.subscribe((city: any) => {
      if (city) {
        this.city = city
        this.crud.getCategoryName(this.id).then((mainCategory) => {
          this.mainCategory = mainCategory

          let arr = [];
          if(this.city.links){
            this.city.links.forEach(it=>{
              if (it)
                arr.push({"cityLink":it})
            });
          }

          const query = `?query={"$and":[${arr.length>0 ? JSON.stringify( {$or:arr} ) : {} },{"mainCategory":"${this.mainCategory._id}"}]}`;
          this.crud.get('order', '',  query).then((orders) => {
            this.orders = orders;
          });
        });
      }
    });
  }
  reinit(e){
    let arr = [];
    if(this.city.links){
      this.city.links.forEach(it=>{
        if (it)
          arr.push({"cityLink":it})
      });
    }
    const query = `?query={"$and":[${arr.length>0 ? JSON.stringify( {$or:arr} ) : {} },{"mainCategory":"${this.mainCategory._id}"},${e}]}`;
    this.crud.get('order', '',  query).then((orders) => {
      this.orders = orders;
    });
  }
  closeFilter(e) {
    this.showFilter = e;
  }

  getOrders(companyId){
    /** companyId brand mainCategory subcategory */

  }
  sortChanges() {

  }
}
