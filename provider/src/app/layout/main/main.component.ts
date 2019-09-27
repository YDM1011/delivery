import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public user;
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) {
        if (!this.cookieService.get('userId') || !localStorage.getItem('userId')) { return; }
        const query = JSON.stringify({_id: this.cookieService.get('userId')});
        this.crud.get('client').then((v: any) => {
          if (v) {
            console.log(v);
          }
        });
        // this.crud.get(`client?query=${query}&populate={"path":"companies","populate":{"path":"collaborators","path":"debtors","populate":{"path":"client"}}}`)
        //     .then((v2: any) => {
        //   if (!v2) {return; }
        //   this.auth.setMe(v2[0]);
        //   console.log(v2[0]);
        // });
      }
      this.user = v;
    });
  }
}
