import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AuthService} from '../../auth.service';
import {ConnectionService} from 'ng-connection-service';
import {WS} from '../../websocket/websocket.events';
import {WebsocketService} from '../../websocket';

@Component({
  selector: 'app-init-layout',
  templateUrl: './init-layout.component.html',
  styleUrls: ['./init-layout.component.scss']
})
export class InitLayoutComponent implements OnInit {
  status = 'online';
  isConnected = true;
  public notificationOrders$: any;
  public notification$: any;
  public ratingConfirm$: any;

  constructor(
    private wsService: WebsocketService,
    private connectionService: ConnectionService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.ratingConfirm$ = this.wsService.on(WS.ON.ON_RATING_CONFIRM);
    this.ratingConfirm$.subscribe(v => {
      console.log(v)
    });
    this.notificationOrders$ = this.wsService.on(WS.ON.ON_CONFIRM_ORDER);
    this.notificationOrders$.subscribe(v => {
      this.auth.setUpdateOrder(v.data);
    });
    if (navigator.onLine) {
      this.status = 'online';
      this.isConnected = true;
    } else {
      this.status = 'offline';
      this.isConnected = false;
    }
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = 'online';
      }
      else {
        this.status = 'offline';
      }
    });

    this.notification$ = this.wsService.on(WS.ON.ON_NOTIFICATION);

    this.notification$.subscribe(v => {
      this.playAudio();
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

  playAudio() {
    const audio = new Audio();
    audio.src = '../../../assets/audio/alert.mp3';
    audio.load();
    audio.play();
  }


}
