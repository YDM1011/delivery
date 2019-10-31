import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {query} from "@angular/animations";

@Component({
  selector: 'app-provider-all',
  templateUrl: './provider-all.component.html',
  styleUrls: ['./provider-all.component.scss']
})
export class ProviderAllComponent implements OnInit {
  public language: string;
  public curentCity: string;
  public companyArr;
  public data ={
    company: {ua:'', ru:'Cписок поставщиков пуст для города!'}
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    })
    this.auth.onCity.subscribe((v:any) => {
      if (v) {
        const query = `?query={"city":"${v._id}","verify":true}`;
        this.crud.get('company', '', query).then((arr)=>{
          this.curentCity = v;
          this.companyArr = arr;
          this.init();
        });

      }
    })
  }

  async init() {
    console.log(this.companyArr)
  }
}
