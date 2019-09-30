import { Component, OnInit } from '@angular/core';
import {CrudService} from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-clients',
  templateUrl: './create-clients.component.html',
  styleUrls: ['./create-clients.component.scss']
})
export class CreateClientsComponent implements OnInit {
  public showClient = false;
  public showProvider = false;
  public showAdmin = false;
  public client = {
    name: '',
    login: '',
    pass: '',
    role: '',
  };
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
  }
  create(role) {
    const e = this.client;
    if (e.name === '' || e.pass === '' || e.login === '') {
      Swal.fire('Error', 'Все поля обязательны', 'error').then();
      return;
    }
    this.client.role = role;
    this.crud.post('signup', this.client).then(() => {
      this.clearObj();
      this.showClient = false;
      this.showProvider = false;
      this.showAdmin = false;
    }).catch((error) => {
      if (error && error.error === 'User with this login created') {
        Swal.fire('Error', 'Номер телефона уже используется', 'error').then();
      }
    });
  }

  createClient() {
    this.showClient = true;
    this.showProvider = false;
    this.showAdmin = false;
    this.clearObj();
  }
  createProvider() {
    this.showClient = false;
    this.showProvider = true;
    this.showAdmin = false;

    this.clearObj();
  }
  createAdmin() {
    this.showAdmin = true;
    this.showClient = false;
    this.showProvider = false;
    this.clearObj();
  }
  clearObj() {
    this.client = {
      name: '',
      login: '',
      pass: '',
      role: '',
    };
  }
}
