import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public lengthPagination = 10;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public loading = false;
  public orders = [];
  public defLang = 'ru-UA';
  public user = null;
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((me: any) => {
      if (!me) {return; }
      this.user = me;
      if (this.user && this.user.companyOwner) {
        this.crud.get(`basket/count?query={"companyOwner":"${this.user.companyOwner}"}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
            this.crud.get(`basket?query={"companyOwner":"${this.user.companyOwner}"}&populate=[{"path":"products"}, {"path":"createdBy"}]`).then((orders: any) => {
              if (!orders) {return; }
              this.orders = orders;
              this.loading = true;
            });
          }
        });
      }
    });
  }
  selectChange(e) {
    this.loading = false;
    if (e === 0) {
      if (this.user && this.user.companyOwner) {
        this.crud.get(`basket/count?query={"companyOwner":"${this.user.companyOwner}"}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
            this.crud.get(`basket?query={"companyOwner":"${this.user.companyOwner}", "status":1}&populate=[{"path":"products"}, {"path":"createdBy"}]`).then((orders: any) => {
              if (!orders) {return; }
              this.orders = orders;
              this.loading = true;
            });
          }
        });
      }
    }
    if (e === 1) {
      if (this.user && this.user.companyOwner) {
        this.crud.get(`basket/count?query={"companyOwner":"${this.user.companyOwner}"}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
            this.crud.get(`basket?query={"companyOwner":"${this.user.companyOwner}", "status":1}&populate=[{"path":"products"}, {"path":"createdBy"}]`).then((orders: any) => {
              if (!orders) {return; }
              this.orders = orders;
              this.loading = true;
            });
          }
        });
      }
    }
    if (e === 3) {

    }
  }

  pageEvent(e) {
    console.log('pag', e);
  }

  takeOrder(e, i) {
    e.stopPropagation();
    console.log(this.orders[i]);
  }
}
