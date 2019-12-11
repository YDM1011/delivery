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
  public queryFilter = '"role":"client"';
  public clientEdit;
  public list = [];
  public newPass;
  public passErr;
  public filterShow = true;
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
    this.crud.post('signup', {name: this.client.name, login: '0'+this.client.login, pass: this.client.pass, role: this.client.role}).then((v: any) => {
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
  outputSearch(e) {
    if (!e) {
      this.crud.get(`client?query={"role": "client"}&skip=0&limit=${this.lengthPagination}`).then((v: any) => {
        if (!v) {return; }
        this.list = v;
        this.filterShow = true;
      });
    } else {
      this.list = e;
      this.filterShow = false;
    }
  }
  pageEvent(e) {
    this.crud.get(`client?query={"role": "client"}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}`).then((l: any) => {
      if (!l) {
        return;
      }
      this.list = l;
    });
  }
  saveClient(){
    console.log(this.clientEdit);
    this.crud.post('client',
      {name: this.clientEdit.name, mobile: this.clientEdit.mobile},
      this.clientEdit._id).then(v=>{
      this.clientEdit = ''
    })
  }
  savePass(){
    if (this.newPass.length < 6) {
      this.passErr = "Пароль менее 6 символов!";
      return
    }
    this.crud.post('changePass', {pass:this.newPass,_id:this.clientEdit._id}).then(v=>{
      if (v) {
        this.newPass = '';
      }
    }).catch(e=>{console.log(e)})
  }
  edit(data){
    this.clientEdit = data
  }
  close(){
    this.clientEdit = '';
  }
  banned(data){
    data.banned = !data.banned;
    this.crud.post('client', {banned:data.banned}, data._id, false).then(v=>{

    }).catch(e=>{console.log(e)})
  }
  verify(data){
    data.verify = !data.verify;
    this.crud.post('client', {verify:data.verify}, data._id, false).then(v=>{

    }).catch(e=>{console.log(e)})
  }
}
