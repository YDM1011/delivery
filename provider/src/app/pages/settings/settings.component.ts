import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";
import {AuthService} from "../../auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public user;
  public companyCopy;
  public company;
  public city;
  public uploadObj;
  public cityChoose;
  public isBlok: boolean = false;

  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) {return; }
      this.user = Object.assign({}, v);
      this.company = this.user.companies[0];
      this.companyCopy = Object.assign({}, this.user.companies[0]);
      if (!this.company.city) {
        this.company['city'] = null;
        this.companyCopy['city'] = '';
        return;
      }
      this.cityChoose = this.company.city;
      this.cityChoose = this.company.city;
    });
    this.crud.get('city').then((v: any) => {
      if (!v) {return; }
      this.city = v;
    });
  }
  create() {
    if (this.company.img === this.companyCopy.img) {
      this.crud.post('company', this.companyCopy, this.company._id).then((v: any) => {
        this.user.companies[0] = v;
        this.company = this.user.companies[0];
        this.auth.setMe(this.user);
        this.formCheck();
      });
    } else {
      if (!this.uploadObj) {
        Swal.fire('Error', 'Поле с картинкой не может быть пустым', 'error').then();
        return;
      }
      this.crud.post('upload2', {body: this.uploadObj}).then((u: any) => {
        if (u) {
          this.company['img'] = u.file;
          this.crud.post('company', this.companyCopy, this.company._id).then((v: any) => {
            this.user.companies[0] = v;
            this.company = this.user.companies[0];
            this.auth.setMe(this.user);
            this.formCheck();
          });
        }
      });
    }
  }
  onFs(e) {
    this.uploadObj = e;
    console.log(this.companyCopy);
    this.companyCopy.img = e.name;
    this.formCheck();
  }
  changeCity(o) {
    this.companyCopy['city'] = o;
    this.formCheck();
  }
  validate() {
    let isTrue = false;
    for (const key in this.company) {
      if (this.company[key] !== this.companyCopy[key]) {isTrue = true; }
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
