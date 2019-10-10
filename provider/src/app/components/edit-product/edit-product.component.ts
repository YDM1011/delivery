import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import Swal from "sweetalert2";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit, OnChanges {
  @Input() obj;
  @Input() brands;
  @Output() outputChanges = new EventEmitter();
  @Output() cancelEdit = new EventEmitter();
  public mainChooseBrand;
  public showSale = false;
  public isBlok = false;
  public uploadObj = {};
  public editObjCopy;
  public editObj;
  constructor(
      private crud: CrudService
  ) { }

  ngOnChanges() {
    this.editObj = Object.assign({}, this.obj);
    this.editObj.img = this.obj.img.split("--")[1];
    this.editObjCopy = Object.assign({}, this.obj);
    this.mainChooseBrand = this.obj.brand;
    if (this.editObj.discount) {
      this.showSale = true;
      return;
    } else {
      this.showSale = false;
    }
  }
  ngOnInit() {
    this.editObj = Object.assign({}, this.obj);
    this.editObj.img = this.obj.img.split("--")[1];
    this.editObjCopy = Object.assign({}, this.obj);
    this.mainChooseBrand = this.obj.brand;
    if (this.editObj.discount) {
      this.showSale = true;
      return;
    } else {
      this.showSale = false;
    }
  }
  confirmEditCategoryCrud(e) {
    e.preventDefault();
    if (this.validation('editObj')) {
      if (!this.showSale) {
        this.editObj.discount = null;
      } else {
        if (!this.editObj.discount) {
          Swal.fire('Error', 'Укажите скидку или отключите', 'error').then();
          return;
        }
      }
      this.editObj.brand = this.mainChooseBrand;
      if (!this.uploadObj.name) {
        this.editObj.img = this.editObjCopy.img;
        this.crud.post('order', this.editObj, this.editObj['_id']).then((v: any) => {
          if (v) {
            this.obj = v;
            this.outputChanges.emit(this.obj);
            this.cancelEdit.emit(false);
            this.editObj = null;
            this.editObjCopy = null;
          }
        }).catch((error) => {
          if (error && error.errors.price.name === 'CastError') {
            Swal.fire('Error', 'Цена должна вводится через "." - точку', 'error').then();
            return;
          }
        });
      } else {
        this.crud.post('upload2', {body: this.uploadObj}, null, false).then((u: any) => {
          if (u) {
            this.editObj.img = u.file;
            this.crud.post('order', this.editObj, this.editObj['_id']).then((v: any) => {
              if (v) {
                this.obj = v;
                this.outputChanges.emit(this.obj);
                this.isBlok = false;
                this.uploadObj = null;
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

  onFsEdit(e) {
    this.uploadObj = e;
    this.editObj.img = e.name;
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
    if (!this.showSale) {
      this.editObj.discount = null;
      this.btnBlok(true);
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
