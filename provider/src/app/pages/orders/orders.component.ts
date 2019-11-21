import {Component, OnDestroy, OnInit} from '@angular/core';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

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
  public dateStart = new Date();
  public dateEnd = new Date();
  public newStart;
  public newEnd;
  private _subscription: Subscription[] = [];
  constructor(
      private crud: CrudService,
      private auth: AuthService,
      private router: Router
  ) { }

  ngOnInit() {
    this.dateStart.setDate(this.dateStart.getDate() -1);
    this.router.navigate(['/orders']);
    this._subscription.push(this.auth.onWsOrder.subscribe((ws: any) => {
      if (ws) {
        const index = this.crud.find('_id', ws._id, this.orders);
        if (typeof index === 'number') {
          this.orders[index] = ws;
        } else {
          ws['new'] = true;
          this.orders.unshift(ws);
          setTimeout(()=> {
            this.orders[0]['new'] = false;
          },10000)
        }
      }
    }));
    this._subscription.push(this.auth.onMe.subscribe((me: any) => {
      if (!me) {return; }
      this.user = me;
      if (this.user && this.user.companyOwner) {
        this.crud.get(`basket/count?query={"companyOwner":"${this.user.companyOwner._id}","status":1}`).then((count: any) => {
          if (count) {
            this.lengthPagination = count.count;
            this.crud.get(`basket?query={"companyOwner":"${this.user.companyOwner._id}","status":1}&populate=[{"path":"deliveryAddress","populate":"city","select":"name build street department img"},{"path":"manager","select":"name"},{"path":"createdBy","select":"mobile name"}]&sort={"date":-1}`).then((orders: any) => {
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
    this.newStart = new Date(this.dateStart.getMonth()+1+'.'+(this.dateStart.getDate()) +'.'+new Date().getFullYear()).getTime();
    this.newEnd = new Date(this.dateEnd.getMonth()+1+'.'+(this.dateEnd.getDate()+1) +'.'+new Date().getFullYear()).getTime()-1;
    this.activePage = e ? e : 0;
    if (e === 0) {
      if (this.user && this.user.companyOwner) {
        this.tab0(0, this.pageSizePagination);
      }
    }
    if (e === 1) {
      this.loading = false;
      if (this.user && this.user.companyOwner) {
        this.tab1(0, this.pageSizePagination);
      }
    }
    if (e === 2) {
      this.loading = false;
      if (this.user && this.user.companyOwner) {
        this.tab2(0, this.pageSizePagination);
      }
    }
    if (e === 3) {
      this.loading = false;
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
    this.crud.get(`basket/count?query={"companyOwner":"${this.user.companyOwner._id}"}`).then((count: any) => {
      if (count) {
        this.lengthPagination = count.count;
        this.crud.get(`basket?query={"companyOwner":"${this.user.companyOwner._id}", "status":1}&populate=[{"path":"deliveryAddress","populate":"city","select":"name build street department img"},{"path":"manager","select":"name"},{"path":"createdBy","select":"mobile name"}]&skip=${skip}&limit=${limit}&sort={"date":-1}`).then((orders: any) => {
          if (!orders) {return; }
          this.orders = orders;
          this.loading = true;
        });
      }
    });
  }
  tab1(skip, limit) {
    this.crud.get(`basket/count?query={"companyOwner":"${this.user.companyOwner._id}","date":{"$gte":"${new Date(this.newStart).toISOString()}","$lte":"${new Date(this.newEnd).toISOString()}"},"$or":[{"status":2},{"status":3}]}`).then((count: any) => {
      if (count) {
        this.lengthPagination = count.count;
        this.crud.get(`basket?query={"companyOwner":"${this.user.companyOwner._id}","date":{"$gte":"${new Date(this.newStart).toISOString()}","$lte":"${new Date(this.newEnd).toISOString()}"},"$or":[{"status":2},{"status":3}]}&populate=[{"path":"deliveryAddress","populate":"city","select":"name build street department img"},{"path":"manager","select":"name"},{"path":"createdBy","select":"mobile name"}]&skip=${skip}&limit=${limit}&sort={"date":-1}`).then((orders: any) => {
          if (!orders) {return; }
          this.orders = orders;
          this.loading = true;
        });
      }
    });
  }
  tab2(skip, limit) {
    this.crud.get(`basket/count?query={"companyOwner":"${this.user.companyOwner._id}","date":{"$gte":"${new Date(this.newStart).toISOString()}","$lte":"${new Date(this.newEnd).toISOString()}"},"$or":[{"status":4},{"status":5}]}`).then((count: any) => {
      if (count) {
        this.lengthPagination = count.count;
        const query = JSON.stringify({companyOwner: this.user.companyOwner._id, date: {$gte:new Date(this.newStart).toISOString(),$lte:new Date(this.newEnd).toISOString()}, $or: [{status: 4}, {status: 5}]});
        this.crud.get(`basket?query=${query}&populate=[{"path":"deliveryAddress","populate":"city","select":"name build street department img"},{"path":"manager","select":"name"},{"path":"createdBy","select":"mobile name"}]&skip=${skip}&limit=${limit}&sort={"date":-1}`).then((orders: any) => {
          if (!orders) {return; }
          this.orders = orders;
          this.loading = true;
        });
      }
    });
  }
  tab3(skip, limit) {
    const queryCount = JSON.stringify({manager: this.user._id,date: {$gte:new Date(this.newStart).toISOString(),$lte:new Date(this.newEnd).toISOString()}, $or: [{status: 2}, {status: 3}]});
    this.crud.get(`basket/count?query=${queryCount}`).then((count: any) => {
      if (count) {
        this.lengthPagination = count.count;
        const query = JSON.stringify({manager: this.user._id,date: {$gte:new Date(this.newStart).toISOString(),$lte:new Date(this.newEnd).toISOString()}, $or: [{status: 2}, {status: 3}]});
        this.crud.get(`basket?query=${query}&populate=[{"path":"deliveryAddress","populate":"city","select":"name build street department img"},{"path":"manager","select":"name"},{"path":"createdBy","select":"mobile name"}]&skip=${skip}&limit=${limit}&sort={"date":-1}`).then((orders: any) => {
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
        const populate = JSON.stringify([{path: 'orderOwner', select: 'name'}, {path: 'createdBy', select: 'name address'}, {path: 'deliveryAddress', populate: {path: 'city'}, select: 'name street build department img' }, {path: 'manager', select: 'name'}, {path: 'createdBy', select: 'mobile name'}]);
        this.crud.get(`basket?query={"_id":"${v._id}"}&populate=${populate}`).then((b: any) => {
          if (b && b.length > 0) {
            this.orders[i] = b[0];
          }
        });
      }
    });
  }
}
