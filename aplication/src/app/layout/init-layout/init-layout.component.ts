import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {AuthService} from "../../auth.service";
import {ConnectionService} from 'ng-connection-service';

@Component({
  selector: 'app-init-layout',
  templateUrl: './init-layout.component.html',
  styleUrls: ['./init-layout.component.scss']
})
export class InitLayoutComponent implements OnInit {
  status = 'online';
  isConnected = true;
  constructor(
      private connectionService: ConnectionService,
      private auth: AuthService,
      private router: Router,
      private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (navigator.onLine){
      this.status = 'online';
      this.isConnected = true;
    } else {
      this.status = 'offline';
      this.isConnected = false;
    }
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "online";
      }
      else {
        this.status = "offline";
      }
    });

    this.route.params.subscribe((params: any) => {
      this.auth.setLanguage(this.route.snapshot.paramMap.get('lang'));
    });
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scroll({
        top: 0,
        left: 0
      });
    });
  }

}
