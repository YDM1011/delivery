import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public loading: boolean = false;
  public brands = [];
  public user;
  public defLang = 'ru-UA';
  public addShow = false;
  public editShow = false;
  public products = [];
  public categorys = [];
  public editObj;

  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) { return; }
      this.user = v;
      if (this.user) {
        this.crud.get(`order/count?query={"companyOwner":"${this.user.companies[0]._id}"}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
            this.crud.get(`order?query={"companyOwner":"${this.user.companies[0]._id}"}&skip=0&limit=${this.pageSizePagination}`).then((p: any) => {
              if (!p) {return; }
              this.products = p;
              this.loading = true;
            });
          }
        });
      }
    });
    this.crud.get('brand?select=["name"]').then((b: any) => {
      if (!b) {return; }
      this.brands = b;
    });
  }
  edit(i) {
    this.editObj = this.products[i];
    this.addShow = false;
    this.editShow = true;
  }
  openAdd() {
    this.addShow = true;
    this.editShow = false;
  }
  cancelAdd(e) {
    this.addShow = false;
  }
  cancelEdit(e) {
    this.editShow = false;
  }
  delete(i) {
    this.crud.delete('order', this.products[i]._id).then((v: any) => {
      if (v) {
        this.products.splice(i, 1);
        this.crud.get(`order/count?query={"companyOwner":"${this.user.companies[0]._id}"}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
          }
        });
      }
    });
  }

  newProduct(e) {
    if (e) {
      this.products.push(e);
      this.addShow = false;
    }
  }

  outputEdit(e) {
    if (e) {
      this.products[this.crud.find('_id', e._id, this.products)] = e;
      this.editShow = false;
    }
  }
  outputSearch(e) {
    if (!e) {
      this.crud.get(`order?query={"companyOwner":"${this.user.companies[0]._id}"}&skip=0&limit=${this.pageSizePagination}`).then((p: any) => {
        if (!p) {return; }
        this.products = p;
      });
    } else {
      this.products = e;
    }
  }
  pageEvent(e) {
    this.crud.get(`order?query={"companyOwner":"${this.user.companies[0]._id}"}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}`).then((p: any) => {
      if (!p) {return; }
      this.products = p;
      this.loading = true;
    });
  }
}
