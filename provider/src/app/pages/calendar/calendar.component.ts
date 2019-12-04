import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public dataPayed = [];
  public loaded = false;
  public data;
  public days = ['Воскресенье','Понедельник','Вторник','Среду','Четверг','Пятницу','Субботу'];
  public dataSet;
  public triger = true;
  public inputChange;
  public query=JSON.stringify({});
  public populate='populate='+ JSON.stringify({
    path:'clientOwner',
    select:'img name mobile login'
  });
  constructor(
    private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get(`companyClient?query=${this.query}&${this.populate}&skip=0&limit=${this.pageSizePagination}`).then((v:any)=>{
      if (v && v[0] && v[0]._id) {
        this.dataPayed = v;
      }
      this.loaded = true
    })
  }

  details(data){
    this.crud.get('shopAddress?query={"createdBy":"'+data._id+'"}&populate={"path":"city"}').then(address=>{
      data['addresses'] = [];
      data.addresses = address;
      this.data = data;
      console.log(data)
    })
  }
  close(){
    this.data = '';
  }
  closeSet(){
    this.dataSet = '';
  }
  pageEvent(e) {
    this.crud.get(`companyClient?query=${this.query}&${this.populate}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}`).then((c: any) => {
      if (!c) {
        return;
      }
      this.dataPayed = c;
      this.loaded = true;
    });
  }
  change() {
    if (this.triger){
      this.triger = false;
      setTimeout(()=>{this.triger = true},1000);
      this.query = JSON.stringify({$or:[
          {login: {$regex: this.inputChange, $options: 'gi'}},
          {mobile: {$regex: this.inputChange, $options: 'gi'}},
          {name: {$regex: this.inputChange, $options: 'gi'}}
        ]});
      this.crud.get(`companyClient?query=${this.query}&${this.populate}&skip=0&limit=${this.pageSizePagination}`).then((c: any) => {
        if (!c) {
          return;
        }
        this.dataPayed = c;
        this.loaded = true;
      });
    }
  }
  openSet(d){
    this.dataSet = d
  }
  pushSave(n,d){
    this.crud.post('companyClient', {pushDay:n}, d._id).then((v:any)=>{
      d['pushDay'] = v.pushDay;
    });
    this.dataSet = ''
  }
}
