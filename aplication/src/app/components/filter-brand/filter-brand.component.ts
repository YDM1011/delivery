import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Options} from "ng5-slider";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-filter-brand',
  templateUrl: './filter-brand.component.html',
  styleUrls: ['./filter-brand.component.scss']
})
export class FilterBrandComponent implements OnInit {
  @Output() closeFilter = new EventEmitter();
  @Output() onFilter = new EventEmitter();
  @Output() onCopyFilter = new EventEmitter();
  public language: string;
  public priceFilter = 0;
  public priceMax = 0;
  public isInit = false;
  public priceMin = 0;
  @Input() brand;
  @Input() city;
  @Input() filterInput;
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
    const query = `?query={"$and":[${arr.length > 0 ? JSON.stringify( {$or: arr} ) : {} },{"brand":"${this.brand}"}]}
    &sort={"price":-1}&limit=1&skip=0`;
    this.crud.get('order', '',  query).then((max) => {
      this.priceMax = max[0].price;
      this.options = {
        floor: this.priceFilter,
        ceil: this.priceMax,
      };
      if (this.filterInput) {
        this.priceMin = this.filterInput.priceMin;
        this.priceMax = this.filterInput.priceMax;
      }
      this.isInit = true;
    });
  }
  closefilter() {
    this.onFilter.emit((''));
    this.onCopyFilter.emit(
        {
          priceMin: 0,
          priceMax: this.options.ceil}
    );
    this.closeFilter.emit(false);
  }
  initfilter() {
    const sum = JSON.stringify( {$and: [{price: {$lte: this.priceMax} }, {price: {$gte: this.priceMin}}]});
    this.onFilter.emit((sum ? ',' + sum : ''));
    this.onCopyFilter.emit(
        {
          priceMin: this.priceMin,
          priceMax: this.priceMax
        }
    );
    this.closeFilter.emit(false);
  }
  priceFilterFunc() {
  }
}
