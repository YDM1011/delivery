import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-raiting',
  templateUrl: './raiting.component.html',
  styleUrls: ['./raiting.component.scss']
})
export class RaitingComponent implements OnInit {
  public language: string;
  public comment: string = '';
  public raiting;
  @Output() closeRaiting = new EventEmitter();
  constructor(
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }
  close() {
    this.closeRaiting.emit(false);
  }
  updateRaiting(e) {
    console.log(e);
    this.raiting = e;
  }
}
