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
        const userId = this.cookieService.get('userId') || localStorage.getItem('userId');
        const query = JSON.stringify({_id: userId});
        const populate = JSON.stringify(
            {'path': 'companies', 'populate': ['collaborators', 'debtors', 'categories']}
            );
        this.crud.get(`client?query=${query}&populate=${populate}`)
            .then((v2: any) => {
          if (!v2) {return; }
          this.auth.setMe(v2[0]);
          console.log(v2[0]);
        });
      }
      this.user = v;
    });
  }
}
