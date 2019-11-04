import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  public language: string;
  public action = [];
  public toggleMain: boolean = true;
  public showRaiting: boolean = false;
  public loading = false;
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.init();
  }

  init() {
    const query = `?query=${JSON.stringify({client: {$in: localStorage.getItem('userId')}})}&sort={"date":-1}&skip=0&limit=3`;
    this.crud.get('action', '', query).then((v: any) => {
      if (v) {
        this.action = v;
        this.loading = true;
      }
     });
  }
  closeRaiting(e) {
    this.showRaiting = e.value;
  }
  getOutput(e) {
    if (e) {
      this.action = this.action.concat(e);
    }
  }
}
