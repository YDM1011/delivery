import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-debtor',
  templateUrl: './debtor.component.html',
  styleUrls: ['./debtor.component.scss']
})
export class DebtorComponent implements OnInit {
  public inputChange: string;
  public userChoose: string;
  public mainCategory;
  public user;
  public defLang = 'ru-UA';
  public showPagin = false;
  public addShow = false;
  public editShow = false;
  public isBlok = false;
  public searchDebtors = [];
  public debtors = [];
  public minDate = new Date();
  public editObjCopy;
  public editObj = {
    clientOwner: '',
    companyOwner: '',
    basket: '',
    value: '',
    dataCall: '',
  };
  public debtor = {
    clientOwner: '',
    companyOwner: '',
    basket: '',
    value: '',
    dataCall: '',
  };

  displayedColumns: string[] = ['Номер', 'Назва бренда', 'data', 'price', 'delete'];
  dataSource = new MatTableDataSource(this.debtors);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.crud.get('mainCategory').then((v: any) => {
      if (!v)  { return; }
      this.mainCategory = v;
    });
    this.auth.onMe.subscribe((v: any) => {
      if (!v) { return; }
      this.user = v;
      this.crud.get(`debtor?query={"companyOwner": "${this.user.companies[0]._id}"}&populate={"path":"clientOwner"}`).then((d: any) => {
        this.debtors = d;
        this.dataSource = new MatTableDataSource(this.debtors);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
      });
    });
  }
  change() {
    const query = JSON.stringify({login: this.inputChange});
    this.crud.get(`client?query=${query}`).then((v: any) => {
      this.searchDebtors = v;
    });
  }
  create() {
    const index = this.crud.find('login', this.inputChange, this.searchDebtors);
    this.debtor.clientOwner = this.searchDebtors[index]._id;
    this.debtor.companyOwner = this.user.companies[0]._id;
    if (this.debtor.clientOwner === '') {
      Swal.fire('Error', 'Выберете должника по номеру телефона', 'error');
      return;
    }
    if (this.debtor.value === '') {
      Swal.fire('Error', 'Выберете cумму долга', 'error');
      return;
    }
    if (this.debtor.dataCall === '') {
      Swal.fire('Error', 'Выберете дату возврата долга', 'error');
      return;
    }
    this.crud.post('debtor', this.debtor).then((v: any) => {
      if (v) {
        this.debtors.push(v);
        this.crud.post('company', {$push: {debtors: v._id}}, this.user.companies[0]._id, false).then();
        this.dataSource = new MatTableDataSource(this.debtors);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
        this.inputChange = null;
        this.addShow = false;
        this.debtor = {
          clientOwner: '',
          companyOwner: '',
          basket: '',
          value: '',
          dataCall: '',
        };
      }
    });
  }

  delete(i) {
    this.crud.delete('debtor', this.debtors[i]._id).then((v: any) => {
      if (v) {
        this.debtors.splice(i, 1);
        this.user.companies[0].debtors = this.debtors;
        this.auth.setMe(this.user);
        this.dataSource = new MatTableDataSource(this.debtors);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
      }
    });
  }
  edit(i) {
    this.editObj = Object.assign({}, this.debtors[i]);
    this.editObjCopy = Object.assign({}, this.debtors[i]);
    this.addShow = false;
    this.editShow = true;
  }
  confirmEditCategoryCrud() {
    if (this.editObj.value === '') {
      Swal.fire('Error', 'Введите cумму долга', 'error');
      return;
    }
    if (this.editObj.dataCall === '') {
      Swal.fire('Error', 'Выберете дату возврата долга', 'error');
      return;
    }
    this.crud.post('debtor', {value: this.editObj.value, dataCall: this.editObj.dataCall}, this.editObj['_id']).then((v: any) => {
      if (v) {
        const newObj = v;
        newObj.client = this.user;
        this.debtors[this.crud.find('_id', this.editObj['_id'], this.debtors)] = newObj;
        this.user.companies[0].debtors = this.debtors;
        this.auth.setMe(this.user);
        this.dataSource = new MatTableDataSource(this.debtors);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
        this.editShow = false;
        this.isBlok = false;
        this.editObj = {
          clientOwner: '',
          companyOwner: '',
          basket: '',
          value: '',
          dataCall: '',
        };
      }
    });
  }
  openAdd() {
    this.addShow = true;
    this.editShow = false;
  }
  cancelAdd() {
    this.addShow = false;
    this.userChoose = this.mainCategory[0]._id;
    this.debtor = {
      clientOwner: '',
      companyOwner: '',
      basket: '',
      value: '',
      dataCall: '',
    };
  }
  cancelEdit() {
    this.editShow = false;
    this.isBlok = false;
    this.editObj = {
      clientOwner: '',
      companyOwner: '',
      basket: '',
      value: '',
      dataCall: '',
    };
  }
  validate() {
    let isTrue = false;
    for (const key in this.editObj) {
      if (this.editObj[key].toString() !== this.editObjCopy[key].toString()) {isTrue = true; }
    }
    return isTrue;
  }

  btnBlok(is) {
    this.isBlok = is;
  }

  formCheck() {
    this.btnBlok(this.validate());
  }

  chackDataLength() {
    if (!this.debtors || this.debtors.length === 0) {
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
