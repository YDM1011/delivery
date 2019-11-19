import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit, OnDestroy {
  public brands = [];
  public companyArr: any;
  public language;
  public curentCity = {};
  private _subscription: Subscription[] = [];
  public translate ={
    title: {
      ru: 'Бренды',
      ua: 'Бренди'
    }
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this._subscription.push(this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    }));
    this._subscription.push(this.auth.onCity.subscribe((v:any) => {
      if (v) {
        this.crud.getCompany(v);
        this.curentCity = v;
      }
    }));
    this._subscription.push(this.auth.onCompany.subscribe((v:any)=>{
      if (v) {
        this.companyArr = v;
        this.init();
      }
    }));
    this.init();
  }
  async init(){
    await this.crud.getBrands().then((v: any) => {
      this.brands = v;
    });
  }
  ngOnDestroy() {
    this._subscription.forEach(it=>it.unsubscribe());
  }

}
