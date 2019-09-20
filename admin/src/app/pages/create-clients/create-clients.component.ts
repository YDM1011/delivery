import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-create-clients',
  templateUrl: './create-clients.component.html',
  styleUrls: ['./create-clients.component.scss']
})
export class CreateClientsComponent implements OnInit {
  public showClient: boolean = false;
  public showProvider: boolean = false;
  public client = {
    name: '',
    login: '',
    pass: '',
    role: '',
    verify: true
  };
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
  }
  create(role) {
    const e = this.client;
    if (e.name === '' || e.pass === '' || e.login === '') {
      Swal.fire('Error', 'Все поля обязательны', 'error');
      return;
    }
    this.client['role'] = role;
    this.crud.post('client', this.client).then((v: any) => {
      if (v) {
        this.clearObj();
        this.showClient = false;
        this.showProvider = false;
      }
    });
  }
  createClient() {
    this.showClient = true;
    this.showProvider = false;
    this.clearObj();
  }
  createProvider() {
    this.showClient = false;
    this.showProvider = true;
    this.clearObj();
  }
  clearObj() {
    this.client = {
      name: '',
      login: '',
      pass: '',
      role: '',
      verify: true
    };
  }
}
