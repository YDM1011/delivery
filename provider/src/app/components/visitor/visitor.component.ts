import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.scss']
})
export class VisitorComponent implements OnInit {
  public visitors = [];
  public loaded = false;
  public data;
  constructor(
    private crud: CrudService
  ) { }

  ngOnInit() {
    let date = new Date(new Date().getTime() - new Date().getHours()*60*60*1000 - new Date().getMinutes()*60*1000  - new Date().getSeconds()*1000).getTime() + new Date().getTimezoneOffset()*1000;
    this.crud.get('analytic?query={"date":{"$gt":'+date+'}}&populate=[{"path":"visitedBy"},{"path":"visit.product"}]&sort={"date":-1}&limit=10&skip=0', '').then((v:any)=>{
      if (v && v[0] && v[0]._id) {
        this.visitors = v;
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
}
