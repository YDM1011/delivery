import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  public date = new Date();
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public productChoose: string;
  public user;
  public company;
  public defLang = 'ru-UA';
  public isBlok = false;
  public loading = false;
  public globalAction = true;
  public actionForProduct = false;
  public userAction = false;
  public addShow = false;
  public editShow = false;
  public access = true;
  public userChoose = [];
  public actions = [];
  public products = [];
  public searchUser = [];
  public editObjCopy;
  public inputChange;
  public uploadObj;
  public indexTab:number;
  public editObj = {
    name: '',
    description: '',
    img: '',
    companyOwner: '',
    orderOwner: '',
    client: [],
    actionGlobal: true,
    dateStart: new Date(),
    dateEnd: new Date()
  };
  public action = {
    name: '',
    description: '',
    img: '',
    companyOwner: '',
    orderOwner: '',
    client: [],
    actionGlobal: true,
    dateEnd: new Date(),
    dateStart: new Date(),
  };

  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) { return; }
      this.user = v;
      if (this.user && this.user.companyOwner) {
        this.company = this.user.companyOwner._id;
        this.crud.get(`order?query={"companyOwner":"${this.company}"}`).then((p: any) => {
          if (p && p.length > 0) {
            this.products = p;
            this.productChoose = this.products[0]._id;
          }
        });
        // const date = new Date(new Date().getTime() - new Date().getHours()*60*60*1000 - new Date().getMinutes()*60*1000  - new Date().getSeconds()*1000).getTime();
        const date = new Date(new Date(new Date().getMonth()+1+'.'+(new Date().getDate()) +'.'+new Date().getFullYear()).getTime());

        this.crud.get(`action/count?query={"companyOwner":"${this.company}","dateEnd":{"$gte":"${date}"}}`).then((c: any) => {
          if (c) {
            this.lengthPagination = c.count;
            this.crud.get(`action?query={"companyOwner":"${this.company}","dateEnd":{"$gte":"${date}"}}&populate={"path":"client"}&skip=0&limit=${this.pageSizePagination}&sort={"date":-1}`).then((a: any) => {
              if (a) {
                this.actions = a;
                this.loading = true;
                this.checkAccess();
              }
            });
          }
        });
      }
    });
  }
  checkAccess(){
    const date = new Date();
    if (this.actions[0] && new Date(this.actions[0].date).getDate() === date.getDate()) {
      this.access = false;
      return;
    }
    this.access = true;
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
    const query = JSON.stringify({$or:[
      {login: {$regex: this.inputChange, $options: 'gi'}},
      {name: {$regex: this.inputChange, $options: 'gi'}}
      ]});
    this.crud.get(`client?query=${query}&select=["login", "img", "name"]&limit=10`).then((v: any) => {
      this.searchUser = v;
    });
  }
  create(e) {
    e.preventDefault();
    this.action.companyOwner = this.company;
    if (!this.action.description) {
      Swal.fire('Error', 'Описание акции не может быть пустым', 'error');
      return;
    }
    if (!this.action.img) {
      Swal.fire('Error', 'Додайте картинку', 'error');
      return;
    }
    if (this.actionForProduct) {
      this.action.orderOwner = this.productChoose;
    } else {
      delete this.action.orderOwner;
    }
    if (!this.globalAction) {
      this.action.actionGlobal = false;
      this.action.client = this.userChoose;
    }
    this.action.name =this.action.name.trim();
    this.crud.post('action', this.action).then((v: any) => {
      if (v) {
        this.actions.unshift(v);
        this.user.companies[0].categories = this.actions;
        this.crud.get(`action/count?query={"companyOwner":"${this.company}"}`).then((c: any) => {
          if (c.count > 0) {
            this.lengthPagination = c.count;
          }
        });
        this.action = {
          name: '',
          description: '',
          img: '',
          companyOwner: '',
          orderOwner: '',
          client: [],
          actionGlobal: true,
          dateStart: new Date(),
          dateEnd: new Date(),
        };
        this.productChoose = null;
        this.addShow = false;
      }
    });
  }

  delete(i) {
    this.crud.delete('action', this.actions[i]._id).then((v: any) => {
      if (v) {
        this.actions.splice(i, 1);
        this.crud.get(`action/count?query={"companyOwner":"${this.company}"}`).then((c: any) => {
          if (c.count > 0) {
            this.lengthPagination = c.count;
          }
        });
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
    this.editObj.name =this.editObj.name.trim();
    this.editObj.orderOwner = this.productChoose;
    this.crud.post('action', this.editObj, this.editObj['_id']).then((v: any) => {
      if (v) {
        this.editShow = false;
        this.actions[this.crud.find('_id', this.editObj['_id'], this.actions)] = v;
        this.user.companies[0].action = this.actions;
        this.auth.setMe(this.user);
        this.isBlok = false;
        this.editShow = false;
        this.editObj = {
          name: '',
          description: '',
          img: '',
          companyOwner: '',
          orderOwner: '',
          client: [],
          actionGlobal: true,
          dateStart: new Date(),
          dateEnd: new Date()
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
    // this.uploadObj = e;
    this.editObj.img = e.file;
    this.formCheck();
  }
  onFs(e) {
    // this.uploadObj = e;
    this.action.img = e.file;
  }
  formCheck() {
    this.btnBlok(this.validate());
    if (this.editObj.client.length !== this.editObjCopy.client.length) {
      this.btnBlok(true);
    }
  }
  openAdd() {
    this.addShow = !this.addShow;
    this.editShow = false;
    this.checkAccess();
  }
  cancelAdd() {
    this.addShow = false;
    if (this.products.length > 0) {
      this.productChoose = this.products[0]._id;
    }
    this.action = {
      name: '',
      description: '',
      img: '',
      companyOwner: '',
      orderOwner: '',
      client: [],
      actionGlobal: true,
      dateStart: new Date(),
      dateEnd: new Date()
    };
  }
  cancelEdit() {
    this.editShow = false;
    this.isBlok = false;
    this.inputChange = '';
    this.userChoose = [];
    this.editObj = {
      name: '',
      description: '',
      img: '',
      companyOwner: '',
      orderOwner: '',
      client: [],
      actionGlobal: true,
      dateStart: new Date(),
      dateEnd: new Date()
    };
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
  outputSearch(e) {
    if (!e) {
      const date = new Date(new Date().getTime() - new Date().getHours()*60*60*1000 - new Date().getMinutes()*60*1000  - new Date().getSeconds()*1000).getTime();

      // const date = new Date(new Date(new Date().getMonth()+1+'.'+(new Date().getDate()) +'.'+new Date().getFullYear()).getTime());
      if (this.indexTab === 0) {
        this.crud.get(`action/count?query={"companyOwner":"${this.company}","dateEnd":{"$gte":"${date}"}}`).then((c: any) => {
          if (c) {
            this.lengthPagination = c.count;
            this.crud.get(`action?query={"companyOwner":"${this.company}","dateEnd":{"$gte":"${date}"}}&populate={"path":"client"}&skip=0&limit=${this.pageSizePagination}&sort={"date":-1}`).then((a: any) => {
              if (a) {
                this.actions = a;
                this.checkAccess();
              }
            });
          }
        });
      }
      if (this.indexTab === 1) {
        const query = `?query={"companyOwner":"${this.company}","dateEnd":{"$lte":"${date}"}}&populate={"path":"client"}&skip=0&limit=${this.pageSizePagination}&sort={"date":-1}`;
        this.crud.get(`action/count${query}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
            this.crud.get(`action${query}`).then((v: any) => {
              if (v) {
                this.actions = v;
              }
            })
          }
        })
      }
    } else {
      this.actions = e;
    }
  }
  tabChange(e) {
    this.loading = false;
    this.indexTab = e;
    // const date = new Date(new Date(new Date().getMonth()+1+'.'+(new Date().getDate()) +'.'+new Date().getFullYear()).getTime());
    const date = new Date(new Date().getTime() - new Date().getHours()*60*60*1000 - new Date().getMinutes()*60*1000  - new Date().getSeconds()*1000).getTime();

    if (e === 0) {
      this.crud.get(`action/count?query={"companyOwner":"${this.company}","dateEnd":{"$gte":"${date}"}}`).then((c: any) => {
        if (c) {
          this.lengthPagination = c.count;
          this.crud.get(`action?query={"companyOwner":"${this.company}","dateEnd":{"$gte":"${date}"}}&populate={"path":"client"}&skip=0&limit=${this.pageSizePagination}&sort={"date":-1}`).then((a: any) => {
            if (a) {
              this.actions = a;
              this.loading = true;
              this.checkAccess();
            }
          });
        }
      });
    }
    if (e === 1) {
      const query = `?query={"companyOwner":"${this.company}","dateEnd":{"$lte":"${date}"}}&populate={"path":"client"}&skip=0&limit=${this.pageSizePagination}&sort={"date":-1}`;
      this.crud.get(`action/count${query}`).then((count: any) => {
        if (count) {
          this.lengthPagination = count.count;
          this.crud.get(`action${query}`).then((v: any) => {
            if (v) {
              this.actions = v;
              this.loading = true;
            }
          })
        }
      })
    }
  }
  pageEvent(e) {
    const date = new Date(new Date(new Date().getMonth()+1+'.'+(new Date().getDate()) +'.'+new Date().getFullYear()).getTime());
    if (this.indexTab === 0) {
      this.crud.get(`action?query={"companyOwner":"${this.company}","dateEnd":{"$gte":"${date.toISOString()}"}}&populate={"path":"client"}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}&sort={"date":-1}`).then((c: any) => {
        if (c) {
          this.actions = c;
        }
      });
    }
    if (this.indexTab === 1) {
      const query = `?query={"companyOwner":"${this.company}","dateEnd":{"$lte":"${date.toISOString()}"}}&populate={"path":"client"}&skip=0&limit=${this.pageSizePagination}&sort={"date":-1}`;
      this.crud.get(`action${query}`).then((v: any) => {
        if (v) {
          this.actions = v;
        }
      })
    }
  }
}
