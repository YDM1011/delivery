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
  public mainChooseBrand: string;
  public user;
  public defLang = 'ru-UA';
  public showPagin = false;
  public addShow = false;
  public editShow = false;
  public products = [];
  public categorys = [];
  public editObj = {
    name: '',
    des: '',
    price: null,
    companyOwner: '',
    categoryOwner: '',
  };
  public product = {
    name: '',
    des: '',
    price: null,
    companyOwner: '',
    categoryOwner: '',
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
      if (this.user.companies[0] && this.user.companies[0].categories.length > 0) {
        this.crud.get(`category?query={"companyOwner": "${this.user.companies[0]._id}"}`).then((e: any) => {
          this.categorys = e;
          this.mainCategoryChoose = this.categorys[0]._id;
          this.dataSource = new MatTableDataSource(this.categorys);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          this.chackDataLength();
        });
        this.crud.get('brands').then((b: any) => {
          if (!b) {return; }
          this.brands = b;
          this.mainChooseBrand = this.brands[0]._id;
        });
      }
    });
  }

  create() {
    if (this.validation('product')) {
      this.product.categoryOwner = this.mainCategoryChoose;
      this.product.companyOwner = this.user.companies[0]._id;
      this.crud.post('order', this.product).then((v: any) => {
        if (v) {
          const index = this.crud.find('_id', this.mainCategoryChoose, this.categorys);
          this.categorys[index].orders.push(v._id);
          this.crud.post('category', {orders: this.categorys[index].orders}, this.mainCategoryChoose, false).then((e: any) => {});
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
            price: null,
            companyOwner: '',
            categoryOwner: '',
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
      price: null,
      companyOwner: '',
      categoryOwner: '',
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
      price: null,
      companyOwner: '',
      categoryOwner: '',
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
    return true;
  }
}
