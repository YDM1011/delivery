import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from "../../crud.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-raiting',
  templateUrl: './raiting.component.html',
  styleUrls: ['./raiting.component.scss']
})
export class RaitingComponent implements OnInit {
  @Input() data;
  public language: string;
  public comment: string = '';
  public rating;
  public obj = {
    rating: null,
    comment: ''
  };
  @Output() closeRaiting = new EventEmitter();
  public snackMessage = {
    ru: 'Спасибо за оценку',
    ua: 'Cпасибі за оцінку'
  };
  public snackMessageError = {
    ru: 'Укажите свою оценку',
    ua: 'Вкажіть свою оцінку'
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }
  confirm(e){
    e.preventDefault();
    this.obj = {
      rating: this.rating,
      comment: this.comment
    };
    if (!this.obj.rating) {
      this.openSnackBar(this.snackMessageError[this.language],  'Ok');
      return;
    }
    this.openSnackBar(this.snackMessage[this.language],  'Ok');
    this.closeRaiting.emit(false);
    // this.crud.post('api', {}).then((v: any) => {
    //   if (v) {
    //     this.openSnackBar(this.snackMessage[this.language],  'Ok');
    //     this.closeRaiting.emit(false);
    //   }
    // })
  }
  close() {
    this.closeRaiting.emit(false);
  }
  updateRaiting(e) {
    this.rating = e;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
