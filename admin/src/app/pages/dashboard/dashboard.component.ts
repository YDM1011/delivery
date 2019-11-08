import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public dateStart: Date;
  public dateEnd: Date;
  public listProvider = [];
  public city = [];
  public cityChoose;
  public showCity;
  public providerChoose = 0;
  public defLang = 'ru-UA';
  public loading = false;
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('city').then((city: any) => {
      if (city) {
        this.city = city;
        this.cityChoose = this.city[0]._id;
        this.showCity = this.city[0]
      }
    });
    this.crud.get(`client?query={"role":"provider","companyOwner":{"$exists":true}}&populate={"path":"companyOwner","select":"img name"}&sort={"date":-1}`).then((v: any) => {
      if (!v) {return; }
      this.listProvider = v;
      this.loading = true;
    });
  }
  cityChange(v) {
    this.cityChoose = v;
    const index = this.crud.find('_id', v, this.city);
    this.showCity = this.city[index];

  }
  providerChange(v){
    this.providerChoose = v;
  }

}
