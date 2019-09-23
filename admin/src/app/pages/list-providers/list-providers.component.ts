import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-list-providers',
  templateUrl: './list-providers.component.html',
  styleUrls: ['./list-providers.component.scss']
})
export class ListProvidersComponent implements OnInit {
  public loaded = false;
  public search;
  public defLang = 'ru-UA';
  public list = [];
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('client?query={"role": "provider"}').then((v: any) => {
      if(!v) return;
      this.list = v;
      this.loaded = true;
    });
  }

}
