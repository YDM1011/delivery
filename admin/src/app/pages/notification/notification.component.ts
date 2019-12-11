import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  public userAction = false;
  public globalAction = true;
  public userChoose = [];
  public inputChange;
  public searchUser = [];
  public notification = {
    title: '',
    description: '',
    notificationGlobal: true,
    client: []
  };
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
  }
  create(e) {
    e.preventDefault();
    if (!this.notification.title) {
      Swal.fire('Error', 'Укажите заголовок сообщения', 'error');
      return;
    }
    if (!this.globalAction) {
      if(this.userChoose.length === 0) {
        Swal.fire('Error', 'Выберите клиентов для уведомления', 'error');
        return;
      }
      this.notification.notificationGlobal = false;
    } else {
      this.notification.notificationGlobal = true;
      delete this.notification.client;
    }

    this.notification.title = this.notification.title.trim();
    this.notification.description =this.notification.description.trim();
    this.crud.post('customPush', this.notification).then((v: any) => {
      if (v) {
        Swal.fire('Success', 'Ваше уведомление отправленно', 'success');
        this.userChoose = [];
        this.notification = {
          title: '',
          description: '',
          notificationGlobal: true,
          client: []
        }
      }
    })
  }

  change() {
    const query = JSON.stringify({$or:[
        {login: {$regex: this.inputChange, $options: 'gi'}},
        {name: {$regex: this.inputChange, $options: 'gi'}}
      ], role: 'client'});
    this.crud.get(`client?query=${query}&select=["login", "name", "img"]&limit=10`).then((v: any) => {
      this.searchUser = v;
    });
  }

  removeUserChip(i) {
    this.userChoose.splice(i, 1);
    this.notification.client.splice(i, 1);
  }

  pushUser(i) {
    const index = this.crud.find('_id', i._id, this.userChoose);
    if (index === undefined) {
      this.userChoose.push(i);
      this.notification.client.push(i._id)
    }
    this.inputChange = '';
    this.searchUser = [];
  }
  changeTypeActionGlobal() {
    if (this.globalAction) {
      this.userAction = false;
      this.notification.client = [];
      this.userChoose = [];
    } else if (!this.userAction) {
      this.userAction = true;
    }
  }
  changeTypeActionUser() {
    if (this.userAction) {
      this.globalAction = false;
    } else if (!this.userAction) {
      this.globalAction = true;
      this.notification.client = [];
      this.userChoose = [];
    }
  }
}
