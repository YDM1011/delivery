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
  public toggleMain: boolean = true;
  constructor(
      private auth: AuthService,
      private wsService:WebsocketService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    // this.wsService.send(WS.SEND.NOTIFICATION, 'admin',  { data: 'test sf' });
    this.notification$ = this.wsService.on(WS.ON.ON_NOTIFICATION);

    this.notification$.subscribe(v => {
      this.playAudio();
    });

    this.crud.get('category')
  }

  playAudio() {
    const audio = new Audio();
    audio.src = '../../../assets/audio/alert.mp3';
    audio.load();
    audio.play();
  }
  // mySlideImages = [1,2,3].map((i)=> `./assets/images/tmp/img-deli.png`);
  // mySlideOptions={items: 1, dots: false, nav: false, autoplay: true};
}
