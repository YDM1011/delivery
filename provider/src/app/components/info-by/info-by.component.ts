import { Component, OnInit } from '@angular/core';
import { CrudService } from "../../crud.service";

@Component({
  selector: 'app-info-by',
  templateUrl: './info-by.component.html',
  styleUrls: ['./info-by.component.scss']
})
export class InfoByComponent implements OnInit {
  public dataPayed = [];
  public loaded = false;
  public data;
  constructor(
    private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('infoByers').then((v:any)=>{
      console.log(v)
      if (v && v[0] && v[0]._id) {
        this.dataPayed = v;
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
}
