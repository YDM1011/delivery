import { Component, OnInit } from '@angular/core';
import {CrudService} from '../../crud.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  public addCityShow: boolean = false;
  public editCityShow: boolean = false;
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

  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('city').then((v: any) => {
      if (!v) return;
      this.citys = v;
    });
  }

  createCity() {
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
          this.uploadObj = {};
          this.city = {
            img: '',
            name: ''
          };
        }
      });
    });
  }

  deleteCity(i) {
    this.crud.delete('city', this.citys[i]['_id']).then((v: any) => {
      if (v) {
        this.citys.splice(i, 1);
      }
    });
  }
  onFs(e) {
    this.uploadObj = e;
    this.city.img = e.name;
  }

  editCity(i) {
    this.editObj = Object.assign({}, this.citys[i]);
    this.addCityShow = false;
    this.editCityShow = true;
  }
  confirmEditCity() {
    if (this.uploadObj && this.uploadObj['name']) {
      this.crud.post('upload2', {body: this.uploadObj}).then((v: any) => {
        if (!v) return;
        this.editObj.img = v.file;
      });
    }
    this.crud.post('city', this.editObj, this.editObj['_id']).then((v: any) => {
      if (v) {
        this.editCityShow = false;
        this.citys[this.crud.find('_id', this.editObj['_id'], this.citys)] = v;
        console.log(v);
      }
    });
  }
  onFsEdit(e) {
    this.uploadObj = e;
    this.editObj.img = e.name;
  }

}
