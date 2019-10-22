import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit {
  public language: string;
  public favoriteShow;
  public id;
  public me;
  public company;
  public activeCategoryId;
  public activeBrandsId;
  public showCategory = true;
  public showBrands = false;
  public loading = false;
  public products = {};
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.init();
    });
    this.auth.onMe.subscribe((v: string) => {
      this.me = v;
      if (this.me && this.me.favoriteCompany && (this.me.favoriteCompany.indexOf(this.id) > -1)) {
        this.favoriteShow = true;
      }
    });
  }
  init() {
    this.crud.getDetailCompany(this.id, this.company).then((v: any) => {
      if (v) {
        this.company = v;
        console.log(this.company);
        if (this.company && this.company.categories.length > 0) {
          this.activeCategoryId = this.company.categories[0]._id;
          this.loading = true;
        }
      }
    });
  }
  favoriteCompany() {
    this.crud.favoriteCompany({companyId: this.id}).then((v: any) => {
      if (v) {
        this.me.favoriteCompany = v;
        if (v && (v.indexOf(this.id) > -1)) {
          this.favoriteShow = true;
          return;
        }
        this.favoriteShow = false;
      }
    });
  }
  activeCategory(id) {
    this.showCategory = true;
    this.showBrands = false;
    this.activeCategoryId = id;
  }
  activeBrands(id) {
    this.showBrands = true;
    this.showCategory = false;
    this.activeBrandsId = id;
  }
}
