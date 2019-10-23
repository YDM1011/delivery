import { Component, OnInit } from '@angular/core';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public user;
  public companyCopy;
  public company;
  public companyId;
  public city;
  public uploadObj;
  public cityChoose;
  public isBlok: boolean = false;
  public loading: boolean = false;

  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) {return; }
      this.user = Object.assign({}, v);
      // this.user.companies[0].img = this.user.companies[0].img ? this.user.companies[0].img.split("--")[1] : '';
      this.companyId = this.user.companyOwner;
      this.crud.get('city').then((v: any) => {
        if (!v) {return; }
        this.city = v;
      });
      this.crud.get('company', this.companyId).then((c: any) => {
        if (c) {
          this.company = Object.assign({}, c);
          this.companyCopy = Object.assign({}, c);
          this.companyCopy.img = this.companyCopy.img ? this.companyCopy.img.split('--')[1] : '';
          if (this.company.city) {
            this.cityChoose = this.company.city;
          }  else {
              this.company['city'] = null;
              this.companyCopy['city'] = null;
          }
          this.loading = true;
        }
      });
    });
  }
  create() {
    if (this.companyCopy.img === '') {
      Swal.fire('Error', 'Заполните поле с картинкой', 'error').then();
      return;
    }
    this.crud.post('company', {name: this.companyCopy.name, city: this.companyCopy.city, companyMobile: this.companyCopy.companyMobile, img: this.company.img}, this.company._id).then((v: any) => {
      this.user.companies[0] = v;
      this.company = Object.assign({}, v);
      this.companyCopy = Object.assign({}, v);
      this.companyCopy.img = this.companyCopy.img ? this.companyCopy.img.split('--')[1] : '';
      this.auth.setMe(this.user);
      this.isBlok = false;
    });
  }
  onFs(e) {
    this.company.img = e.file;
    this.companyCopy.img = e.file.split('--')[1];
    this.formCheck();
  }
  changeCity(o) {
    this.companyCopy['city'] = o;
    this.formCheck();
  }
  validate() {
    let isTrue = false;
    for (const key in this.company) {
      if (this.company[key] !== this.companyCopy[key]) {
        isTrue = true;
      }
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
