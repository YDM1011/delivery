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
  public filterInput = '';
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
        Swal.fire('Error', 'Название города не может быть пустым', 'error');
        return;
    }
    if (this.city.img === '') {
        Swal.fire('Error', 'Картинка города не может быть пуста', 'error');
        return;
    }
    this.crud.post('upload2', {body: this.uploadObj}, null, false).then((v: any) => {
      if (!v) {return; }
      this.addShow = false;
      this.city['img'] = v.file;
      this.crud.post('city', this.city).then((v: any) => {
        if (v) {
          this.citys.push(v);
          this.uploadObj = {};
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
    this.uploadObj = e;
    this.city.img = e.name;

  }

  edit(i) {
    this.editObj = Object.assign({}, this.citys[i]);
    this.editObj.img = this.editObj.img ? this.editObj.img.split("--")[1] : '';
    this.editObjCopy = Object.assign({}, this.editObj);
    this.addShow = false;
    this.editShow = true;
  }
  confirmEdit() {
    if (this.uploadObj && this.uploadObj['name']) {
      this.crud.post('upload2', {body: this.uploadObj}).then((v: any) => {
        if (!v) return;
        this.editObj.img = v.file;
        this.confirmEditCityCrud();
      });
    } else {
      this.confirmEditCityCrud();
    }
  }
  onFsEdit(e) {
    this.uploadObj = e;
    this.editObj.img = e.name;
    this.formCheck();
  }
  confirmEditCityCrud() {
    if (this.editObj.name === '') {
      Swal.fire('Error', 'Название города не может быть пустым', 'error');
      return;
    }
    if (this.editObj.img === '') {
      Swal.fire('Error', 'Картинка города не может быть пуста', 'error');
      return;
    }
    this.crud.post('city', this.editObj, this.editObj['_id']).then((v: any) => {
      if (v) {
        this.editShow = false;
        this.citys[this.crud.find('_id', this.editObj['_id'], this.citys)] = v;
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

  pageEvent(e) {
    this.crud.get(`city&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}`).then((c: any) => {
      if (!c) {return; }
      this.citys = c;
    });
  }
}
