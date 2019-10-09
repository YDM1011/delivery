import {Component, OnInit} from '@angular/core';
import {CrudService} from "../../crud.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-list-admins',
  templateUrl: './list-admins.component.html',
  styleUrls: ['./list-admins.component.scss']
})
export class ListAdminsComponent implements OnInit {
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
    role: 'admin',
  };
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get(`client/count?query={"role": "admin"}`).then((count: any) => {
      if (count) {
        this.lengthPagination = count.count;
        this.crud.get(`client?query={"role": "admin"}&skip=0&limit=${this.lengthPagination}`).then((v: any) => {
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
      this.list.push(v);
      this.clearObj();
      this.addShow = false;
    }).catch((error) => {
      if (error && error.error === 'User with this login created') {
        Swal.fire('Error', 'Номер телефона уже используется', 'error').then();
      }
    });
  }
  delete(i) {
   const id = this.list[i]._id;
   this.crud.delete('client', id).then((v: any) => {
     if (v) {
       this.list.splice(i, 1);
       this.crud.get('client/count?query={"role": "admin"}').then((count: any) => {
         if (count) {
           this.lengthPagination = count.count;
         }
       });
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
      role: 'admin',
    };
  }

  pageEvent(e) {
    this.crud.get(`client?query={"role": "admin"}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}`).then((l: any) => {
      if (!l) {
        return;
      }
      this.list = l;
    });
  }
}
