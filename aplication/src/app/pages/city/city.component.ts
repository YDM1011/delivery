import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  public language: string;
  public city;
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private router: Router

  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.init();
  }


  async init() {
    await this.crud.getCity().then((v: any) => {
      this.city = v;
    });
  }

  changeCity(index){
    this.auth.setCity(this.city[index]);
    this.router.navigate(['/' + this.language])
  }

}
