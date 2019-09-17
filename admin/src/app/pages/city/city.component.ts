import { Component, OnInit } from '@angular/core';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  public ln = 'ua';
  public citys = [];
  public city = {
    img: 'img',
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
    this.crud.post('city', this.city).then((v: any) => {
      if (v) {
        this.citys.push(this.city);
        this.city = {
          img: '',
          name: ''
        };
      }
    });
  }

}
