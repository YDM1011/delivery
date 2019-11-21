import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public user;
  public showAnimate = false;
  constructor(
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (v) {
        this.user = v;
      }
    });
    this.auth.onWsOrder.subscribe((ws: any) => {
      if (ws) {
        this.showAnimate = true;
        setTimeout(()=> {
          this.showAnimate = false;
        },10000)
      }
    })
  }

}
