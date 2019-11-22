import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public loading: boolean = false;
  public showPagin: boolean = false;
  public addShow: boolean = false;
  public isBlok: boolean = false;
  public editShow: boolean = false;
  public uploadObj = {};
  public citys = [];
  public defLang = 'ru-UA';
  public editObjCopy;
  public editObj = {
    img: '',
    name: '',
  };
    public city = {
    img: '',
    name: ''
  };
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('city/count').then((count: any) => {
      if (!count) {return; }
      this.lengthPagination = count.count;
      this.crud.get(`city?skip=0&limit=${this.pageSizePagination}`).then((v: any) => {
        if (!v) {return; }
        this.citys = v;
        this.loading = true;
      });
    });
  }

  create() {
    if (this.city.name === '') {
        Swal.fire('Error', 'Название города не может быть пустым', 'error').then();
        return;
    }
    if (this.city.img === '') {
        Swal.fire('Error', 'Картинка города не может быть пуста', 'error').then();
        return;
    }
    this.city.name = this.city.name.trim();
    this.crud.post('city', this.city).then((v: any) => {
      if (v) {
        this.addShow = false;
        this.citys.unshift(v);
        this.city = {
          img: '',
          name: ''
        };
        this.crud.get('city/count').then((count: any) => {
          if (!count) {return; }
          this.lengthPagination = count.count;
        });
      }
    });
  }

  delete(i) {
    this.crud.delete('city', this.citys[i]['_id']).then((v: any) => {
      if (v) {
        this.citys.splice(i, 1);
        this.crud.get('city/count').then((count: any) => {
          if (!count) {return; }
          this.lengthPagination = count.count;
        });
      }
    });
  }
  onFs(e) {
    this.city.img = e.file;
  }

  onFsEdit(e) {
    this.editObjCopy.img = e.file;
    this.formCheck();
  }
  edit(i) {
    this.editObj = Object.assign({}, this.citys[i]);
    this.editObjCopy = Object.assign({}, this.editObj);
    this.formCheck();
    this.editObjCopy.img = this.editObjCopy.img ? this.editObjCopy.img.split("--")[1] : '';
    this.addShow = false;
    this.editShow = true;
  }
  confirmEdit() {
    if (this.uploadObj && this.uploadObj['name']) {
      this.crud.post('upload2', {body: this.uploadObj}, null, false).then((v: any) => {
        if (!v) {return; }
        this.editObj.img = v.file;
        this.editObjCopy.img = v.file;
        this.confirmEditCityCrud();
        this.editShow = false;
      });
    } else {
      this.confirmEditCityCrud();
    }
  }
  confirmEditCityCrud() {
    if (this.editObj.name === '') {
      Swal.fire('Error', 'Название города не может быть пустым', 'error').then();
      return;
    }
    if (this.editObjCopy.img === '') {
      Swal.fire('Error', 'Картинка города не может быть пуста', 'error').then();
      return;
    }
    this.editObj.img = this.editObjCopy.img;
    this.editObj.name = this.editObj.name.trim();
    this.crud.post('city', this.editObj, this.editObj['_id']).then((v: any) => {
      if (v) {
        this.editShow = false;
        this.citys[this.crud.find('_id', this.editObj['_id'], this.citys)] = v;
        this.uploadObj = {};
        this.editObj = {
          img: '',
          name: ''
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
    this.city = {
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
      this.crud.get(`city?skip=0&limit=${this.pageSizePagination}`).then((v: any) => {
        if (!v) {return; }
        this.citys = v;
      });
    } else {
      this.citys = e;
    }
  }
  pageEvent(e) {
    this.crud.get(`city&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}`).then((c: any) => {
      if (!c) {return; }
      this.citys = c;
    });
  }
}
