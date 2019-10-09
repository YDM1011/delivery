import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CrudService} from "../../crud.service";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import Swal from "sweetalert2";

@Component({
  selector: 'app-list-providers',
  templateUrl: './list-providers.component.html',
  styleUrls: ['./list-providers.component.scss']
})
export class ListProvidersComponent implements OnInit {
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public loading = false;
  public search;
  public defLang = 'ru-UA';
  public addShow = false;
  public showPagin = false;
  public list = [];
  public city = [];
  public client = {
    name: '',
    login: '',
    pass: '',
    role: 'provider',
  };
  public company = {
    name: '',
    city: '',
    address: '',
  };
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('client/count?query={"role": "provider"}').then((count: any) => {
      if (count) {
        this.lengthPagination = count.count;
        this.crud.get(`client?query={"role": "provider"}&skip=0&limit=${this.lengthPagination}`).then((v: any) => {
          if (!v) {return; }
          this.list = v;
          this.loading = true;
        });
      }
    });
    this.crud.get('city').then((c: any) => {
      if (c) {
        this.city = c;
        this.company.city = this.city[0]._id;
      }
    });
  }
  create(e) {
    e.preventDefault();
    const c = this.client;
    const comp = this.company;
    if ((!c || !comp) || (!c.name || !c.pass || !c.login || !comp.address || !comp.city || !comp.name)) {
      Swal.fire('Error', 'Все поля обязательны', 'error').then();
      return;
    }
    this.crud.post('signup', {client: this.client, company: this.company}).then((v: any) => {
      this.list.push(v);
      this.clearObj();
      this.addShow = false;
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
      role: 'provider',
    };
    this.company = {
      name: '',
      address: '',
      city: this.city[0]._id
    };
  }
  pageEvent(e) {
    this.crud.get(`client?query={"role": "provider"}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}`).then((l: any) => {
      if (!l) {
        return;
      }
      this.list = l;
    });
  }
}
