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
          this.company = c;
          this.companyCopy = Object.assign({}, this.company);
          this.companyCopy.img = this.companyCopy.img ? this.companyCopy.img.split('--')[1] : null;
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
    if (this.company.img === this.companyCopy.img) {
      delete  this.companyCopy.img;
      this.crud.post('company', this.companyCopy, this.company._id).then((v: any) => {
        this.user.companies[0] = v;
        this.company = v;
        this.auth.setMe(this.user);
        this.formCheck();
      });
    } else {
      this.crud.post('company', this.company, this.company._id).then((v: any) => {
        this.user.companies[0] = v;
        this.company = v;
        this.companyCopy.img = v.img.split('--')[1];
        this.auth.setMe(this.user);
      });
    }
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
