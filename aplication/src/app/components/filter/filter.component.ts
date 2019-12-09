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
  @Output() onCopyFilter = new EventEmitter();
  public language;
  public priceFilter = 0;
  public priceMax = 0;
  public isInit = false;
  public priceMin = 0;
  public sub = [];
  public subChack = [];
  public brand = [];
  public brandChack = [];
  public showMoreCat = false;
  public showMoreBrend = false;
  @Input() companyIdArr;
  @Input() mainCategory;
  @Input() city;
  @Input() filterInput;
  options: Options = {
    floor: this.priceFilter,
    ceil: this.priceMax,
  };

  public translate ={
    showMore: {
      ru: 'показать больше',
      ua: 'показати більше'
    },
    filters: {
      ru: 'Фильтры',
      ua: 'Фільтри'
    },
    sub_cat: {
      ru: 'Подкатегории',
      ua: 'Підкатегорії'
    },
    brands: {
      ru: 'Бренд',
      ua: 'Бренд'
    },
    price: {
      ru: 'Диапазон цен',
      ua: 'Диапазон цін'
    },
    btn1: {
      ru: 'Применить',
      ua: 'Застосувати'
    },
    btn2: {
      ru: 'Сбросить',
      ua: 'Скинути'
    }
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

    const query = `?query={"$and":[${arr.length > 0 ? JSON.stringify( {$or: arr} ) : {} },{"mainCategory":"${this.mainCategory._id}"}],"companyOwner":${JSON.stringify( {$in:this.companyIdArr})}}
    &sort={"price":-1}&limit=1&skip=0`;
    this.crud.get('order', '',  query).then((max: any) => {
      if (max.length>0) {
        this.priceMax = max[0].price;
      } else {
        this.priceMax = 0;
      }
      this.options = {
        floor: this.priceFilter,
        ceil: this.priceMax,
      };
      if (this.filterInput) {
        this.priceMin = this.filterInput.priceMin;
        this.priceMax = this.filterInput.priceMax;
        this.sub = this.filterInput.sub;
        this.brand = this.filterInput.brand;
      }
      this.chackSubCategory();
      this.chackBrands();
      this.isInit = true;
    });
  }
  chackSubCategory() {
    for (let i = 0; i < this.mainCategory.subCategory.length; i++) {
      if (this.sub.length === 0) {
        this.subChack[i] = false;
      }
      this.sub.forEach((item, index) => {
        if (this.mainCategory.subCategory[i] === item.subCategory) {
          this.subChack[i] = true;
          return;
        } else {
          if (this.subChack[i]) {
            return;
          }
          this.subChack[i] = false;
        }
      });
    }
  }
  chackBrands() {
    for (let i = 0; i < this.mainCategory.brands.length; i++) {
      if (this.brand.length === 0) {
        this.brandChack[i] = false;
      }
      this.brand.forEach((item, index) => {
        if (this.mainCategory.brands[i]._id === item.brand) {
          this.brandChack[i] = true;
          return;
        } else {
          if (this.brandChack[i]) {
            return;
          }
          this.brandChack[i] = false;
        }
      });
    }
  }
  closefilter() {
    this.onFilter.emit(
        ('') + ('') + ('')
    );
    this.onCopyFilter.emit(
        {
          priceMin: 0,
          priceMax: this.options.ceil,
          sub: [],
          brand: []}
    );
    this.closeFilter.emit(false);
  }
  initfilter() {
    const sum = JSON.stringify( {$and: [{price: {$lte: this.priceMax} }, {price: {$gte: this.priceMin}}]});
    const sub = this.sub.length > 0 ? JSON.stringify( {$or: this.sub}) : '';
    const brand = this.brand.length > 0 ? JSON.stringify( {$or: this.brand}) : '';
    console.log(this.brand);
    this.onFilter.emit((sub ? ',' + sub : '') + (brand ? ',' + brand : '') + (sum ? ',' + sum : '') );
    this.onCopyFilter.emit(
        {
      priceMin: this.priceMin,
      priceMax: this.priceMax,
      sub: this.sub,
      brand: this.brand}
      );
    this.closeFilter.emit(false);
  }
  priceFilterFunc() {
    // console.log(this.priceMax, this.priceMin);
  }
  getCheckSub(e, sub) {
    if (!e.checked) {
      const i = this.crud.find('_id', sub, this.sub );
      this.sub.splice(i, 1);
      return; }
    this.sub.push({subCategory: e.source.value});
  }
  getCheckBrand(e, brand) {
    if (!e.checked) {
      console.log("1",this.brand);
      const i = this.crud.find('_id', brand, this.brand );
      this.brand.splice(i, 1);
      console.log("1.1",this.brand);

    } else {
      console.log("0",this.brand);
      this.brand.push({brand: e.source.value});
    }
  }
}
