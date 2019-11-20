import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import {animate, state, style, transition, trigger} from "@angular/animations";
import Swal from "sweetalert2";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({transform: 'translateY(-10%)', opacity: 0, overflow: 'hidden', height:0}),
        animate('300ms', style({transform: 'translateY(0)', opacity: 1, height:'570px', overflow: 'hidden'}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0)', opacity: 1, height:'570px', overflow: 'hidden'}),
        animate('300ms', style({transform: 'translateY(-10%)', opacity: 0, overflow: 'hidden', height:0}))
      ]),
    ]),
  ],
})
export class ProductComponent implements OnInit {
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public loading: boolean = false;
  public brands = [];
  public user;
  public companyId;
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
      if (this.user && this.user.companyOwner) {
        this.companyId = this.user.companyOwner._id;
        this.crud.get(`category?query={"companyOwner":"${this.companyId}"}&populate={"path":"mainCategory","select":"subCategory"}`).then((v: any) => {
          if (v && v.length > 0) {
            this.categorys = v;
          }
        });
        this.crud.get(`order/count?query={"companyOwner":"${this.companyId}"}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
            this.crud.get(`order?query={"companyOwner":"${this.companyId}"}&populate={"path":"categoryOwner","populate":"mainCategory","select":"mainCategory subCategory"}&skip=0&limit=${this.pageSizePagination}&sort={"date":-1}`).then((p: any) => {
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
    this.addShow = false;

    if (!this.editShow) {
      this.editShow = true;
    } else {
      this.editShow = false;
      setTimeout(()=>{
        this.editShow = true;
      }, 300)
    }
    this.editObj = this.products[i];

  }
  isTop(obj){
    this.crud.post(`orderTop/${obj._id}`,{isTop: obj.isTop ? false : true}, null, false).then((v: any) => {
      if (v) {
        obj.isTop = v.isTop
      }
    }).catch((error)=>{
      if(error.error === 'no more 3 tops') {
        Swal.fire('Oops...', 'Не больше трех топ продуктов', 'error');
      }
    });
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
        this.crud.get(`order/count?query={"companyOwner":"${this.companyId}"}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
          }
        });
      }
    });
  }

  newProduct(e) {
    if (e) {
      this.crud.get(`order?query={"companyOwner":"${this.companyId}"}&populate={"path":"categoryOwner","populate":"mainCategory","select":"mainCategory subCategory"}&skip=0&limit=${this.pageSizePagination}&sort={"date":-1}`).then((p: any) => {
        if (!p) {return; }
        this.products = p;
        this.loading = true;
      });
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
      this.crud.get(`order?query={"companyOwner":"${this.companyId}"}&populate={"path":"categoryOwner","populate":"mainCategory","select":"mainCategory subCategory"}&skip=0&limit=${this.pageSizePagination}`).then((p: any) => {
        if (!p) {return; }
        this.products = p;
      });
    } else {
      this.products = e;
    }
  }
  pageEvent(e) {
    this.crud.get(`order?query={"companyOwner":"${this.companyId}"}&populate={"path":"categoryOwner","populate":"mainCategory","select":"mainCategory subCategory"}&skip=${e.pageIndex  * e.pageSize}&limit=${e.pageSize}`).then((p: any) => {
      if (!p) {return; }
      this.products = p;
      this.loading = true;
    });
  }
}
