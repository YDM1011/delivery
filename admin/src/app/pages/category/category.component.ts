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
  public filterInput = '';
  public showPagin = false;
  public addShow = false;
  public editShow = false;
  public categorys = [];
  public uploadObj;
  public page = {pageSize: 5, pageIndex: 0};
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
    }).catch( e => console.log(e));
  }
  edit(i) {
    this.editObj = Object.assign({}, this.categorys[i]);
    this.addShow = false;
    this.editShow = true;
  }
  confirmEdit(id) {
      this.confirmEditCategoryCrud(id);
  }
  confirmEditCategoryCrud(id) {
    if (this.editObj.name === '') {
      Swal.fire('Error', 'Название категории не может быть пустым', 'error').then();
      return;
    }
    this.crud.post('upload2', {body: this.uploadObj}, null, false).then((v: any) => {
      if (!v) {return; }
      this.category.img = v.file;
      this.category.name =  this.editObj.name;
      this.crud.post('mainCategory', this.category, id).then((v: any) => {
        if (v) {
          this.editShow = false;
          this.categorys[this.crud.find('_id', this.editObj['_id'], this.categorys)] = v;
          this.editObj = {
            name: '',
            img: ''
          };
        }
      });
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
  filterSearch() {
    if (this.filterInput.length > 0) {
      const query = JSON.stringify({name: {$regex: this.filterInput, $options: 'gi'}});
      this.crud.get(`mainCategory?query=${query}&skip=0&limit=10`).then((v: any) => {
        if (v && v.length > 0) {
          this.categorys = v;
        }
      });
    } else {
      this.crud.get(`mainCategory?skip=0&limit=${this.pageSizePagination}`).then((v: any) => {
        if (!v) {return; }
        this.categorys = v;
      });
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
