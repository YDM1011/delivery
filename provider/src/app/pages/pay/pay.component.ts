import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {
  public settings;
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('setting').then((v:any) => {
      if (v) {
        this.settings = Object.assign({}, v)
      }
    })
  }

}
