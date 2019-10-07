import {Component, OnInit, ViewChild} from '@angular/core';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public loading: boolean = false;
  public showSale: boolean = false;
  public isBlok: boolean = false;
  public countProduct = null;
  public brands = [];
  public mainCategoryChoose: string;
  public mainChooseBrand: string = null;
  public user;
  public defLang = 'ru-UA';
  public showPagin = false;
  public addShow = false;
  public editShow = false;
  public products = [];
  public categorys = [];
  public editObjCopy;
  public uploadObj;
  public editObj = {
    name: '',
    des: '',
    img: '',
    brand: '',
    price: null,
    discount: null,
    companyOwner: '',
    categoryOwner: '',
  };

  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) { return; }
      this.user = v;
      this.categorys = v.companies[0].categories;
      if (this.categorys && this.categorys.length > 0) {
        this.mainCategoryChoose = this.categorys[0]._id;
        this.crud.get(`order/count?query={"companyOwner":"${this.user.companies[0]._id}"}`).then((count: any) => {
          if (count.count > 0) {
            this.lengthPagination = count.count;
            this.crud.get(`order?query={"companyOwner":"${this.user.companies[0]._id}"}`).then((p: any) => {
              if (!p) {return; }
              this.products = p;
              this.loading = true;
            });
          }
        });
      }
    });
  }
  edit(i) {
    this.editObj = Object.assign({}, this.products[i]);
    this.editObjCopy = Object.assign({}, this.products[i]);
    this.mainChooseBrand = this.editObj.brand;
    this.mainCategoryChoose = this.editObj.categoryOwner;
    this.addShow = false;
    this.editShow = true;
  }
  confirmEditCategoryCrud(e) {
    e.preventDefault();
    if (this.validation('editObj')) {
      if (!this.showSale) {
        this.editObj.discount = null;
      }
      this.editObj.brand = this.mainChooseBrand;
      if (this.editObj.img === this.editObjCopy.img) {
        this.crud.post('order', this.editObj, this.editObj['_id']).then((v: any) => {
          if (v) {
            this.editShow = false;
            this.products[this.crud.find('_id', this.editObj['_id'], this.products)] = v;
            this.editShow = false;
          }
        }).catch((error) => {
          if (error && error.errors.price.name === 'CastError') {
            Swal.fire('Error', 'Цена должна вводится через "." - точку', 'error').then();
            return;
          }
        });
      } else {
        this.crud.post('upload2', {body: this.uploadObj}).then((u: any) => {
          if (u) {
            this.editObj.img = u.file;
            this.crud.post('order', this.editObj, this.editObj['_id']).then((v: any) => {
              if (v) {
                this.editShow = false;
                this.products[this.crud.find('_id', this.editObj['_id'], this.products)] = v;
                this.editShow = false;
                this.isBlok = false;
              }
            }).catch((error) => {
              if (error && error.errors.price.name === 'CastError') {
                Swal.fire('Error', 'Цена должна вводится через "." - точку', 'error').then();
                return;
              }
            });
          }
        });
      }
      this.isBlok = false;
    }
  }
  openAdd() {
    this.addShow = true;
    this.editShow = false;
  }
  cancelAdd(e) {
    this.addShow = false;
  }
  cancelEdit() {
    this.editShow = false;
    this.mainChooseBrand = this.brands[0]._id;
    this.editObj = {
      name: '',
      des: '',
      img: '',
      brand: '',
      price: null,
      discount: null,
      companyOwner: '',
      categoryOwner: '',
    };
  }
  delete(i) {
    this.crud.delete('order', this.products[i]._id).then((v: any) => {
      if (v) {
        this.products.splice(i, 1);
      }
    });
  }
  validation(obj) {
    if (this[obj].name === '') {
      Swal.fire('Error', 'Название продукта не может быть пустым', 'error');
      return;
    }
    if (this[obj].des === '') {
      Swal.fire('Error', 'Описание не может быть пустым', 'error');
      return;
    }
    if (this[obj].price === null) {
      Swal.fire('Error', 'Укажите цену продукта', 'error');
      return;
    }
    if (this[obj].img === '') {
      Swal.fire('Error', 'Картинка продукта не может быть пустой', 'error');
      return;
    }
    return true;
  }
  validate() {
    let isTrue = false;
    for (const key in this.editObj) {
      if (this.editObj[key] !== this.editObjCopy[key]) {isTrue = true; }
    }
    return isTrue;
  }

  onFsEdit(e) {
    this.uploadObj = e;
    this.editObj.img = e.name;
    this.formCheck();
  }

  btnBlok(is) {
    this.isBlok = is;
  }

  formCheck() {
    this.btnBlok(this.validate());
  }
  changeSelect(b) {
    this.editObjCopy['brand'] = b;
    this.formCheck();
  }
  newProduct(e) {
    if (e) {
      this.products.push(e);
      this.addShow = false;
    }
  }
}
