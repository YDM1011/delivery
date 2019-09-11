import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {Category} from "../../interfaces/category";
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  public language: string;
  public curentCity = null;
  public category = [];
  public brandy = [];
  public toggleMain: boolean = true;
  public images = [`./assets/images/tmp/img-deli.png`, `./assets/images/tmp/img-product.png`, `./assets/images/tmp/img-deli.png`];
  public carentPhoto;
  public number: number = 0;
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
      }
    });
    this.carentPhoto = `url(${this.images[0]})`;
    this.init();
  }

  async init() {
    await this.crud.getCategory().then((v: any) => {
      if (!v) return;
      this.category = v;
    });
    await this.crud.getBrands().then((v: any) => {
      if (!v) return;
      this.brandy = v;
    });
  }
  changeCar(e) {
    this.carentPhoto = `url(${e})`;
  }
}
