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
  public defLang = 'ru-UA';
  public clients = [];
  public editObj = {
    _id: '',
    name: '',
    login: '',
    pass: '',
    role: '',
    companyOwner: ''
  };
  public client = {
    name: '',
    login: '',
    pass: '',
    role: '',
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
  create(role) {
    const e = this.client;
    if (e.name === '' || e.pass === '' || e.login === '') {
      Swal.fire('Error', 'Все поля обязательны', 'error').then();
      return;
    }
    this.client.role = role;
    this.crud.post('signup', this.client, null, true).then((v: any) => {
      if (!v) {return; }
      this.clients.push(v);
      this.crud.post(`company?query={"_id": ${this.user.companies[0]._id}`, {collaborators: this.clients}, this.user.companies[0]._id).then(()=>{
      })
      this.clearObj();
      this.showCollaborator = false;
    }).catch((error) => {
      if (error && error.error === 'User with this login created') {
        Swal.fire('Error', 'Номер телефона уже используется', 'error').then();
      }
    });
  }
  confirmEditCategoryCrud() {
    if (this.editObj.name === '') {
      Swal.fire('Error', 'Название категории не может быть пустым', 'error').then();
      return;
    }
    this.editObj.companyOwner = this.user.companies[0]._id;
    this.crud.post('category', {name: this.editObj.name}, this.editObj._id).then((v: any) => {
      if (v) {
        this.editShow = false;
        this.clients[this.crud.find('_id', this.editObj._id, this.clients)] = v;
        this.dataSource = new MatTableDataSource(this.clients);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.checkDataLength();
        this.editObj = {
          _id: '',
          name: '',
          login: '',
          pass: '',
          role: '',
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
  clearObj() {
    this.client = {
      name: '',
      login: '',
      pass: '',
      role: '',
      companyOwner: ''
    };
  }
  cancelEdit() {
    this.editShow = false;
    this.editObj = {
      _id: '',
      name: '',
      login: '',
      pass: '',
      role: '',
      companyOwner: ''
    };
  }

  checkDataLength() {
    if (!this.clients || this.clients.length === 0) {
      this.showPagin = false;
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
