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
  public dateStart: Date = null;
  public dateEnd: Date = null;
  public listProvider = [];
  public city = [];
  public cityChoose = null;
  public showCity;
  public providerChoose = 0;
  public defLang = 'ru-UA';
  public loading = false;
  public countAndSub = [];
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('city').then((city: any) => {
      if (city) {
        this.city = city;
        this.cityChoose = this.city[0]._id;
        this.showCity = this.city[0];
        this.getInfoByCity(this.cityChoose);
        this.getCompany();
      }
    });
  }
  getCompany() {
    this.crud.get(`company/count?query={"city":"${this.cityChoose}"}&sort={"date":-1}`).then((count: any) => {
      if (count) {
        this.lengthPagination = count.count;
        this.crud.get(`company?query={"city":"${this.cityChoose}"}&sort={"date":-1}`).then((v: any) => {
          if (!v) {return; }
          this.listProvider = v;
          this.loading = true;
          this.getInfoForCompanies();
        });
      }
    })
  }
  getInfoForCompanies() {
    this.countAndSub = [];
    this.listProvider.forEach((item)=>{
      this.crud.get(`providerInfo/${item._id}/4/${this.cityChoose}/${this.dateStart}/${this.dateEnd}`).then((v: any)=>{
        if (v && v.length>0) {
          this.countAndSub.push(v[0]);
        } else {
          this.countAndSub.push(v);
        }
      })
    })
  }
  getInfoByCity(idCity){
      this.crud.get(`providerInfoByCity/${idCity}/4`).then((v: any) => {
        if (v) {
          console.log(v)
        }
      });
  }
  cityChange(v) {
    this.loading = false;
    this.cityChoose = v;
    this.getInfoByCity(this.cityChoose);
    this.getCompany();
    const index = this.crud.find('_id', v, this.city);
    this.showCity = this.city[index];

  }
  providerChange(v){
    console.log(v);
    this.providerChoose = v;
  }
  pageEvent(e){

  }
}
