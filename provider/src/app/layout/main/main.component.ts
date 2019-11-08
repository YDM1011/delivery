import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {WebsocketService} from '../../websocket';
import {WS} from '../../websocket/websocket.events';
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public user;
  public notification$;
  public notificationOrders$;
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private wsService: WebsocketService,
      private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.notificationOrders$ = this.wsService.on(WS.ON.ON_CONFIRM_ORDER);
    this.notificationOrders$.subscribe(v => {
      this.auth.setWsOrder(v.data);
      this.playAudio();
      if (v.data.status === 5) {
        this.openSnackBar('Клиент отменил заказ',  'Ok');
        return;
      }
      if (v.data.manager && v.data.status === 2) {
        this.openSnackBar('Клиент подтвердил изменения',  'Ok');
        return;
      }
      this.openSnackBar('У вас новый заказ',  'Ok');
    });

    if (!localStorage.getItem('userId')) { return; }
    const userId = localStorage.getItem('userId');
    const query = JSON.stringify({_id: userId});
    const populate = JSON.stringify(
        {'path': 'companyOwner companies', 'populate': ['action', 'collaborators', 'debtors', 'categories']}
    );
    this.crud.get(`client?query=${query}&populate=${populate}`)
        .then((v2: any) => {
          if (!v2) {return; }
          this.auth.setMe(v2[0]);
        });
    this.auth.onMe.subscribe((v: any) => {
      if (v) {
        this.user = v;
      }
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
