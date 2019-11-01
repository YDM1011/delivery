import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";

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

  public snackMessageError = {
    ru: 'Укажите название торговой точки, улицу и дом',
    ua: 'Вкажіть назву торгової точки, вулицю і будинок'
  };
  public snackMessageSuccess = {
    ru: 'Адрес создан',
    ua: 'Адреса створена'
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private router: Router,
      private snackBar: MatSnackBar
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
    if (!this.address.name || !this.address.street || !this.address.build) {
      this.openSnackBar(this.snackMessageError[this.language],  'Ok');
      return;
    }
    e.preventDefault();
    this.crud.post('shopAddress', this.address).then((v: any) => {
      if (!v) {return; }
      this.openSnackBar(this.snackMessageSuccess[this.language],  'Ok');
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
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
