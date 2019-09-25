import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public user;
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if(!v) return;
      this.user = Object.assign({}, v);
    });
  }
  company() {
    this.crud.post('client', {companies: ['5d89df020a280c179cd099e0']}, this.user._id ).then((v: any) => {
      console.log(v);
    });
  }

}
