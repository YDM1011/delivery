import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-provider-all',
  templateUrl: './provider-all.component.html',
  styleUrls: ['./provider-all.component.scss']
})
export class ProviderAllComponent implements OnInit {
  public language;
  public curentCity: string;
  public companyArr;
  public data ={
    company: {ua:'Список постачалькиків пустий для міста!', ru:'Cписок поставщиков пуст для города!'}
  };
  public translate ={
    title: {
      ru: 'Поставщики',
      ua: 'Постачальники'
    }
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.auth.onCity.subscribe((v:any) => {
      if (v) {
        const query = `?query={"city":"${v._id}","verify":true}&sort={"rating":-1}`;
        this.crud.get('company', '', query).then((arr)=>{
          this.curentCity = v;
          this.companyArr = arr;
        });
      }
    })
  }
}
