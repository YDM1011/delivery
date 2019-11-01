import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-address',
  templateUrl: './new-address.component.html',
  styleUrls: ['./new-address.component.scss']
})
export class NewAddressComponent implements OnInit {
  public language: string;
  public cities;
  public address = {
    city: '',
    img: '',
    name: '',
    street: '',
    build: '',
    department: '',
    comment: '',
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private router: Router
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.crud.getCity().then((v: any) => {
      this.cities = v;
      this.address.city = this.cities[0]._id;
    });
  }
  onFs(body) {
    this.address.img = null;
    setTimeout(() => {
      this.address.img = body.file;
    }, 0);
  }
  save(e) {
    e.preventDefault();
    this.crud.post('shopAddress', this.address).then((v: any) => {
      if (!v) {return; }
      this.router.navigate(['/' + this.language + '/my-address']);
    });
  }
  select(e) {
    console.log(e.value);
  }
  removeImg() {
    delete this.address.img;
    this.address.img = '';
  }
}
