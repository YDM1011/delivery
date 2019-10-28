import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth.service';
import {Options} from 'ng5-slider';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() closeFilter = new EventEmitter();
  @Output() onFilter = new EventEmitter();
  public language: string;
  public priceFilter = 0;
  public priceMax = 0;
  public isInit = false;
  public priceMin = 0;
  public sub = [];
  public brand = [];
  @Input() mainCategory;
  @Input() city;
  options: Options = {
    floor: this.priceFilter,
    ceil: this.priceMax,
  };
  constructor(
      private route: ActivatedRoute,
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });

    const arr = [];
    if (this.city.links) {
      this.city.links.forEach(it => {
        if (it) {
          arr.push({cityLink: it});
        }
      });
    }

    const query = `?query={"$and":[${arr.length > 0 ? JSON.stringify( {$or: arr} ) : {} },{"mainCategory":"${this.mainCategory._id}"}]}
    &sort={"price":-1}&limit=1&skip=0`;
    this.crud.get('order', '',  query).then((max) => {
      this.priceMax = max[0].price;
      this.options = {
        floor: this.priceFilter,
        ceil: this.priceMax,
      };
      this.isInit = true;
    });
  }
  closefilter() {
    this.closeFilter.emit(false);
  }
  initfilter() {
    const sum = JSON.stringify( {$and: [{price: {$lte: this.priceMax} }, {price: {$gte: this.priceMin}}]});
    const sub = this.sub.length > 0 ? JSON.stringify( {$or: this.sub}) : '';
    const brand = this.brand.length > 0 ? JSON.stringify( {$or: this.brand}) : '';
    this.onFilter.emit((sub ? ',' + sub : '') + (brand ? ',' + brand : '') + (sum ? ',' + sum : '') );
    this.closeFilter.emit(false);
  }
  priceFilterFunc() {
    console.log(this.priceMax, this.priceMin);
  }
  getCheckSub(e) {
    if (!e.checked) {return; }
    this.sub.push({subCategory: e.source.value});
    console.log(this.sub, {subCategory: e.source.value});
  }
  getCheckBrand(e) {
    if (!e.checked) {return; }
    this.brand.push({brand: e.source.value});
  }
}
