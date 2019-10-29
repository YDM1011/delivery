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
  public sort;
  public filter;
  public mainCategory;
  public showFilter = false;
  public selectedSort = 0;
  public CityLinksArr = [];
  public copyfilterObj;
  constructor(
      private route: ActivatedRoute,
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.sort = JSON.stringify({date: -1});
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
        this.city = city;
        this.crud.getCategoryName(this.id).then((mainCategory) => {
          this.mainCategory = mainCategory;
          const arr = [];
          if (this.city.links) {
            this.city.links.forEach(it => {
              if (it) {
                arr.push({cityLink: it});
                this.CityLinksArr.push({cityLink: it});
              }
            });
          }
          const query = `?query={"$and":[${arr.length > 0 ? JSON.stringify( {$or: arr} ) : {} },{"mainCategory":"${this.mainCategory._id}"}]}&skip=0&limit=5&sort=${this.sort}`;
          this.crud.get('order', '',  query).then((orders) => {
            this.orders = orders;
          });
        });
      }
    });
  }
  reinit(e = this.filter) {
    const arr = [];
    this.filter = e;
    if (this.city.links) {
      this.city.links.forEach(it => {
        if (it) {
          arr.push({cityLink: it});
          this.CityLinksArr.push({cityLink: it});
        }
      });
    }

    const query = `?query={"$and":[${arr.length > 0 ? JSON.stringify( {$or: arr} ) : {} },{"mainCategory":"${this.mainCategory._id}"}${this.filter ? this.filter : ''}]}&skip=0&limit=5&sort=${this.sort}`;
    this.crud.get('order', '',  query).then((orders) => {
      this.orders = orders;
    });
  }
  closeFilter(e) {
    this.showFilter = e;
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
