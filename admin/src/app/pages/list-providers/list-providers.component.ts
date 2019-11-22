import {Component, OnInit} from '@angular/core';
import {CrudService} from "../../crud.service";
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
    this.crud.get('company/count').then((count: any) => {
      if (count) {
        this.lengthPagination = count.count;
        this.crud.get(`company?query={}&skip=0&limit=${this.lengthPagination}&sort={"payedAt":-1}`).then((v: any) => {
          if (!v) {return; }
          this.list = v;
          this.loading = true;
        });
      }
    });
    this.crud.get('city').then((c: any) => {
      if (c && c.length > 0) {
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
    this.crud.post('signup', {client: {name: this.client.name, login:'0'+this.client.login, pass: this.client.pass, role: this.client.role}, company: this.company}).then((v: any) => {
      if (v) {
        this.crud.get('company/count').then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
            this.crud.get(`company?query={}&skip=0&limit=${this.lengthPagination}&sort={"date":-1}`).then((v: any) => {
              if (!v) {return; }
              this.list = v;
            });
          }
        });
        this.addShow = false;
        this.clearObj();
      }
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
  outputSearch(e) {
    if (!e) {
      this.crud.get(`company?query={}&skip=0&limit=${this.lengthPagination}&sort={"date":-1}`).then((v: any) => {
        if (!v) {return; }
        this.list = v;
      });
    } else {
      this.list = e;
    }
  }
  verifyCompany($event, e, id, index) {
    $event.preventDefault();
    console.log($event)
    this.crud.post(`company`, {verify: e, img: this.list[index].img}, id).then((v: any) => {
      if (v) {
        this.list[index].verify = v.verify;
      }
    });
    return false
  }
  pageEvent(e) {
    this.crud.get(`company?query={}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}&sort={"date":-1}`).then((l: any) => {
      if (!l) {
        return;
      }
      this.list = l;
    });
  }
}
