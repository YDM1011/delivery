import { Component, OnInit } from '@angular/core';
import {WebsocketService} from "../../websocket";
import {WS} from "../../websocket/websocket.events";

@Component({
  selector: 'app-ws-layout',
  templateUrl: './ws-layout.component.html',
  styleUrls: ['./ws-layout.component.scss']
})
export class WsLayoutComponent implements OnInit {

  public notification$:any;
  constructor(
    private wsService:WebsocketService
  ) { }

  ngOnInit() {
    // this.notification$ = this.wsService.on(WS.ON.ON_NOTIFICATION);
    //
    // this.notification$.subscribe(v => {
    //   this.playAudio();
    // });
    this.wsService.send(WS.SEND.NOTIFICATION, 'admin',  { data: 'test sf' });
  }
  playAudio() {
    const audio = new Audio();
    audio.src = '../../../assets/audio/alert.mp3';
    audio.load();
    audio.play();
  }

}
