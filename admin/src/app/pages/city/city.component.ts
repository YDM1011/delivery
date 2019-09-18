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
  public editShow: boolean = false;
  public uploadObj = {};
  public citys = [];
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
    this.crud.post('upload2', {body: this.uploadObj}).then((v: any) => {
      if (!v) return;
      this.city['img'] = v.file;
      this.crud.post('city', this.city).then((v: any) => {
        if (v) {
          this.citys.push(this.city);
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
      });
    });
  }

  delete(i) {
    this.crud.delete('city', this.citys[i]['_id']).then((v: any) => {
      if (v) {
        this.citys.splice(i, 1);

        this.dataSource = new MatTableDataSource(this.citys);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
      }
    });
  }
  onFs(e) {
    this.uploadObj = e;
    this.city.img = e.name;
  }

  edit(i) {
    this.editObj = Object.assign({}, this.citys[i]);
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
  chackDataLength() {
    if (this.citys.length > 0 ) {
      this.showPagin = true;
    } else {
      this.showPagin = false;
    }
  }
}
