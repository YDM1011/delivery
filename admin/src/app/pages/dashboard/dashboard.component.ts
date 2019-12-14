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
  public dateStart = new Date();
  public dateEnd = new Date();
  public listProvider = [];
  public listProviderForOne = [];
  public city = [];
  public cityChoose = null;
  public showCity;
  public providerChoose = 0;
  public defLang = 'ru-UA';
  public loading = false;
  public countAndSub = [];
  public infoFromCity;
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.dateStart.setDate(this.dateStart.getDate() -7);
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
        this.crud.get(`company?query={"city":"${this.cityChoose}"}&skip=0&limit=${this.pageSizePagination}&sort={"date":-1}`).then((v: any) => {
          if (!v) {return; }
          this.listProvider = v;
          this.loading = true;
          this.getInfoForCompanies('main');
        });
      }
    })
  }
  getInfoForCompanies(array) {
    const dateStart = new Date(this.dateStart.getMonth()+1+'.'+(this.dateStart.getDate()) +'.'+new Date().getFullYear()).getTime();
    const dateEnd = new Date(this.dateEnd.getMonth()+1+'.'+(this.dateEnd.getDate()+1) +'.'+new Date().getFullYear()).getTime()-1;
    this.countAndSub = [];
    this.getInfoByCity(this.cityChoose);
    const query = JSON.stringify({from: dateStart, to:dateEnd});
    if (array === 'main'){
      this.listProvider.forEach((item)=>{
        this.crud.get(`providerInfo/${item._id}/4?query=${query}`).then((v: any)=>{
          if (v && v.length>0) {
            this.countAndSub[this.crud.find('id', item._id, this.listProvider)] = v[0]
          } else {
            this.countAndSub[this.crud.find('id', item._id, this.listProvider)] = v
          }
        });
      })
    } else if (array === 'forOne') {
      this.listProviderForOne.forEach((item)=>{
        this.crud.get(`providerInfo/${item._id}/4?query=${query}`).then((v: any)=>{
          if (v && v.length>0) {
            this.countAndSub[this.crud.find('id', item._id, this.listProvider)] = v[0]
          } else {
            this.countAndSub.push(v);
          }
        })
      })
    }
  }
  getInfoByCity(idCity){
    const dateStart = new Date(this.dateStart.getMonth()+1+'.'+(this.dateStart.getDate()) +'.'+new Date().getFullYear()).getTime();
    const dateEnd = new Date(this.dateEnd.getMonth()+1+'.'+(this.dateEnd.getDate()+1) +'.'+new Date().getFullYear()).getTime() -1;
    const query = JSON.stringify({from:dateStart,to:dateEnd});
    this.crud.get(`providerInfoByCity/${idCity}/4?query=${query}`).then((v: any) => {
      if (v && v.length>0) {
        this.infoFromCity = v[0];
      } else {
        this.infoFromCity = v;
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
    this.loading = false;
    if (v === 0) {
      this.getCompany();
      this.listProviderForOne = [];
    } else {
      this.providerChoose = v;
      this.crud.get(`company?query={"_id":"${this.providerChoose}"}`).then((v: any) => {
        if (!v) {return; }
        this.listProviderForOne = v;
        this.loading = true;
        this.getInfoForCompanies('forOne');
      });
    }
  }
  pageEvent(e) {
    this.loading = false;
    this.crud.get(`company?query={"city":"${this.cityChoose}"}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}&sort={"date":-1}`).then((v: any) => {
      if (!v) {return; }
      this.listProvider = v;
      this.loading = true;
      this.getInfoForCompanies('main');
    });
  }
}
