import {Component, OnInit} from '@angular/core';
import {CrudService} from "../../crud.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public defLang = 'ru-UA';
  public showPagin: boolean = false;
  public addShow: boolean = false;
  public editShow: boolean = false;
  public uploadObj = {};
  public brands = [];
  public loading = false;
  public editObj = {
    img: '',
    name: '',
  };
  public brand = {
    img: '',
    name: ''
  };
  constructor(
      private crud: CrudService
  ) { }
  ngOnInit() {
    this.crud.get('brand/count').then((count: any) => {
      if (count) {
        this.lengthPagination = count.count;
        this.crud.get(`brand?skip=0&limit=${this.pageSizePagination}`).then((v: any) => {
          if (!v) {return; }
          this.brands = v;
          this.loading = true;
        });
      }
    });
  }

  create() {
    if (this.brand.name === '') {
      Swal.fire('Error', 'Название бренда не может быть пустым', 'error');
      return;
    }
    if (this.brand.img === '') {
      Swal.fire('Error', 'Картинка бренда не может быть пуста', 'error');
      return;
    }
    this.crud.post('upload2', {body: this.uploadObj}).then((v: any) => {
      if (!v) return;
      this.brand['img'] = v.file;
      this.crud.post('brand', this.brand).then((v: any) => {
        if (v) {
          this.brands.push(v);
          this.uploadObj = {};
          this.brand = {
            img: '',
            name: ''
          };
          this.addShow = false;
        }
      });
    }).catch( e => console.log(e));
  }

  delete(i) {
    this.crud.delete('brand', this.brands[i]['_id']).then((v: any) => {
      if (v) {
        this.brands.splice(i, 1);
        this.crud.get('brand/count').then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
          }
        });
      }
    });
  }
  onFs(e) {
    this.uploadObj = e;
    this.brand.img = e.name;
  }
  edit(i) {
    this.editObj = Object.assign({}, this.brands[i]);
    this.editObj.img = this.editObj.img.split("--")[1];
    this.addShow = false;
    this.editShow = true;
  }
  confirmEdit() {
    if (this.uploadObj && this.uploadObj['name']) {
      this.crud.post('upload2', {body: this.uploadObj}).then((v: any) => {
        if (!v) {return; }
        this.editObj.img = v.file;
        this.confirmEditCityCrud();
      }).catch( e => console.log(e));
    } else {
      this.confirmEditCityCrud();
    }
  }
  onFsEdit(e) {
    this.uploadObj = e;
    this.editObj.img = e.name;
  }
  confirmEditCityCrud() {
    if (this.editObj.name === '') {
      Swal.fire('Error', 'Название бренда не может быть пустым', 'error');
      return;
    }
    if (this.editObj.img === '') {
      Swal.fire('Error', 'Картинка в бренда не может быть пуста', 'error');
      return;
    }
    this.crud.post('brand', this.editObj, this.editObj['_id']).then((v: any) => {
      if (v) {
        this.editShow = false;
        this.brands[this.crud.find('_id', this.editObj['_id'], this.brands)] = v;
        this.editObj = {
          img: '',
          name: ''
        };
        this.uploadObj = {};
      }
    }).catch( e => console.log(e));
  }

  openAdd() {
    this.addShow = true;
    this.editShow = false;
  }
  cancelAdd() {
    this.addShow = false;
    this.brand = {
      img: '',
      name: ''
    };
  }
  cancelEdit() {
    this.editShow = false;
    this.editObj = {
      img: '',
      name: ''
    };
  }
  pageEvent(e) {
    this.crud.get(`brand&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}`).then((b: any) => {
      if (!b) {
        return;
      }
      this.brands = b;
    });
  }
}
