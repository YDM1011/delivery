import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {Subscription} from 'rxjs';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  public count = null;
  public user;
  public companyArr: any;
  public language: string;
  public curentCity: any = {};
  public category = [];
  public brandy = [];
  public topCompany = [];
  public topProduct = [];
  public toggleMain = true;
  public loadingCount = true;
  public images = [`./assets/images/tmp/img-deli.png`, `./assets/images/tmp/img-product.png`, `./assets/images/tmp/img-deli.png`];
  public carentPhoto;
  public number = 0;
  public loaded = {
    category: false,
    topCompany: false,
    topProduct: false,
    brand: false
  };
  private _subscription: Subscription[] = [];
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) {return; }
      this.user = v;
    });
    this._subscription.push(this.auth.onBasketCount.subscribe((v: any) => {
      if (v) {
        this.count = v;
      } else {
        this.count = 0;
      }
      this.loadingCount = true;
    }));
    this._subscription.push(this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    }));
    this._subscription.push(this.auth.onCity.subscribe((v: any) => {
      if (v) {
        this.crud.getCompany(v).then((arr) => {
          this.curentCity = v;
          this.companyArr = arr;
          this.init();
        });
      }
    }));
    this.carentPhoto = `url(${this.images[0]})`;
  }


  async init() {
    await this.crud.getBrands().then((v: any) => {
      if (!v) {return; }
      this.brandy = v;
      this.loaded.brand = true;
    }).catch((e) => { this.loaded.brand = true; });
    await this.crud.getCategory().then((v: any) => {
      if (!v) {return; }
      this.category = v;
      this.loaded.category = true;
    }).catch((e) => { this.loaded.category = true; });
    await this.crud.getTopCompany().then((v: any) => {
      if (!v) {return; }
      this.topCompany = v;
      this.loaded.topCompany = true;
    }).catch((e) => { this.loaded.topCompany = true; });
    await this.crud.getTopProduct().then((v: any) => {
      if (!v) {return; }
      this.topProduct = v;
      this.loaded.topProduct = true;
    }).catch((e) => { this.loaded.topProduct = true; });
  }
  changeCar(e) {
    this.carentPhoto = `url(${e})`;
  }
  ngOnDestroy() {
    this._subscription.forEach(it => it.unsubscribe());
  }
}
