import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CrudService} from "../../crud.service";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import Swal from "sweetalert2";

@Component({
  selector: 'app-list-providers',
  templateUrl: './list-providers.component.html',
  styleUrls: ['./list-providers.component.scss']
})
export class ListProvidersComponent implements OnInit, AfterViewInit {
  public loaded = false;
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
  displayedColumns: string[] = ['Номер', 'Назва бренда', 'data', 'delete'];
  dataSource = new MatTableDataSource(this.list);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
      private crud: CrudService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.crud.get('client?query={"role": "provider"}').then((v: any) => {
      if (!v) {return; }
      this.list = v;
      this.dataSource = new MatTableDataSource(this.list);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.chackDataLength();
      this.loaded = true;
      this.crud.get('city').then((c: any) => {
        if (c) {
          this.city = c;
          this.company.city = this.city[0]._id;
        }
      });
    }).catch( e => console.log(e));
  }
  create(e) {
    e.preventDefault();
    const c = this.client;
    const comp = this.company;
    if (c.name === '' || c.pass === '' || c.login === '' || comp.address || comp.city || comp.address) {
      Swal.fire('Error', 'Все поля обязательны', 'error').then();
      return;
    }
    this.crud.post('signup', {client: this.client, company: this.company}).then((v: any) => {
      this.list.unshift(v);
      this.dataSource = new MatTableDataSource(this.list);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.chackDataLength();
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
  chackDataLength() {
    if (this.list.length > 0 ) {
      this.showPagin = true;
      return;
    }
    this.showPagin = false;
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
