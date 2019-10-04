import { Component } from '@angular/core';
import {AuthService} from "./auth.service";
import {CrudService} from "./crud.service";
import {WebNotificationService} from "./web-notification.service";
import {SwPush} from "@angular/service-worker";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'delivery';
  public setting: any;
  public loaded = false;
  public isEnabled = this.swPush.isEnabled;
  public isGranted = Notification.permission === 'granted';

  constructor(
    private swPush: SwPush,
    private webNotificationService: WebNotificationService,
      private auth: AuthService,
      private crud: CrudService
  ) {
    this.crud.get('translator').then((v: any) => {
      if (v) {
        this.auth.setTranslate(v);
        this.crud.get('setting').then((v: any) => {
          this.setting = Object.assign({}, v);
          this.auth.setSettings(this.setting);
          if (this.setting.city){
            this.auth.setCity(this.setting.city);
          }
          this.loaded = true;
        });
      }
    });

    try {
      this.webNotificationService.subscribeToNotification();
    } catch (e) {
    }

  }
}
