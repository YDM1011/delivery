import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import Swal from 'sweetalert2';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  public id = null;
  public user: any;
  public categoryID;
  public mainChooseBrand;
  public defLang = 'ru-UA';
  public showPagin = false;
  public addShow = false;
  public editShow = false;
  public isBlok: boolean = false;
  public showSale: boolean = false;
  public products = [];
  public brands = [];
  public uploadObj = {};
  public editObjCopy;
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
  public product = {
    name: '',
    des: '',
    img: '',
    brand: '',
    price: null,
    discount: null,
    companyOwner: '',
    categoryOwner: '',
  };

  displayedColumns: string[] = ['Номер', 'Назва бренда', 'data', 'delete'];
  dataSource = new MatTableDataSource(this.products);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
      private crud: CrudService,
      private auth: AuthService,
      private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((u: any) => {
      if (!u) {return; }
      this.user = u;
    });
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id) {
        this.crud.get(`category?query={"_id":"${this.id}"}&populate={"path":"orders"}`).then((v: any) => {
          if (!v || v.length === 0) {return; }
          this.categoryID = v[0];
          this.products = v[0].orders;
          this.dataSource = new MatTableDataSource(this.products);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          this.checkDataLength();
        });
      }
    });
    this.crud.get('brand').then((b: any) => {
      if (!b) {return; }
      this.brands = b;
      this.mainChooseBrand = this.brands[0]._id;
    });
  }

  create() {
    if (this.validation('product')) {
      this.crud.post('upload2', {body: this.uploadObj}, null, false).then((v: any) => {
        if (v) {
          this.addShow = false;
          this.product['img'] = v.file;
          this.product.categoryOwner = this.id;
          this.product.brand = this.mainChooseBrand;
          this.product.companyOwner = this.user.companies[0]._id;
          this.crud.post('order', this.product).then((v: any) => {
            if (v) {
              this.products.unshift(v);
              this.dataSource = new MatTableDataSource(this.products);
              setTimeout(() => this.dataSource.paginator = this.paginator);
              this.checkDataLength();
              this.product = {
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
          }).catch((error) => {
            if (error && error.error.errors.price.name === 'CastError') {
              Swal.fire('Error', 'Цена должна вводится через "." - точку', 'error').then();
            }
          });
        }
      });
    }
  }

  delete(i) {
    this.crud.delete('order', this.products[i]._id).then((v: any) => {
      if (v) {
        this.products.splice(i, 1);
        this.dataSource = new MatTableDataSource(this.products);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.checkDataLength();
      }
    });
  }
  edit(i) {
    this.editObj = Object.assign({}, this.products[i]);
    this.editObjCopy = Object.assign({}, this.products[i]);
    if (this.editObj.discount && this.editObj.discount !== '') {
      this.showSale = true;
    }
    this.mainChooseBrand = this.editObj.brand;
    this.addShow = false;
    this.editShow = true;
  }
  confirmEditCategoryCrud(e) {
    e.preventDefault();
    if (this.validation('editObj')) {
      if (!this.showSale) {
        this.editObj.discount = null;
      }
      if (this.editObj.img === this.editObjCopy.img) {
        this.crud.post('order', this.editObj, this.editObj['_id']).then((v: any) => {
          if (v) {
            this.editShow = false;
            this.products[this.crud.find('_id', this.editObj['_id'], this.products)] = v;
            this.dataSource = new MatTableDataSource(this.products);
            setTimeout(() => this.dataSource.paginator = this.paginator);
            this.checkDataLength();
            this.product = {
              name: '',
              des: '',
              img: '',
              brand: '',
              price: null,
              discount: null,
              companyOwner: '',
              categoryOwner: '',
            };
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
                this.dataSource = new MatTableDataSource(this.products);
                setTimeout(() => this.dataSource.paginator = this.paginator);
                this.checkDataLength();
                this.editShow = false;
                this.isBlok = false;
                this.product = {
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

  changeSelect(b) {
    this.editObjCopy['brand'] = b;
    this.formCheck();
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
  onFs(e) {
    this.uploadObj = e;
    this.product.img = e.name;
  }
  onFsEdit(e) {
    this.uploadObj = e;
    this.editObj.img = e.name;
    this.formCheck();
  }
  openAdd() {
    this.addShow = true;
    this.editShow = false;
  }
  cancelAdd() {
    this.addShow = false;
    this.product = {
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
  cancelEdit() {
    this.editShow = false;
    this.isBlok = false;
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

  checkDataLength() {
    if (!this.products || this.products.length === 0) {
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

  validation(obj) {
    if (this[obj].name === '') {
      Swal.fire('Error', 'Название продукта не может быть пустым', 'error').then();
      return;
    }
    if (this[obj].price === null) {
      Swal.fire('Error', 'Укажите цену продукта', 'error').then();
      return;
    }
    if (this[obj].des === '') {
      Swal.fire('Error', 'Описание не может быть пустым', 'error').then();
      return;
    }
    if (this[obj].img === '') {
      Swal.fire('Error', 'Додайте картинку к продукту', 'error').then();
      return;
    }
    if (this[obj].brand === '') {
      Swal.fire('Error', 'Выберете к какому бренду относится продукт', 'error').then();
      return;
    }
    return true;
  }
}
