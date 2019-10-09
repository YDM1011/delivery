import {Component, OnInit} from '@angular/core';
import {CrudService} from "../../crud.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss']
})
export class ListClientsComponent implements OnInit {
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public loading = false;
  public search;
  public defLang = 'ru-UA';
  public addShow = false;
  public showPagin = false;
  public list = [];
  public client = {
    name: '',
    login: '',
    pass: '',
    role: 'client',
  };
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('client/count?query={"role": "client"}').then((count: any) => {
      if (count) {
        this.lengthPagination = count.count;
        this.crud.get('client?query={"role": "client"}').then((v: any) => {
          if (!v) {return; }
          this.list = v;
          this.loading = true;
        });
      }
    });
  }
  create(e) {
    e.preventDefault();
    const c = this.client;
    if (c.name === '' || c.pass === '' || c.login === '') {
      Swal.fire('Error', 'Все поля обязательны', 'error').then();
      return;
    }
    this.crud.post('signup', this.client).then((v: any) => {
      this.clearObj();
      this.addShow = false;
      this.list.push(v);
    }).catch((error) => {
      if (error && error.error === 'User with this login created') {
        Swal.fire('Error', 'Номер телефона уже используется', 'error').then();
      }
    });
  }
  openAdd() {
    this.addShow = true;
  }
  cancelAdd() {
    this.addShow = false;
    this.clearObj();
  }
  clearObj() {
    this.client = {
      name: '',
      login: '',
      pass: '',
      role: 'client',
    };
  }

  pageEvent(e) {
    this.crud.get(`client?query={"role": "client"}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}`).then((l: any) => {
      if (!l) {
        return;
      }
      this.list = l;
    });
  }
}
