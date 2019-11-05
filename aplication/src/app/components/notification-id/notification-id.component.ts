import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {MatSnackBar} from "@angular/material";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-notification-id',
  templateUrl: './notification-id.component.html',
  styleUrls: ['./notification-id.component.scss']
})
export class NotificationIdComponent implements OnInit {
  public id: string;
  public language: string;
  public data;
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
      private route: ActivatedRoute,
      private auth: AuthService,
      private crud: CrudService,
      private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.getRating(this.id);
    });
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }
  getRating(id) {
    this.crud.get(`rating?query={"_id":"${this.id}"}&populate={"path":"companyOwner","select":"name"}`).then((v: any) => {
      if (v) {
        this.data = Object.assign({}, v[0]);
      }
    })
  }
  confirm(e){
    e.preventDefault();
    if (!this.obj.rating) {
      this.openSnackBar(this.snackMessageError[this.language],  'Ok');
      return;
    }
    this.crud.post('rating', {rating: this.obj.rating, comment: this.obj.comment}, this.id).then((v: any) => {
      if (v) {
        this.openSnackBar(this.snackMessage[this.language],  'Ok');
        window.history.back();
      }
    })
  }
  close() {
    window.history.back();
  }
  updateRaiting(e) {
    this.obj.rating = e;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
