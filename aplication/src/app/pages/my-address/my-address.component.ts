import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-my-address',
  templateUrl: './my-address.component.html',
  styleUrls: ['./my-address.component.scss']
})
export class MyAddressComponent implements OnInit {
  public language: string;
  public localStorage = localStorage ;
  public addressWorks;
  public data = {
    address: {ua: 'Список адрес магазинів порожній!', ru: 'Cписок адресов магазинов пуст!'}
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    const query = `?query={"createdBy":"${this.localStorage.getItem('userId')}"}`;
    const populate = `&populate={"path":"city"}`;

    this.crud.get('shopAddress', '', query + populate).then((v: any) => {
      this.addressWorks = v;
    });
  }
  refreshAddress(e) {
    if (e) {
      const query = `?query={"createdBy":"${this.localStorage.getItem('userId')}"}`;
      const populate = `&populate={"path":"city"}`;

      this.crud.get('shopAddress', '', query + populate).then((v: any) => {
        this.addressWorks = v;
      });
    }
  }
}
