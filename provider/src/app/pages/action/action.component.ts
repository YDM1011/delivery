import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  public productChoose: string;
  public user;
  public company;
  public defLang = 'ru-UA';
  public isBlok = false;
  public showPagin = false;
  public globalAction = true;
  public userAction = false;
  public addShow = false;
  public editShow = false;
  public userChoose = [];
  public actions = [];
  public products = [];
  public searchUser = [];
  public editObjCopy;
  public inputChange;
  public uploadObj;
  public editObj = {
    description: '',
    img: '',
    companyOwner: '',
    orderOwner: '',
    client: [],
    actionGlobal: true,
  };
  public action = {
    description: '',
    img: '',
    companyOwner: '',
    orderOwner: '',
    client: [],
    actionGlobal: true,
  };

  displayedColumns: string[] = ['Номер', 'Назва бренда', 'data', 'delete'];
  dataSource = new MatTableDataSource(this.actions);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) { return; }
      this.user = v;
      if (this.user.companies && this.user.companies[0]) {
        this.company = this.user.companies[0];
        if (this.company) {
          this.crud.get(`action?query={"companyOwner":"${this.company._id}"}&populate={"path":"client"}`).then((a: any) => {
            if (a && a.length > 0) {
              this.actions = a;
              this.dataSource = new MatTableDataSource(this.actions);
              setTimeout(() => this.dataSource.paginator = this.paginator);
              this.chackDataLength();
            }
          });
          this.crud.get(`order?query={"companyOwner":"${this.company._id}"}`).then((p: any) => {
            if (p && p.length > 0) {
              this.products = p;
              this.productChoose = this.products[0]._id;
            }
          });
        }
      }
    });
  }
  removeUserChip(i) {
    this.userChoose.splice(i, 1);
  }
  pushUser(i) {
    const index = this.crud.find('_id', i._id, this.userChoose);
    if (index === undefined) {
      this.userChoose.push(i);
    }
    this.inputChange = '';
    this.searchUser = [];
  }
  change() {
    const query = JSON.stringify({login: {$regex: this.inputChange, $options: 'gi'}});
    this.crud.get(`client?query=${query}`).then((v: any) => {
      this.searchUser = v;
    });
  }
  create(e) {
    e.preventDefault();
    this.action.orderOwner = this.productChoose;
    this.action.companyOwner = this.company._id;
    if (!this.action.description) {
      Swal.fire('Error', 'Описание акции не может быть пустым', 'error');
      return;
    }
    if (!this.action.img) {
      Swal.fire('Error', 'Додайте картинку', 'error');
      return;
    }
    if (!this.action.orderOwner) {
      Swal.fire('Error', 'Выберете к каком продукту относится акция', 'error');
      return;
    }
    if (!this.globalAction) {
      this.action.actionGlobal = false;
      this.action.client = this.userChoose;
    }
    this.crud.post('upload2', {body : this.uploadObj}, null, false).then((u: any) => {
      if (u) {
        this.action.img = u.file;
        this.crud.post('action', this.action).then((v: any) => {
          if (v) {
            this.actions.push(v);
            this.user.companies[0].categories = this.actions;
            this.dataSource = new MatTableDataSource(this.actions);
            setTimeout(() => this.dataSource.paginator = this.paginator);
            this.chackDataLength();
            this.crud.post('company', {$push: {action: v._id}}, this.user.companies[0]._id, false).then();
            this.action = {
              description: '',
              img: '',
              companyOwner: '',
              orderOwner: '',
              client: [],
              actionGlobal: true,
            };
            this.productChoose = null;
            this.addShow = false;
          }
        });
      }
    });
  }

  delete(i) {
    this.crud.delete('action', this.actions[i]._id).then((v: any) => {
      if (v) {
        this.actions.splice(i, 1);
        this.dataSource = new MatTableDataSource(this.actions);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
      }
    });
  }
  edit(i) {
    this.editObj = Object.assign({}, this.actions[i]);
    this.editObjCopy = Object.assign({}, this.actions[i]);
    this.productChoose = this.editObj.orderOwner;
    this.userChoose = this.editObj.client;
    this.addShow = false;
    this.editShow = true;
    console.log(this.editObj);
  }
  confirmEditCategoryCrud(e) {
    e.preventDefault();
    if (!this.editObj.description) {
      Swal.fire('Error', 'Описание акции не может быть пустым', 'error');
      return;
    }
    if (!this.editObj.img) {
      Swal.fire('Error', 'Додайте картинку', 'error');
      return;
    }
    if (!this.editObj.orderOwner) {
      Swal.fire('Error', 'Выберете к каком продукту относится акция', 'error');
      return;
    }
    this.editObj.orderOwner = this.productChoose;
    this.crud.post('action', this.editObj, this.editObj['_id']).then((v: any) => {
      if (v) {
        this.editShow = false;
        this.actions[this.crud.find('_id', this.editObj['_id'], this.actions)] = v;
        this.user.companies[0].action = this.actions;
        this.auth.setMe(this.user);
        this.dataSource = new MatTableDataSource(this.actions);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
        this.isBlok = false;
        this.editShow = false;
        this.editObj = {
          description: '',
          img: '',
          companyOwner: '',
          orderOwner: '',
          client: [],
          actionGlobal: true,
        };
      }
    });
  }
  selectValid() {
    if (this.editObjCopy.orderOwner !== this.productChoose) {
      return this.btnBlok(true);
    }
    return this.btnBlok(false);
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
  onFsEdit(e) {
    this.uploadObj = e;
    this.editObj.img = e.name;
    this.formCheck();
  }
  onFs(e) {
    this.uploadObj = e;
    this.action.img = e.name;
  }
  formCheck() {
    this.btnBlok(this.validate());
    if (this.editObj.client.length !== this.editObjCopy.client.length) {
      this.btnBlok(true);
    }
  }
  openAdd() {
    this.addShow = true;
    this.editShow = false;
  }
  cancelAdd() {
    this.addShow = false;
    if (this.products.length > 0) {
      this.productChoose = this.products[0]._id;
    }
    this.action = {
      description: '',
      img: '',
      companyOwner: '',
      orderOwner: '',
      client: [],
      actionGlobal: true,
    };
  }
  cancelEdit() {
    this.editShow = false;
    this.isBlok = false;
    this.inputChange = '';
    this.userChoose = [];
    this.editObj = {
      description: '',
      img: '',
      companyOwner: '',
      orderOwner: '',
      client: [],
      actionGlobal: true
    };
  }

  chackDataLength() {
    if (!this.actions || this.actions.length === 0) {
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

  changeTypeActionGlobal() {
    if (this.globalAction) {
      this.userAction = false;
    } else if (!this.userAction) {
      this.userAction = true;
    }
  }
  changeTypeActionUser() {
    if (this.userAction) {
      this.globalAction = false;
    } else if (!this.userAction) {
      this.globalAction = true;
    }
  }
}
