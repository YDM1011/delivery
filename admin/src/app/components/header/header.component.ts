import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";
import {Router} from "@angular/router";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public me;
  constructor(
      private crud: CrudService,
      private route: Router,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v:any) => {
      if(v){
        this.me = v;
      }
    })
  }
  logout() {
    this.crud.post('adminLogout', {}, null, false).then((v: any) => {
      if (v) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminId');
        this.route.navigate(['/login']);
      }
    }).catch();
  }
}
