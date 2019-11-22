import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public loading = false;
  public defLang = 'ru-UA';
  public addShow = false;
  public editShow = false;
  public isBlok = false;
  public categorys = [];
  public brands = [];
  public mainChooseBrand = null;
  public uploadObj;
  public page = {pageSize: 5, pageIndex: 0};
  public editObjCopy;
  public subcategoryName = '';
  public editArrayBrands = [];
  public editObj = {
    name: '',
    img: '',
    subCategory: [],
    brands: []
  };
  public category = {
    name: '',
    img: '',
  };

  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('mainCategory/count').then((count: any) => {
      if (!count) {return; }
      this.lengthPagination = count.count;
      this.crud.get(`mainCategory?skip=0&limit=${this.pageSizePagination}`).then((v: any) => {
        if (!v) {return; }
        this.categorys = v;
        this.loading = true;
      });
    });
    this.crud.get('brand?select=["name"]').then((b: any) => {
      if (!b) {return; }
      this.brands = b;
    });
  }
  onFs(e) {
    this.category.img = e.file;
  }
  onFsEdit(e) {
    this.editObj.img = e.file;
    this.editObjCopy.img = e.file.split('--')[1];
    this.formCheck();
  }
  addBrands() {
    if (this.mainChooseBrand) {
      if (this.editObjCopy.brands.indexOf(this.mainChooseBrand) !== -1) {
        return;
      }
      this.editObjCopy.brands.push(this.mainChooseBrand);
      this.showBrandsName();
      this.mainChooseBrand = null;
    }
  }
  addSubCatergory(e) {
    e.preventDefault();
    if (this.subcategoryName) {
      this.editObjCopy.subCategory.push(this.subcategoryName);
      this.subcategoryName = '';
    }
  }
  removeSub(i) {
    this.editObjCopy.subCategory.splice(i, 1);
  }
  removeBrands(i) {
    this.editObjCopy.brands.splice(i, 1);
    this.showBrandsName();
  }
  create() {
    if (!this.category.name || !this.category.img) {
      Swal.fire('Error', 'Все поля должны быть заполнены', 'error').then();
      return;
    }
    this.category.name = this.category.name.trim();
    this.crud.post('mainCategory', this.category).then((v: any) => {
      if (v) {
        this.categorys.unshift(v);
        this.addShow = false;
        this.crud.get('mainCategory/count').then((count: any) => {
          if (!count) {return; }
          this.lengthPagination = count.count;
        });
        this.category = {
          name: '',
          img: ''
        };
      }
    }).catch((error) => {
      if (error.error.code === 11000) {
        Swal.fire('Error', 'Категория с таким названием уже создана!', 'error');
      }
    });
  }

  delete(i) {
    this.crud.delete('mainCategory', this.categorys[i]._id).then((v: any) => {
      if (v) {
        this.categorys.splice(i, 1);
        this.crud.get('mainCategory/count').then((count: any) => {
          if (!count) {return; }
          this.lengthPagination = count.count;
        });
      }
    });
  }
  edit(i) {
    this.editObj = Object.assign({}, this.categorys[i]);
    this.editObjCopy = Object.assign({}, this.categorys[i]);
    this.showBrandsName();
    this.formCheck();
    this.editObjCopy.img = this.editObjCopy.img ? this.editObjCopy.img.split("--")[1] : '';
    this.addShow = false;
    this.editShow = true;
  }
  showBrandsName () {
    this.editArrayBrands = this.editObjCopy.brands.map((item, index) => {
      return this.brands[this.crud.find('_id', item, this.brands)];
    });
  }
  confirmEdit() {
    if (this.editObjCopy.name === '') {
      Swal.fire('Error', 'Название категории не может быть пустым', 'error').then();
      return;
    }
    if (this.editObjCopy.img === '') {
      Swal.fire('Error', 'Картинка категории не может быть пуста', 'error').then();
      return;
    }
    this.confirmEditCategoryCrud();
  }
  confirmEditCategoryCrud() {
    this.editObjCopy.img = this.editObj.img;
    this.editObjCopy.name = this.editObjCopy.name.trim();
    this.crud.post('mainCategory', this.editObjCopy, this.editObj['_id']).then((v: any) => {
      if (v) {
        this.categorys[this.crud.find('_id', this.editObj['_id'], this.categorys)] = v;
        this.editShow = false;
        this.editObj = {
          name: '',
          img: '',
          subCategory: [],
          brands: []
        };
      }
    });
  }
  openAdd() {
    this.addShow = true;
    this.editShow = false;
  }
  cancelAdd() {
    this.addShow = false;
    this.category = {
      name: '',
      img: ''
    };
  }
  cancelEdit() {
    this.editShow = false;
    this.editObj = {
      name: '',
      img: '',
      subCategory: [],
      brands: []
    };
  }
  validate() {
    let isTrue = false;
    for (const key in this.editObj) {
      if (this.editObj[key].toString() !== this.editObjCopy[key].toString()) {isTrue = true; }
    }
    return isTrue;
  }

  btnBlok(is) {
    this.isBlok = is;
  }

  formCheck() {
    this.btnBlok(this.validate());
    if (this.editObj.subCategory && (this.editObj.subCategory.length !== this.editObjCopy.subCategory.length)) {
      this.btnBlok(true);
    }
    if (this.editObj.brands && (this.editObj.brands.length !== this.editObjCopy.brands.length)) {
      this.btnBlok(true);
    }
  }
  outputSearch(e) {
    if (!e) {
      this.crud.get(`mainCategory?skip=0&limit=${this.pageSizePagination}`).then((v: any) => {
        if (!v) {return; }
        this.categorys = v;
      });
    } else {
      this.categorys = e;
    }
  }
  pageEvent(e) {
    this.crud.get(`mainCategory&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}`).then((c: any) => {
      if (!c) {
        return;
      }
      this.categorys = c;
    });
  }
}
