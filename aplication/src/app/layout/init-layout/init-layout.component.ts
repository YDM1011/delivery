import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AuthService} from '../../auth.service';
import {ConnectionService} from 'ng-connection-service';
import {WS} from '../../websocket/websocket.events';
import {WebsocketService} from '../../websocket';
import {CrudService} from "../../crud.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-init-layout',
  templateUrl: './init-layout.component.html',
  styleUrls: ['./init-layout.component.scss']
})
export class InitLayoutComponent implements OnInit {
  status = 'online';
  isConnected = true;
  public language;
  public notificationOrders$: any;
  public notification$: any;
  public ratingConfirm$: any;
  public notificationDebtor$: any;
  public snackDebtorMessage = {
    ru: 'Ваш долг обновленн по заказу №',
    ua: 'Ваш борг обновлений по замовленню №'
  };
  public snackDebtorMessageAll = {
    ru: 'Ваш долг закрыт по заказу',
    ua: 'Ваш борг закритий по замовленню'
  };
  public snackOrderMessage = {
    ru: 'Статус вашего заказа обновлен',
    ua: 'Статус вашого замовлення обновленний'
  };
  constructor(
    private wsService: WebsocketService,
    private connectionService: ConnectionService,
    private auth: AuthService,
    private crud: CrudService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.ratingConfirm$ = this.wsService.on(WS.ON.ON_RATING_CONFIRM);
    this.notificationOrders$ = this.wsService.on(WS.ON.ON_CONFIRM_ORDER);
    this.notificationDebtor$ = this.wsService.on(WS.ON.ON_DEBTOR_CONFIRM);

    this.auth.onMe.subscribe((me: any) => {
      if (!me) {return; }
      this.ratingConfirm$.subscribe(v => {
        console.log(v)
      });
      this.notificationOrders$.subscribe(v => {
        this.auth.setUpdateOrder(v.data);
        this.openSnackBar(this.snackOrderMessage[this.language],  'Ok');
      });
      this.notificationDebtor$.subscribe(v => {
        this.auth.setUpdateDebtor(v.data);
        if (v.data.value === 0) {
          this.openSnackBar(this.snackDebtorMessageAll[this.language] + v.data.basket.basketNumber ? +' №'+v.data.basket.basketNumber: '',  'Ok');
        }
        if (v.data.value > 0) {
          this.openSnackBar(this.snackDebtorMessage[this.language] + v.data.basket.basketNumber ? +' №'+v.data.basket.basketNumber: '',  'Ok');
        }
      });
      console.log("fcm save");
      this.crud.saveToken('fcmToken:test')
    });
    this.auth.onLanguage.subscribe((l: any) => {
      if (l) {
        this.language = l;
      }
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


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
