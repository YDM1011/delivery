import {AfterViewInit, Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {CrudService} from "../../crud.service";
import Swal from "sweetalert2";
import {MatPaginator, MatTableDataSource} from "@angular/material";


@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit, AfterViewInit {
  public defLang = 'ru-UA';
  public showPagin: boolean = false;
  public addShow: boolean = false;
  public editShow: boolean = false;
  public uploadObj = {};
  public brands = [];
  public loaded = false;
  public editObj = {
    img: '',
    name: '',
  };
  public brand = {
    img: '',
    name: ''
  };
  displayedColumns: string[] = ['Номер', 'Назва бренда', 'data', 'delete'];
  dataSource = new MatTableDataSource(this.brands);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
      private crud: CrudService
  ) { }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.crud.get('brand').then((v: any) => {
      if (!v) return;
      this.brands = v;
      this.dataSource = new MatTableDataSource(this.brands);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.chackDataLength();
    }).catch( e => console.log(e));
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
          this.dataSource = new MatTableDataSource(this.brands);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          this.uploadObj = {};
          this.brand = {
            img: '',
            name: ''
          };
          this.addShow = false;
          this.chackDataLength();
        }
      });
    }).catch( e => console.log(e));
  }

  delete(i) {
    this.crud.delete('brand', this.brands[i]['_id']).then((v: any) => {
      if (v) {
        this.brands.splice(i, 1);
        this.dataSource = new MatTableDataSource(this.brands);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
      }
    }).catch( e => console.log(e));
  }
  onFs(e) {
    this.uploadObj = e;
    this.brand.img = e.name;
  }
  edit(i) {
    this.editObj = Object.assign({}, this.brands[i]);
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
        this.dataSource = new MatTableDataSource(this.brands);
        setTimeout(() => this.dataSource.paginator = this.paginator);
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
  chackDataLength() {
    if (this.brands.length > 0 ) {
      this.showPagin = true;
    } else {
      this.showPagin = false;
    }
  }
}
