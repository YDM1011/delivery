import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.scss']
})
export class VisitorComponent implements OnInit {
  public visitors = [];
  public loaded = false;
  public data;
  public query = '';
  public tab;
  public companyOwner;
  public dateStart = new Date();
  public dateEnd = new Date();
  constructor(
    private crud: CrudService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe(v=>{
      this.companyOwner = v.companyOwner._id;
      this.selectChange(0);
      this.initData()
    })

  }
  initData(){
    this.crud.get('analytic?'+this.query+'populate=[{"path":"visitedBy"},{"path":"visit.product"}]&sort={"date":-1}&limit=10&skip=0', '').then((v:any)=>{
      if (v && v[0] && v[0]._id) {
        this.visitors = v;
      } else if (v && v.length == 0){
        this.visitors = []
      }
      this.loaded = true
    })
  }
  details(data){
    this.data = data
  }
  close(){
    this.data = '';
  }
  more(){
    this.crud.get('analytic?populate=[{"path":"visitedBy"},{"path":"visit.product"}]&sort={"date":-1}&limit=10&skip='+this.visitors.length, '').then((v:any)=>{
      if (v && v[0] && v[0]._id) {
        this.visitors = this.visitors.concat(v);
      }
    })
  }
  selectChange(e){
    const timeStart = new Date(this.dateStart.getTime() - this.dateStart.getHours()*60*60*1000 - this.dateStart.getMinutes()*60*1000  - this.dateStart.getSeconds()*1000).getTime() + new Date().getTimezoneOffset()*1000;
    const timeEnd =   new Date(this.dateEnd.getTime() - this.dateEnd.getHours()*60*60*1000 - this.dateEnd.getMinutes()*60*1000  - this.dateEnd.getSeconds()*1000).getTime()+86380000 + new Date().getTimezoneOffset()*1000;

    if (e != this.tab){
      this.loaded = false;
      this.tab = e;
      if (this.tab === 0){
        this.query = `query={"date":{"$gte":"${timeStart}","$lte":"${timeEnd}"}}&`
      } else {
        this.query = `query={"byin":{"$in":["${this.companyOwner}"]},"date":{"$gte":"${timeStart}","$lte":"${timeEnd}"}}&`
      }
      // if (this.tab == 1) {
      //   let date = new Date(new Date().getTime() - new Date().getHours()*60*60*1000 - new Date().getMinutes()*60*1000  - new Date().getSeconds()*1000).getTime() + new Date().getTimezoneOffset()*1000;
      //   this.query = 'query={"date":{"$gt":'+date+'}}&'
      // } else {
      //   let date = new Date(new Date().getTime() - new Date().getHours()*60*60*1000 - new Date().getMinutes()*60*1000  - new Date().getSeconds()*1000).getTime() + new Date().getTimezoneOffset()*1000;
      //   this.query = 'query={"byin":{"$in":["'+this.companyOwner+'"]},"date":{"$gt":'+date+'}}&'
      // }
      this.initData()
    }
  }
}
