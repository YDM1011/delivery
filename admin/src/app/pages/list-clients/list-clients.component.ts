import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss']
})
export class ListClientsComponent implements OnInit {
  public loaded = false;
  public search;
  public defLang = 'ru-UA';
  public list = [];
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('client?query={"$or":[{"role": "client"},{"role":null},{"role":{"$exists":true}}]}').then((v: any) => {
      if(!v) return;
      this.list = v;
      this.loaded = true;
    }).catch( e => console.log(e));
  }

}
