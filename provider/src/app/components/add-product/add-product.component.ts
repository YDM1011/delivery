import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, AfterViewChecked {
  @Input() brands;
  @Input() categorys;
  @Output() outputNew = new EventEmitter();
  @Output() cancelAdd = new EventEmitter();
  public user;
  public subCategoryArray;
  public subCategoryChoose;
  public mainCategoryChoose;
  public mainChooseBrand;
  public companyId;
  public uploadObj;
    public product = {
    name: '',
    des: '',
    img: '',
    price: null,
    companyOwner: '',
    categoryOwner: '',
    subCategory: '',
    brand: '',
  };
  constructor(
      private crud: CrudService,
      private auth: AuthService,
      private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) { return; }
      this.user = v;
      if (this.user.companyOwner) {
        this.companyId = this.user.companyOwner._id;
      }
    });
    if (this.categorys && this.categorys.length > 0) {
      this.mainCategoryChoose = this.categorys[0]._id;
      this.selectSubCategory(this.mainCategoryChoose);
    }
  }
  selectSubCategory(id) {
    const index = this.crud.find('_id', id, this.categorys);
    this.subCategoryArray = this.categorys[index].mainCategory ? this.categorys[index].mainCategory.subCategory : null;
  }
  removeImg() {
    delete this.product.img;
    this.product['img'] = '';
  }
  create() {
    if (this.validation('product')) {
      this.product.categoryOwner = this.mainCategoryChoose;
      if (this.subCategoryChoose) this.product.subCategory = this.subCategoryChoose;
      this.product.brand = this.mainChooseBrand;
      this.product.companyOwner = this.companyId;
      this.crud.post('order', this.product).then((v: any) => {
        if (v) {
          this.outputNew.emit(v);
          this.clearMainObj();
        }
      }).catch((error) => {
        // if (error && error.errors.price && error.errors.price.name === 'CastError') {
        //   Swal.fire('Error', 'Цена должна вводится через "." - точку', 'error').then();
        // } else if (error && error.errors.categoryOwner.message === 'Check category') {
        //   Swal.fire('Error', 'У вас нет созданых категорий', 'error').then();
        // }
      });
    }
  }
  cancelAddBtn() {
    this.crud.post('deleteFile', {file: this.product.img}).then((v: any) => {
      this.cancelAdd.emit(false);
    });
  }
  onFs(e) {
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
      subCategory: '',
      brand: '',
    };
  }
  ngAfterViewChecked() {
      this.cdRef.detectChanges();
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
