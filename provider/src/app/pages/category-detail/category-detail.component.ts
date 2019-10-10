import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public loading = false;
  public brands = [];
  public id = null;
  public user: any;
  public categoryID;
  public defLang = 'ru-UA';
  public addShow = false;
  public editShow = false;
  public products = [];
  public editObj;

  constructor(
      private crud: CrudService,
      private auth: AuthService,
      private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((u: any) => {
      if (!u) {return; }
      this.user = u;
    });
    this.crud.get('brand?select=["name"]').then((b: any) => {
      if (!b) {return; }
      this.brands = b;
    });
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id) {
        this.crud.get(`category`, this.id).then((c: any) => {
          if (c) {
            this.categoryID = c;
            this.loading = true;
          }
        });
        this.crud.get(`order/count?query={"categoryOwner":"${this.id}"}`).then((c: any) => {
          if (c.count > 0) {
            this.lengthPagination = c.count;
            this.crud.get(`order?query={"categoryOwner":"${this.id}"}&skip=0&limit=${this.pageSizePagination}`).then((v: any) => {
              if (!v || v.length === 0) {return; }
              this.products = v;
            });
          }
        });
      }
    });
  }
  delete(i) {
    this.crud.delete('order', this.products[i]._id).then((v: any) => {
      if (v) {
        this.products.splice(i, 1);
      }
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
  outputEdit(e) {
    if (e) {
      this.products[this.crud.find('_id', e._id, this.products)] = e;
      this.editShow = false;
    }
  }
  newProduct(e) {
    if (e) {
      this.products.push(e);
      this.addShow = false;
    }
  }

  pageEvent(e) {
    this.crud.get(`order?query={"categoryOwner":"${this.id}"}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}`).then((p: any) => {
      if (!p) {
        return;
      }
      this.products = p;
      this.loading = true;
    });
  }
}
