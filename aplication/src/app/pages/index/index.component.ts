import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {WS} from "../../websocket/websocket.events";
import {WebsocketService} from "../../websocket";
import {CrudService} from "../../crud.service";
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  public notification$: any;
  public language: string;
  public curentCity = {};
  public category = [];
  public brandy = [];
  public toggleMain: boolean = true;
  public images = [`./assets/images/tmp/img-deli.png`, `./assets/images/tmp/img-product.png`, `./assets/images/tmp/img-deli.png`];
  public carentPhoto;
  public number: number = 0;
  public loaded = {
    category: false,
    brand: false
  };
  constructor(
      private auth: AuthService,
      private wsService:WebsocketService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.auth.onCity.subscribe((v:any) => {
      if (v) {
        this.curentCity = v;
        this.init();
      }
    });
    this.carentPhoto = `url(${this.images[0]})`;

    // this.wsService.send(WS.SEND.NOTIFICATION, 'admin1',  { data: 'test sf' });
    this.notification$ = this.wsService.on(WS.ON.ON_NOTIFICATION);

    this.notification$.subscribe(v => {
      this.playAudio();
    });


  }

  playAudio() {
    const audio = new Audio();
    audio.src = '../../../assets/audio/alert.mp3';
    audio.load();
    audio.play();

  }

  async init() {
    await this.crud.getCategory(this.curentCity).then((v: any) => {
      if (!v) return;
      this.category = v;
      this.loaded.category = true;
    }).catch(e=> { this.loaded.category = true });
    await this.crud.getBrands().then((v: any) => {
      if (!v) return;
      this.brandy = v;
      this.loaded.brand = true
    }).catch(e=> { this.loaded.brand = true });
  }
  changeCar(e) {
    this.carentPhoto = `url(${e})`;
  }
}
