import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Swal from "sweetalert2";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  @Input() obj;
  @Output() outputChanges = new EventEmitter();
  @Output() cancelEdit = new EventEmitter();
  public mainChooseBrand;
  public showSale = false;
  public isBlok = false;
  public brands = [];
  public uploadObj = {};
  public editObjCopy;
  public editObj;
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.editObj = Object.assign({}, this.obj.obj);
    this.editObjCopy = Object.assign({}, this.obj.obj);
    if (this.editObj.discount && this.editObj.discount !== '') {
      this.showSale = true;
    }
    this.crud.get('brand').then((b: any) => {
      if (!b) {return; }
      this.brands = b;
      this.mainChooseBrand = this.brands[0]._id;
    });
  }
  confirmEditCategoryCrud(e) {
    e.preventDefault();
    if (this.validation('editObj')) {
      if (!this.showSale) {
        this.editObj.discount = null;
      }
      this.obj.obj = this.editObj;
      this.editObj.brand = this.mainChooseBrand;
      if (this.editObj.img === this.editObjCopy.img) {
        this.crud.post('order', this.editObj, this.editObj['_id']).then((v: any) => {
          if (v) {
            this.obj.obj = v;
            this.outputChanges.emit(this.obj);
            this.cancelEdit.emit(false);
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
                this.obj.obj = v;
                this.outputChanges.emit(this.obj);
                this.isBlok = false;
                this.editObj = null;
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
  onFsEdit(e) {
    this.uploadObj = e;
    this.editObj.img = e.name;
    this.formCheck();
  }
}
