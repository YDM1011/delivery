import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public date1: Date;
  public date2: Date;
  public listProvider = [];
  public city = [];
  public cityChoose;
  public providerChoose = 0;
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('city').then((city: any) => {
      if (city) {
        this.city = city;
        this.cityChoose = this.city[0]._id;
      }
    });
    this.crud.get(`client?query={"role":"provider"}&populate={"path":"companyOwner","select":"img name"}&sort={"date":-1}`).then((v: any) => {
      if (!v) {return; }
      this.listProvider = v;
    });
  }
  cityChange(v) {
    this.cityChoose = v;
  }
  providerChange(v){
    this.providerChoose = v;
  }

}
