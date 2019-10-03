import {Component, OnInit, ViewChild} from '@angular/core';
import Swal from 'sweetalert2';
import {AuthService} from '../../auth.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  public showCollaborator = false;
  public user;
  public showPagin = false;
  public editShow = false;
  public isBlok = false;
  public defLang = 'ru-UA';
  public clients = [];
  public editObjCopy;
  public editObj = {
    _id: '',
    name: '',
    login: '',
    pass: '',
    companyOwner: ''
  };
  public client = {
    name: '',
    login: '',
    pass: '',
    companyOwner: ''
  };

  displayedColumns: string[] = ['Номер', 'Назва бренда', 'data', 'delete'];
  dataSource = new MatTableDataSource(this.clients);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) {return; }
      this.user = v;
      this.clients = this.user.companies[0].collaborators;
      this.dataSource = new MatTableDataSource(this.clients);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.checkDataLength();
    });
  }
  create(e) {
    e.preventDefault();
    const с = this.client;
    if (с.name === '' || с.pass === '' || с.login === '') {
      Swal.fire('Error', 'Все поля обязательны', 'error').then();
      return;
    }
    this.client.companyOwner = this.user.companies[0]._id;
    this.crud.post('signup', this.client).then((v: any) => {
      if (!v) {return; }
      this.clients.unshift(v);
      this.dataSource = new MatTableDataSource(this.clients);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.checkDataLength();
      this.clearObj();
      this.showCollaborator = false;
    }).catch((error) => {
      if (error && error.error === 'User with this login created') {
        Swal.fire('Error', 'Номер телефона уже используется', 'error').then();
      }
    });
  }
  confirmEditCategoryCrud(e) {
    e.preventDefault();
    if (this.editObj.name === '') {
      Swal.fire('Error', 'Название категории не может быть пустым', 'error').then();
      return;
    }
    this.editObj.companyOwner = this.user.companies[0]._id;
    this.crud.post('client', {name: this.editObj.name}, this.editObj._id).then((v: any) => {
      if (v) {
        this.editShow = false;
        this.clients[this.crud.find('_id', this.editObj._id, this.clients)] = v;
        this.editObj = {
          _id: '',
          name: '',
          login: '',
          pass: '',
          companyOwner: ''
        };
        this.editShow = false;
      }
    });
  }
  createCollaborator() {
    this.showCollaborator = true;
    this.clearObj();
  }
  edit(i) {
    this.editObj = Object.assign({}, this.clients[i]);
    this.editObjCopy = Object.assign({}, this.clients[i]);
    this.editShow = true;
    this.showCollaborator = false;
  }
  delete(i) {
    this.crud.delete('client', this.clients[i]._id).then((v: any) => {
      if (v) {
        this.clients.splice(i, 1);
      }
    });
  }
  clearObj() {
    this.client = {
      name: '',
      login: '',
      pass: '',
      companyOwner: ''
    };
  }
  cancelAdd() {
    this.showCollaborator = false;
    this.client = {
      name: '',
      login: '',
      pass: '',
      companyOwner: ''
    };
  }

  validate() {
    let isTrue = false;
    for (const key in this.editObj) {
      if (this.editObj[key] !== this.editObjCopy[key]) {isTrue = true; }
    }
    return isTrue;
  }

  btnBlok(is) {
    this.isBlok = is;
  }

  formCheck() {
    this.btnBlok(this.validate());
  }
  checkDataLength() {
    if (!this.clients || this.clients.length === 0) {
      this.showPagin = false;
      return;
    }
    this.showPagin = true;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
