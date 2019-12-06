import { Component, OnInit } from '@angular/core';
import { CrudService } from "../../crud.service";

@Component({
  selector: 'app-info-by',
  templateUrl: './info-by.component.html',
  styleUrls: ['./info-by.component.scss']
})
export class InfoByComponent implements OnInit {
  public dateStart = new Date();
  public dateEnd = new Date();
  public dataPayed = [];
  public loaded = false;
  public data;
  constructor(
    private crud: CrudService
  ) { }

  ngOnInit() {
    this.getInfoByers();
  }

  details(data){
    this.data = data
  }
  close(){
    this.data = '';
  }

  getInfoByers(){
    const timeStart = new Date(this.dateStart.getTime() - this.dateStart.getHours()*60*60*1000 - this.dateStart.getMinutes()*60*1000  - this.dateStart.getSeconds()*1000).getTime();
    const timeEnd = new Date(this.dateEnd.getTime() - this.dateEnd.getHours()*60*60*1000 - this.dateEnd.getMinutes()*59*1000  - this.dateEnd.getSeconds()*1000).getTime()+86380000;
    this.crud.get(`infoByers?query={"date":{"$gte":"${timeStart}","$lte":"${timeEnd}"}}`).then((v:any)=>{
      if (v && v[0] && v[0]._id) {
        this.dataPayed = v;
      }
      this.loaded = true
    })
  }

  changeDate(){
    this.getInfoByers()
  }
}
