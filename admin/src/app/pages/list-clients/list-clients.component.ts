import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CrudService} from "../../crud.service";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import Swal from "sweetalert2";

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss']
})
export class ListClientsComponent implements OnInit, AfterViewInit {
  public loaded = false;
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
    this.crud.get('client?query={"role": "client"}').then((v: any) => {
      if (!v) {return; }
      this.list = v;
      this.dataSource = new MatTableDataSource(this.list);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.chackDataLength();
      this.loaded = true;
    }).catch( e => console.log(e));
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
      this.list.unshift(v);
      this.dataSource = new MatTableDataSource(this.list);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.chackDataLength();
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
    } else {
      this.showPagin = false;
    }
  }
  clearObj() {
    this.client = {
      name: '',
      login: '',
      pass: '',
      role: 'client',
    };
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
