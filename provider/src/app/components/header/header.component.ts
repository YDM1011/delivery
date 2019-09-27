import { Component, OnInit } from '@angular/core';
import {CrudService} from '../../crud.service';
import {Router} from "@angular/router";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public user;
  constructor(
      private crud: CrudService,
      private router: Router,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) return;
      this.user = v;
    })
  }

  logout() {
    this.crud.post('logout', {}, null, false).then((v: any) => {
      if (v) {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        this.router.navigate(['login']);
      }
    });
  }
}
