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
  public curentCity;
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
        this.curentCity = v;
        const query = `?query={"city":"${this.curentCity._id}","verify":true}&skip=0&limit=8&sort={"rating":-1}`;
        this.crud.get('company', '', query).then((arr: any) => {
          this.companyArr = arr;
          console.log(this.companyArr);
        });
      }
    })
  }
  output(e){
    if (e) {
      this.companyArr.concat(e);
    }
  }
}
