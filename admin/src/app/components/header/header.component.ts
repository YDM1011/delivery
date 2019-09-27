import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
      private crud: CrudService,
      private route: Router
  ) { }

  ngOnInit() {
  }
  logout() {
    this.crud.post('adminLogout', {}, null, false).then((v: any) => {
      if (v) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminId');
        this.route.navigate(['/login']);
      }
    });
  }
}
