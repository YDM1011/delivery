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
  public uploadObj;
  public page = {pageSize: 5, pageIndex: 0};
  public editObjCopy;
  public editObj = {
    name: '',
    img: '',
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
  }
  onFs(e) {
    this.uploadObj = e;
    this.category.img = e.name;
  }
  onFsEdit(e) {
    this.uploadObj = e;
    this.editObjCopy.img = e.name;
    this.formCheck();
  }
  create() {
    if (this.category.name === '' || !this.category.img) {
      Swal.fire('Error', 'Все поля должны быть заполнены', 'error').then();
      return;
    }
    this.crud.post('upload2', {body: this.uploadObj}, null, false).then((v: any) => {
      if (!v) {return; }
      this.category.img = v.file;
      this.crud.post('mainCategory', this.category).then((v: any) => {
        if (v) {
          this.categorys.push(v);
          this.addShow = false;
          this.crud.get('mainCategory/count').then((count: any) => {
            if (!count) {return; }
            this.lengthPagination = count.count;
          });
          this.uploadObj = {};
          this.category = {
            name: '',
            img: ''
          };
        }
      });
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
    this.formCheck();
    this.editObjCopy.img = this.editObjCopy.img ? this.editObjCopy.img.split("--")[1] : '';
    this.addShow = false;
    this.editShow = true;
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
    if (this.uploadObj && this.uploadObj['name']) {
      this.crud.post('upload2', {body: this.uploadObj}, null, false).then((v: any) => {
        if (!v) {return; }
        this.editObj.img = v.file;
        this.editObjCopy.img = v.file;
        this.editShow = false;
        this.confirmEditCategoryCrud();
      });
    } else {
      this.confirmEditCategoryCrud();
    }
  }
  confirmEditCategoryCrud() {
    this.crud.post('mainCategory', this.editObjCopy, this.editObj['_id']).then((v: any) => {
      if (v) {
        this.categorys[this.crud.find('_id', this.editObj['_id'], this.categorys)] = v;
        this.editShow = false;
        this.editObj = {
          name: '',
          img: ''
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
      img: ''
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
