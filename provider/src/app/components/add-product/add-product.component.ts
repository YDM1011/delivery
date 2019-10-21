import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  @Input() brands;
  @Input() categorys;
  @Output() outputNew = new EventEmitter();
  @Output() cancelAdd = new EventEmitter();
  public user;
  public mainCategoryChoose;
  public mainChooseBrand;
  public uploadObj;
    public product = {
    name: '',
    des: '',
    img: '',
    price: null,
    companyOwner: '',
    categoryOwner: '',
    brand: '',
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
      }
    });
  }
  create() {
    if (this.validation('product')) {
      // this.crud.post('upload2', {body: this.uploadObj}, null, false).then((u: any) => {
      //   if (u) {
      //     this.product['img'] = u.file;
      //     this.product.categoryOwner = this.mainCategoryChoose;
      //     this.product.brand = this.mainChooseBrand;
      //     this.product.companyOwner = this.user.companies[0]._id;
      //     this.crud.post('order', this.product).then((v: any) => {
      //       if (v) {
      //         this.outputNew.emit(v);
      //         this.clearMainObj();
      //       }
      //     }).catch((error) => {
      //       if (error && error.errors.price.name === 'CastError') {
      //         Swal.fire('Error', 'Цена должна вводится через "." - точку', 'error').then();
      //       } else if (error && error.errors.categoryOwner.message === 'Check category') {
      //         Swal.fire('Error', 'У вас нет созданых категорий', 'error').then();
      //       }
      //     });
      //   }
      // });

      this.product.categoryOwner = this.mainCategoryChoose;
      this.product.brand = this.mainChooseBrand;
      this.product.companyOwner = this.user.companies[0]._id;
      this.crud.post('order', this.product).then((v: any) => {
        if (v) {
          this.outputNew.emit(v);
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
  cancelAddBtn() {
    this.cancelAdd.emit(false);
  }
  onFs(e) {
    // this.uploadObj = e;
    this.product.img = e.file;
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
