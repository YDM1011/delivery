import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
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
  public uploadObj = {};
  public editObj = {
    name: '',
    des: '',
    img: '',
    price: null,
    companyOwner: '',
    categoryOwner: '',
    brand: '',
  };
  public product = {
    name: '',
    des: '',
    img: '',
    price: null,
    companyOwner: '',
    categoryOwner: '',
    brand: '',
  };

  displayedColumns: string[] = ['Номер', 'Назва бренда', 'data', 'delete'];
  dataSource = new MatTableDataSource(this.products);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
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
        this.dataSource = new MatTableDataSource(this.categorys);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
      }
    });
    this.crud.get('brand').then((b: any) => {
      if (!b) {return; }
      this.brands = b;
    });
  }

  create() {
    if (this.validation('product')) {
      this.crud.post('upload2', {body: this.uploadObj}, null, false).then((u: any) => {
        if (u) {
          this.product['img'] = u.file;
          this.product.categoryOwner = this.mainCategoryChoose;
          this.product.brand = this.mainChooseBrand;
          this.product.companyOwner = this.user.companies[0]._id;
          this.crud.post('order', this.product).then((v: any) => {
            if (v) {
              const index = this.crud.find('_id', this.mainCategoryChoose, this.categorys);
              this.categorys[index].orders.push(v._id);
              this.crud.post('category', {$push: {orders: v._id}}, this.mainCategoryChoose, false).then((e: any) => {});
              this.mainCategoryChoose = null;
              this.addShow = false;
              this.clearMainObj();
            }
          }).catch((error) => {
            if (error && error.errors.price.name === 'CastError') {
              Swal.fire('Error', 'Цена должна вводится через "." - точку', 'error').then();
            } else if (error && error.errors.categoryOwner.message === 'Check category') {
              Swal.fire('Error', 'У вас нет созданых категорий', 'error').then();
            }
          });
        }
      });
    }
  }

  onFs(e) {
    this.uploadObj = e;
    this.product.img = e.name;
  }

  delete(i) {
    this.crud.delete('category', this.products[i]._id).then((v: any) => {
      if (v) {
        this.products.splice(i, 1);
        this.dataSource = new MatTableDataSource(this.products);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
      }
    });
  }
  edit(i) {
    this.editObj = Object.assign({}, this.products[i]);
    this.mainCategoryChoose = this.editObj.categoryOwner;
    this.addShow = false;
    this.editShow = true;
  }
  confirmEditCategoryCrud() {
    if (this.validation('editObj')) {
      this.editObj.categoryOwner = this.mainCategoryChoose;
      this.crud.post('category', {name: this.editObj.name}, this.editObj['_id']).then((v: any) => {
        if (v) {
          this.editShow = false;
          this.products[this.crud.find('_id', this.editObj['_id'], this.products)] = v;
          this.dataSource = new MatTableDataSource(this.products);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          this.chackDataLength();
          this.editObj = {
            name: '',
            des: '',
            img: '',
            price: null,
            companyOwner: '',
            categoryOwner: '',
            brand: '',
          };
          this.editShow = false;
        }
      }).catch((error) => {
        if (error && error.errors.price.name === 'CastError') {
          Swal.fire('Error', 'Цена должна вводится через "." - точку', 'error');
          return;
        }
      });
    }
  }
  openAdd() {
    this.addShow = true;
    this.editShow = false;
  }
  cancelAdd() {
    this.addShow = false;
    this.clearMainObj();
  }
  cancelEdit() {
    this.editShow = false;
    this.editObj = {
      name: '',
      des: '',
      img: '',
      price: null,
      companyOwner: '',
      categoryOwner: '',
      brand: '',
    };
  }

  chackDataLength() {
    if (!this.categorys || this.categorys.length === 0) {
      this.showPagin = false;
    } else {
      this.showPagin = true;
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  clearMainObj() {
    this.product = {
      name: '',
      des: '',
      img: '',
      price: null,
      companyOwner: '',
      categoryOwner: '',
      brand: '',
    };
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
}
