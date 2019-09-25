import { Component, OnInit } from '@angular/core';
import {CrudService} from '../../../../../admin/src/app/crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  public showCollaborator = false;
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
    this.client.role = role;
    this.crud.post('signup', this.client).then((v: any) => {
      this.clearObj();
      this.showCollaborator = false;
    });
  }
  createCollaborator() {
    this.showCollaborator = true;
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
