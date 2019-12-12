import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-debtor',
  templateUrl: './debtor.component.html',
  styleUrls: ['./debtor.component.scss']
})
export class DebtorComponent implements OnInit {
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public loading: boolean = false;
  public inputChange: string;
  public userChoose: string;
  public mainCategory;
  public user;
  public defLang = 'ru-UA';
  public addShow = false;
  public editShow = false;
  public isBlok = false;
  public searchFilter = false;
  public searchDebtors = [];
  public debtors = [];
  public minDate = new Date();
  public editObjCopy;
  public tabIndex = 0;
  public searchDebtor = null;
  public dateStart = new Date();
  public dateEnd = new Date();
  public newStart;
  public newEnd;
  public indexEdit;
  public searchArr = [];
  public editObj = {
    clientOwner: '',
    companyOwner: '',
    basket: '',
    value: null,
    dataCall: '',
  };
  public debtor = {
    clientOwner: '',
    companyOwner: '',
    basket: null,
    value: '',
    dataCall: '',
  };

  public txt = {
    address: {ua:'',ru:'Адрес'},
    debs: {ua:'',ru:'Должник'},
    date: {ua:'',ru:'Отстрочка'},
    c: {ua:'',ru:'м.'},
    s: {ua:'',ru:'ул.'},
    b: {ua:'',ru:'дом'},
    d: {ua:'',ru:'кв.'}
  };

