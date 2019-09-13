import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {WS} from "../../websocket/websocket.events";
import {WebsocketService} from "../../websocket";
import {CrudService} from "../../crud.service";
import {CrudService} from "../../crud.service";
import {Category} from "../../interfaces/category";
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  public notification$: any;
  public language: string;
  public curentCity = null;
  public category = [];
  public brandy = [];
  public toggleMain: boolean = true;
  public images = [`./assets/images/tmp/img-deli.png`, `./assets/images/tmp/img-product.png`, `./assets/images/tmp/img-deli.png`];
  public carentPhoto;
  public number: number = 0;
  constructor(
      private auth: AuthService,
      private wsService:WebsocketService,
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.auth.onCity.subscribe((v:any) => {
      if (v) {
        this.curentCity = v;
      }
    });
    this.carentPhoto = `url(${this.images[0]})`;

    // this.wsService.send(WS.SEND.NOTIFICATION, 'admin',  { data: 'test sf' });
    this.notification$ = this.wsService.on(WS.ON.ON_NOTIFICATION);

    this.notification$.subscribe(v => {
      this.playAudio();
    });

    this.init();
  }

  playAudio() {
    const audio = new Audio();
    audio.src = '../../../assets/audio/alert.mp3';
    audio.load();
    audio.play();

  }

  async init() {
    await this.crud.getCategory().then((v: any) => {
      if (!v) return;
      this.category = v;
    });
    await this.crud.getBrands().then((v: any) => {
      if (!v) return;
      this.brandy = v;
    });
  }
  changeCar(e) {
    this.carentPhoto = `url(${e})`;
  }
}
