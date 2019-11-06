import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.scss']
})
export class ProviderDetailsComponent implements OnInit {
  public id;
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public dateStart: Date;
  public dateEnd: Date;
  public defLang = 'ru-UA';
  public Date = new Date();
  public basketList = [];
  public provider;
  public loading = false;
  constructor(
      private crud: CrudService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.getBaskets(this.id);
      this.getProvider(this.id);
    });
  }

  getProvider(id){
    this.crud.get(`company?query={"_id":"${this.id}"}&populate=[{"path":"createdBy","select":"name mobile"},{"path":"city","select":"name"}]`).then((company: any) => {
      if (company) {
        this.provider = company[0];
      }
    })
  }
  getBaskets(id){
    this.crud.get(`basket/count?query={"companyOwner":"${id}"}`).then((count: any) =>{
      if(count) {
        this.lengthPagination = count.count;
        this.crud.get(`basket?query={"companyOwner":"${id}","status":{"$ne":0}}&populate=[{"path":"deliveryAddress","populate":"city","select":"name build street department"},{"path":"manager","select":"name"}]&skip=0&limit=${this.pageSizePagination}&sort={"date":-1}`).then((bask: any) =>{
          this.basketList = bask;
          this.loading = true;
        })
      }
    });
  }
  pageEvent(e) {
    this.crud.get(`basket?query={"companyOwner":"${this.id}","status":{"$ne":0}}&populate=[{"path":"deliveryAddress","populate":"city","select":"name build street department"},{"path":"manager","select":"name"}]&sort={"date":-1}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}`).then((l: any) => {
      if (!l) {return;}
      this.basketList = l;
    });
  }
}
