import {Component, OnDestroy, OnInit} from '@angular/core';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  public lengthPagination = 0;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public activePage = 0;
  public loading = false;
  public orders = [];
  public defLang = 'ru-UA';
  public user = null;
  private _subscription: Subscription[] = [];
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this._subscription.push(this.auth.onWsOrder.subscribe((ws: any) => {
      if (ws) {
        const index = this.crud.find('_id', ws._id, this.orders);
        if (typeof index === 'number') {
          this.orders[index] = ws;
        } else {
          this.orders.unshift(ws);
        }
      }
    }));
    this._subscription.push(this.auth.onMe.subscribe((me: any) => {
      if (!me) {return; }
      this.user = me;
      if (this.user && this.user.companyOwner) {
        this.crud.get(`basket/count?query={"companyOwner":"${this.user.companyOwner}","status":1}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
            this.crud.get(`basket?query={"companyOwner":"${this.user.companyOwner}","status":1}&populate=[{"path":"deliveryAddress","populate":"city","select":"name build street department"},{"path":"manager","select":"name"}]&sort={"date":-1}`).then((orders: any) => {
              if (!orders) {return; }
              this.orders = orders;
              this.loading = true;
            });
          }
        });
      }
    }));
  }
  ngOnDestroy() {
    this._subscription.forEach((item) => {
      item.unsubscribe();
    })
  }
  selectChange(e) {
    this.loading = false;
    this.activePage = e;
    if (e === 0) {
      if (this.user && this.user.companyOwner) {
        this.tab0(0, this.pageSizePagination);
      }
    }
    if (e === 1) {
      if (this.user && this.user.companyOwner) {
        this.tab1(0, this.pageSizePagination);
      }
    }
    if (e === 2) {
      if (this.user && this.user.companyOwner) {
        this.tab2(0, this.pageSizePagination);
      }
    }
    if (e === 3) {
      if (this.user && this.user.companyOwner) {
        this.tab3(0, this.pageSizePagination);
      }
    }
  }

  pageEvent(e) {
    this.pageSizePagination = e.pageSize;
    if (this.activePage === 0) {
      this.tab0(e.pageIndex  * e.pageSize, e.pageSize);
    }
    if (this.activePage === 1) {
      this.tab1(e.pageIndex  * e.pageSize, e.pageSize);
    }
    if (this.activePage === 2) {
      this.tab2(e.pageIndex  * e.pageSize, e.pageSize);
    }
    if (this.activePage === 3) {
      this.tab3(e.pageIndex  * e.pageSize, e.pageSize);
    }
  }
  tab0(skip, limit) {
    this.crud.get(`basket/count?query={"companyOwner":"${this.user.companyOwner}"}`).then((count: any) => {
      if (count) {
        this.lengthPagination = count.count;
        this.crud.get(`basket?query={"companyOwner":"${this.user.companyOwner}", "status":1}&populate=[{"path":"deliveryAddress","populate":"city","select":"name build street department"},{"path":"manager","select":"name"}]&skip=${skip}&limit=${limit}&sort={"date":-1}`).then((orders: any) => {
          if (!orders) {return; }
          this.orders = orders;
          this.loading = true;
        });
      }
    });
  }
  tab1(skip, limit) {
    this.crud.get(`basket/count?query={"companyOwner":"${this.user.companyOwner}", "$or":[{"status":2},{"status":3}]}`).then((count: any) => {
      if (count) {
        this.lengthPagination = count.count;
        this.crud.get(`basket?query={"companyOwner":"${this.user.companyOwner}", "$or":[{"status":2},{"status":3}]}&populate=[{"path":"deliveryAddress","populate":"city","select":"name build street department"},{"path":"manager","select":"name"}]&skip=${skip}&limit=${limit}&sort={"date":-1}`).then((orders: any) => {
          if (!orders) {return; }
          this.orders = orders;
          this.loading = true;
        });
      }
    });
  }
  tab2(skip, limit) {
    this.crud.get(`basket/count?query={"companyOwner":"${this.user.companyOwner}", "$or":[{"status":4},{"status":5}]}`).then((count: any) => {
      if (count) {
        this.lengthPagination = count.count;
        const query = JSON.stringify({companyOwner: this.user.companyOwner, $or: [{status: 4}, {status: 5}]});
        this.crud.get(`basket?query=${query}&populate=[{"path":"deliveryAddress","populate":"city","select":"name build street department"},{"path":"manager","select":"name"}]&skip=${skip}&limit=${limit}&sort={"date":-1}`).then((orders: any) => {
          if (!orders) {return; }
          this.orders = orders;
          this.loading = true;
        });
      }
    });
  }
  tab3(skip, limit) {
    const queryCount = JSON.stringify({manager: this.user._id, $or: [{status: 2}, {status: 3}]});
    this.crud.get(`basket/count?query=${queryCount}`).then((count: any) => {
      if (count) {
        this.lengthPagination = count.count;
        const query = JSON.stringify({manager: this.user._id, $or: [{status: 2}, {status: 3}]});
        this.crud.get(`basket?query=${query}&populate=[{"path":"deliveryAddress","populate":"city","select":"name build street department"},{"path":"manager","select":"name"}]&skip=${skip}&limit=${limit}&sort={"date":-1}`).then((orders: any) => {
          if (!orders) {return; }
          this.orders = orders;
          this.loading = true;
        });
      }
    });
  }
  takeOrder(e, i) {
    e.stopPropagation();
    this.crud.post('basket', {status: 2, manager: this.user._id}, this.orders[i]._id, false).then((v: any) => {
      if (v) {
        const populate = JSON.stringify([{path: 'orderOwner', select: 'name'}, {path: 'createdBy', select: 'name address'}, {path: 'deliveryAddress', populate: {path: 'city'}, select: 'name street build department' }, {path: 'manager', select: 'name'}]);
        this.crud.get(`basket?query={"_id":"${v._id}"}&populate=${populate}`).then((b: any) => {
          if (b && b.length > 0) {
            this.orders[i] = b[0];
          }
        });
      }
    });
  }
}
