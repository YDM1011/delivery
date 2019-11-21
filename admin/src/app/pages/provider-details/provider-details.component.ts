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
  public dateStart: Date = new Date();
  public dateEnd: Date = new Date();
  public defLang = 'ru-UA';
  public Date = new Date();
  public basketList = [];
  public provider;
  public newPass = '';
  public passErr = '';
  public loading = false;
  public countForTime;
  public allCounts = {
    first: null,
    second: null,
    third: null,
    forth: null,
    fifth: null
  };
  constructor(
      private crud: CrudService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.dateStart.setDate(this.dateStart.getDate() -7);
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.getBaskets(this.id);
      this.getProvider(this.id);
      this.getCounts(this.id);
      this.getfortime(this.id);
    });
  }
  getfortime(id){
    const dateStart = new Date(this.dateStart.getMonth()+1+'.'+(this.dateStart.getDate()) +'.'+new Date().getFullYear()).getTime();
    const dateEnd = new Date(this.dateEnd.getMonth()+1+'.'+(this.dateEnd.getDate()+1) +'.'+new Date().getFullYear()).getTime()-1;
    const query = JSON.stringify({from: dateStart, to:dateEnd});

    this.crud.get(`providerInfo/${id}/4?query=${query}`).then((v: any)=>{
      if (v && v.length>0) {
        this.countForTime =v[0];
      } else {
        this.countForTime =v;
      }
    });
  }
  changeCountForTime(){
    this.getfortime(this.id)
  }
  getCounts(id) {
    this.crud.get(`providerInfo/${id}/1`).then((v: any) => {
      if(!v[0]) {
        this.allCounts['first'] = 0;
        return;
      }
      this.allCounts['first'] = v[0].count;
    });
    this.crud.get(`providerInfo/${id}/2`).then((v: any) => {
      if(!v[0]) {
        this.allCounts['second'] = 0;
        return;
      }
      this.allCounts['second'] = v[0].count;
    });
    this.crud.get(`providerInfo/${id}/3`).then((v: any) => {
      if(!v[0]) {
        this.allCounts['third'] = 0;
        return;
      }
      this.allCounts['third'] = v[0].count;
    });
    this.crud.get(`providerInfo/${id}/4`).then((v: any) => {
      if(!v[0]) {
        this.allCounts['forth'] = 0;
        return;
      }
      this.allCounts['forth'] = v[0].count;
    });
    this.crud.get(`providerInfo/${id}/5`).then((v: any) => {
      if(!v[0]) {
        this.allCounts['fifth'] = 0;
        return;
      }
      this.allCounts['fifth'] = v[0].count;
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
  setNewPass() {
    if (this.newPass.length < 6) {
      this.passErr = "Пароль менее 6 символов!";
      return
    }
    this.crud.post('changePass', {pass:this.newPass,_id:this.provider.createdBy._id}).then(v=>{
      if (v) {
        this.newPass = '';
      }
    }).catch(e=>{console.log(e)})
  }
}
