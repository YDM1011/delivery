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
  public cityAction = false;
  public globalAction = true;
  public userChoose = [];
  public inputChange;
  public city=[];
  public searchUser = [];
  public notification = {
    title: '',
    description: '',
    notificationGlobal: true,
    client: [],
    city: ''
  };
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('city').then((c: any) => {
      if (c && c.length > 0) {
        this.city = c;
      }
    });
  }
  create(e) {
    e.preventDefault();
    if (!this.notification.title) {
      Swal.fire('Error', 'Укажите заголовок сообщения', 'error');
      return;
    }
    if (!this.globalAction) {
      if(this.userChoose.length === 0 && !this.notification.city) {
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
          client: [],
          city:''
        };
        this.globalAction = true;
        this.userAction = false;
        this.cityAction = false;
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
  setCityFiltr(id){
    this.notification.city = id
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
      this.cityAction = false;
      this.notification.client = [];
      this.notification.city = '';
      this.userChoose = [];
    } else if (!this.cityAction) {
      this.cityAction = true;
    }
  }
  changeTypeActionCity() {
    if (this.cityAction) {
      this.userAction = false;
      this.globalAction = false;
      this.notification.client = [];
      this.userChoose = [];
    } else if (!this.userAction) {
      this.userAction = true;
      this.notification.city = '';
    }
  }
  changeTypeActionUser() {
    if (this.userAction) {
      this.globalAction = false;
      this.cityAction = false;
    } else if (!this.globalAction) {
      this.globalAction = true;
      this.notification.client = [];
      this.notification.city = '';
      this.userChoose = [];
    }
  }
}
