import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CrudService} from '../../crud.service';
import Swal from "sweetalert2";
import {MatPaginator, MatTableDataSource} from "@angular/material";

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit, AfterViewInit{
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
  displayedColumns: string[] = ['Номер', 'Назва бренда', 'data', 'delete'];
  dataSource = new MatTableDataSource(this.citys);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
      private crud: CrudService
  ) { }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.crud.get('city').then((v: any) => {
      if (!v) return;
      this.citys = v;
      this.dataSource = new MatTableDataSource(this.citys);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.chackDataLength();
    }).catch( e => console.log(e));
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
      if (!v) return;
      this.city['img'] = v.file;
      this.crud.post('city', this.city).then((v: any) => {
        if (v) {
          this.citys.push(v);
          this.dataSource = new MatTableDataSource(this.citys);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          this.chackDataLength();
          this.uploadObj = {};
          this.city = {
            img: '',
            name: ''
          };
          this.addShow = false;
        }
      }).catch( e => console.log(e));
    }).catch( e => console.log(e));
  }

  delete(i) {
    this.crud.delete('city', this.citys[i]['_id']).then((v: any) => {
      if (v) {
        this.citys.splice(i, 1);

        this.dataSource = new MatTableDataSource(this.citys);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
      }
    }).catch( e => console.log(e));
  }
  onFs(e) {
    this.uploadObj = e;
    this.city.img = e.name;
  }

  edit(i) {
    this.editObj = Object.assign({}, this.citys[i]);
    this.editObj.img = this.editObj.img.split("--")[1];
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
      }).catch( e => console.log(e));
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

        this.dataSource = new MatTableDataSource(this.citys);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
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
  chackDataLength() {
    if (this.citys.length > 0 ) {
      this.showPagin = true;
      return;
    }
    this.showPagin = false;
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

}
