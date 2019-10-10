import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public mainCategoryChoose: string;
  public mainCategory;
  public user;
  public defLang = 'ru-UA';
  public isBlok = false;
  public loading = false;

  public addShow = false;
  public editShow = false;
  public categorys = [];
  public editObjCopy;
  public editObj = {
    name: '',
    mainCategory: '',
  };
  public category = {
    name: '',
    companyOwner: '',
    orders: [],
    mainCategory: '',
  };

  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.crud.get('mainCategory').then((v: any) => {
      if (!v || v.length === 0)  { return; }
      this.mainCategory = v;
      this.mainCategoryChoose = this.mainCategory[0]._id;
    });
    this.auth.onMe.subscribe((v: any) => {
      if (!v) { return; }
      this.user = v;
      if (this.user.companies[0] && this.user.companies[0].categories.length > 0) {
        this.crud.get(`category/count?query={"companyOwner": "${this.user.companies[0]._id}"}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
            this.crud.get(`category?query={"companyOwner": "${this.user.companies[0]._id}"}&skip=0&limit=${this.pageSizePagination}`).then((c: any) => {
              if (c) {
                this.categorys = c;
                this.loading = true;
              }
            });
          }
        });
      }
    });
  }

  create(e) {
    e.preventDefault();
    if (this.category.name === '') {
      Swal.fire('Error', 'Название категории не может быть пустым', 'error');
      return;
    }
    if (!this.mainCategoryChoose) {
      Swal.fire('Error', 'Выберете к какой категории относится ваша категория', 'error');
      return;
    }
    this.category.mainCategory = this.mainCategoryChoose;
    this.category.companyOwner = this.user.companies[0]._id;
    this.crud.post('category', this.category).then((v: any) => {
      if (v) {
        this.categorys.push(v);
        this.category = {
          name: '',
          companyOwner: '',
          orders: [],
          mainCategory: '',
        };
        this.mainCategoryChoose = null;
        this.addShow = false;
        this.crud.get(`category/count?query={"companyOwner": "${this.user.companies[0]._id}"}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
          }
        });
      }
    });
  }

  delete(i) {
    this.crud.delete('category', this.categorys[i]._id).then((v: any) => {
      if (v) {
        this.categorys.splice(i, 1);
        this.crud.get(`category/count?query={"companyOwner": "${this.user.companies[0]._id}"}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
          }
        });
      }
    });
  }
  edit(i) {
    this.editObj = Object.assign({}, this.categorys[i]);
    this.editObjCopy = Object.assign({}, this.categorys[i]);
    this.mainCategoryChoose = this.editObj.mainCategory;
    this.addShow = false;
    this.editShow = true;
  }
  confirmEditCategoryCrud(e) {
    e.preventDefault();
    if (this.editObj.name === '') {
      Swal.fire('Error', 'Название категории не может быть пустым', 'error');
      return;
    }
    if (!this.mainCategoryChoose) {
      Swal.fire('Error', 'Выберете к какой категории относится ваша категория', 'error');
      return;
    }
    this.editObj.mainCategory = this.mainCategoryChoose;
    this.crud.post('category', {name: this.editObj.name}, this.editObj['_id']).then((v: any) => {
      if (v) {
        this.editShow = false;
        this.categorys[this.crud.find('_id', this.editObj['_id'], this.categorys)] = v;
        this.user.companies[0].categories = this.categorys;
        this.auth.setMe(this.user);
        this.isBlok = false;
        this.editShow = false;
        this.editObj = {
          name: '',
          mainCategory: '',
        };
      }
    });
  }
  selectValid() {
    if (this.editObjCopy.mainCategory !== this.mainCategoryChoose) {
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

  formCheck() {
    this.btnBlok(this.validate());
  }
  openAdd() {
    this.addShow = true;
    this.editShow = false;
  }
  cancelAdd() {
    this.addShow = false;
    this.mainCategoryChoose = this.mainCategory[0]._id;
    this.category = {
      name: '',
      companyOwner: '',
      orders: [],
      mainCategory: '',
    };
  }
  cancelEdit() {
    this.editShow = false;
    this.isBlok = false;
    this.editObj = {
      name: '',
      mainCategory: '',
    };
  }

  pageEvent(e) {
    this.crud.get(`category?query={"companyOwner":"${this.user.companies[0]._id}"}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}`).then((c: any) => {
      if (!c) {
        return;
      }
      this.categorys = c;
      this.loading = true;
    });
  }
}
