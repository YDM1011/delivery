import { Component } from '@angular/core';
import {AuthService} from "./auth.service";
import {CrudService} from "./crud.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'delivery';
  public setting: any;
  public loaded = true;
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) {
    this.crud.get('translator').then((v: any) => {
      if (v) {
        this.auth.setTranslate(v);
        this.crud.get('setting').then((v: any) => {
          this.setting = Object.assign({}, v);
          this.auth.setSettings(this.setting);
          this.loaded = true;
        });
      }
    });
  }
}