  public populate = '&populate=[{"path":"clientOwner"},{"path":"basket","populate":{"path":"deliveryAddress","populate":{"path":"city"}}}]';
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.dateStart.setDate(this.dateStart.getDate());
    this.crud.get('mainCategory').then((v: any) => {
      if (!v)  { return; }
      this.mainCategory = v;
    });
    this.auth.onMe.subscribe((v: any) => {
      if (!v) { return; }
      this.user = v;
      if (this.user && this.user.companyOwner) {
        this.getDebtors()
      }
    });
  }
  getDebtors() {
    this.newStart = new Date(this.dateStart.getMonth()+1+'.'+(this.dateStart.getDate()) +'.'+new Date().getFullYear()).getTime();
    this.newEnd = new Date(this.dateEnd.getMonth()+1+'.'+(this.dateEnd.getDate()+1) +'.'+new Date().getFullYear()).getTime()-1;
    // this.newStart = new Date(this.dateStart.getTime() - this.dateStart.getHours()*60*60*1000 - this.dateStart.getMinutes()*60*1000  - this.dateStart.getSeconds()*1000).getTime();
    // this.newEnd = new Date(this.dateEnd.getTime() - this.dateEnd.getHours()*60*60*1000 - this.dateEnd.getMinutes()*60*1000  - this.dateEnd.getSeconds()*1000).getTime();

    if (this.tabIndex === 0) {
      if (this.user.role === 'provider') {
        this.crud.get(`debtor/count?query={"companyOwner": "${this.user.companyOwner._id}","value":{"$gt":0},"date":{"$gte":"${this.newStart}","$lte":"${this.newEnd}"}}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
            this.crud.get(`debtor?query={"companyOwner": "${this.user.companyOwner._id}","value":{"$gt":0},"date":{"$gte":"${this.newStart}","$lte":"${this.newEnd}"}}${this.populate}&skip=0&limit=${this.pageSizePagination}&sort={"dataCall":-1}`).then((d: any) => {
              if (d) {
                this.debtors = d;
                this.loading = true;
              }
            });
          }
        });
      }
      if (this.user.role === 'collaborator') {
        this.crud.get(`basket?query={"companyOwner": "${this.user.companyOwner._id}","manager":"${this.user._id}","date":{"$gte":"${this.newStart}","$lte":"${this.newEnd}"}}`).then((d: any) => {
          if (d) {
            const arrDebs = [];
            d.forEach((item) => {
              arrDebs.push({basket: item._id});
            });
            const query = JSON.stringify({$and:[{$or:arrDebs,value:{$gt:0}}],date:{$gte:this.newStart,$lte:this.newEnd}});
            this.crud.get(`debtor/count?query=${query}`).then((count: any) => {
              if(count) {
                this.lengthPagination = count.count;
                this.crud.get(`debtor?query=${query}${this.populate}&skip=0&limit=${this.pageSizePagination}&sort={"dataCall":-1}`).then((d: any) => {
                  if(d) {
                    this.debtors = d;
                    this.loading = true;
                  }
                })
              }
            })
          }
        });
      }
    }
    if (this.tabIndex === 1) {
      if (this.user.role === 'provider') {
        this.crud.get(`debtor/count?query={"companyOwner": "${this.user.companyOwner._id}","value":0,"date":{"$gte":"${this.newStart}","$lte":"${this.newEnd}"}}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
            this.crud.get(`debtor?query={"companyOwner": "${this.user.companyOwner._id}","value":0,"date":{"$gte":"${this.newStart}","$lte":"${this.newEnd}"}}${this.populate}&skip=0&limit=${this.pageSizePagination}&sort={"dataCall":-1}`).then((d: any) => {
              if (d) {
                this.debtors = d;
                this.loading = true;
              }
            });
          }
        });
      }
      if (this.user.role === 'collaborator') {
        this.crud.get(`basket?query={"companyOwner": "${this.user.companyOwner._id}","manager":"${this.user._id}","date":{"$gte":"${this.newStart}","$lte":"${this.newEnd}"}}`).then((d: any) => {
          if (d) {
            const arrDebs = [];
            d.forEach((item) => {
              arrDebs.push({basket: item._id});
            });
            const query = JSON.stringify({$and:[{$or:arrDebs,value:0}],date:{$gte:this.newStart,$lte:this.newEnd}});
            this.crud.get(`debtor/count?query=${query}`).then((count: any) => {
              if(count) {
                this.lengthPagination = count.count;
                this.crud.get(`debtor?query=${query}${this.populate}&skip=0&limit=${this.pageSizePagination}&sort={"dataCall":-1}`).then((d: any) => {
                  if(d) {
                    this.debtors = d;
                    this.loading = true;
                  }
                })
              }
            })
          }
        });
      }
    }
  }
  searchDeb () {
    this.searchArr = [];
    if (this.searchDebtor) {
      this.crud.get(`debtorSearch/${this.searchDebtor}`).then((v: any) => {
        if (v && v.debtor) {
          this.searchArr.push(v);
          this.searchFilter = true;
          this.loading = true;
        }
      })
    } else {
      this.searchArr = [];
      this.searchFilter = false;
      this.getDebtors();
    }
  }
  paydFull() {
    this.crud.post('debtor', {value: 0}, this.editObjCopy._id).then((v: any) => {
      if (v) {
        this.editObj.value = 0;
        this.editObjCopy = v;
        this.debtors[this.indexEdit].value = 0;
      }
    })
  }
  change() {
    const query = JSON.stringify({login: {$regex: this.inputChange, $options: 'gi'}});
    this.crud.get(`client?query=${query}&select=["login","img"]&limit=10`).then((v: any) => {
      this.searchDebtors = v;
    });
  }
  create() {
    const index = this.crud.find('login', this.inputChange, this.searchDebtors);
    this.debtor.clientOwner = this.searchDebtors[index]._id;
    this.debtor.companyOwner = this.user.companyOwner._id;
    this.debtor['login'] = this.searchDebtors[index].login;
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
        this.crud.get(`debtor/count?query={"companyOwner":"${this.user.companyOwner._id}"}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
            this.crud.get(`debtor?query={"companyOwner":"${this.user.companyOwner._id}"}${this.populate}&skip=0&limit=${this.pageSizePagination}&sort={"dataCall":-1}`).then((d: any) => {
              if (d) {
                this.debtors = d;
              }
            });
          }
        });
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
        this.crud.get(`debtor/count?query={"companyOwner":"${this.user.companyOwner._id}"}`).then((count: any) => {
          if (!count) {return; }
          this.lengthPagination  = count.count;
        });
      }
    });
  }
  edit(i: any) {
    this.indexEdit = i;
    if (this.searchArr.length>0){
      this.editObj = Object.assign({}, i);
      this.editObjCopy = Object.assign({}, i);
    } else {
      this.editObj = Object.assign({}, this.debtors[i]);
      this.editObjCopy = Object.assign({}, this.debtors[i]);
    }
    this.addShow = false;
    this.editShow = true;
  }
  confirmEditCategoryCrud(e) {
    e.preventDefault();
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
        this.debtors[this.crud.find('_id', this.editObj['_id'], this.debtors)].value = this.editObj.value;
        this.debtors[this.crud.find('_id', this.editObj['_id'], this.debtors)].dataCall = this.editObj.dataCall;
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
  outputSearch(e) {
    if (!e) {
      this.crud.get(`debtor?query={"companyOwner": "${this.user.companyOwner._id}"}${this.populate}&skip=0&limit=${this.pageSizePagination}`).then((d: any) => {
        if (d) {
          this.debtors = d;
        }
      });
    } else {
      this.debtors = e;
    }
  }
  pageEvent(e) {
    if (this.tabIndex === 0) {
      if(this.user.role === 'provider'){
        this.crud.get(`debtor?query={"companyOwner":"${this.user.companyOwner._id}","value":{"$gt":0}}${this.populate}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}&sort={"dataCall":-1}`).then((d: any) => {
          if (!d) {return; }
          this.debtors = d;
        });
      }
      if (this.user.role === 'collaborator') {
        this.crud.get(`basket?query={"companyOwner": "${this.user.companyOwner._id}","manager":"${this.user._id}","date":{"$gte":"${this.newStart}","$lte":"${this.newEnd}"}}`).then((d: any) => {
          if (d) {
            const arrDebs = [];
            d.forEach((item) => {
              arrDebs.push({basket: item._id});
            });
            const query = JSON.stringify({$and:[{$or:arrDebs,value:{$gt:0}}],lastUpdate:{$gte:this.newStart,$lte:this.newEnd}});
            this.crud.get(`debtor/count?query=${query}`).then((count: any) => {
              if(count) {
                this.lengthPagination = count.count;
                this.crud.get(`debtor?query=${query}${this.populate}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}&sort={"dataCall":-1}`).then((d: any) => {
                  if(d) {
                    this.debtors = d;
                    this.loading = true;
                  }
                })
              }
            })
          }
        });
      }
    }
    if (this.tabIndex === 1) {
      if(this.user.role === 'provider'){
        this.crud.get(`debtor?query={"companyOwner":"${this.user.companyOwner._id}","value":0}${this.populate}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}&sort={"dataCall":-1}`).then((d: any) => {
          if (!d) {return; }
          this.debtors = d;
        });
      }
      if (this.user.role === 'collaborator') {
        this.crud.get(`basket?query={"companyOwner": "${this.user.companyOwner._id}","manager":"${this.user._id}","date":{"$gte":"${this.newStart}","$lte":"${this.newEnd}"}}`).then((d: any) => {
          if (d) {
            const arrDebs = [];
            d.forEach((item) => {
              arrDebs.push({basket: item._id});
            });
            const query = JSON.stringify({$and:[{$or:arrDebs,value:0}],lastUpdate:{$gte:this.newStart,$lte:this.newEnd}});
            this.crud.get(`debtor/count?query=${query}`).then((count: any) => {
              if(count) {
                this.lengthPagination = count.count;
                this.crud.get(`debtor?query=${query}${this.populate}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}&sort={"dataCall":-1}`).then((d: any) => {
                  if(d) {
                    this.debtors = d;
                    this.loading = true;
                  }
                })
              }
            })
          }
        });
      }
    }
  }
  tabChange(e) {
    this.loading = false;
    this.tabIndex = e;
    this.getDebtors();
  }
}
