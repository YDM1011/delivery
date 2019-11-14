import {Component, OnDestroy, OnInit} from '@angular/core';
import {CrudService} from '../../crud.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth.service';
import Swal from 'sweetalert2';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss']
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  public user;
  public id;
  public basket: any;
  public basketCopy;
  public editBasket = false;
  public dialogOpen = false;
  public loading = false;
  public defLang = 'ru-UA';
  private _subscription: Subscription[] = [];
  constructor(
      private crud: CrudService,
      private route: ActivatedRoute,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this._subscription.push(this.auth.onWsOrder.subscribe((ws: any) => {
      if (ws) {
        if (ws._id === this.id) {
          this.refresh();
        }
      }
    }));
    this._subscription.push(this.auth.onMe.subscribe((me: any) => {
      if (!me) {return; }
      this.user = me;
    }));
    this._subscription.push(this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id) {
        this.refresh();
      }
    }));
  }
  ngOnDestroy() {
    this._subscription.forEach(i => i.unsubscribe());
  }
  takeOrder() {
    this.crud.post('basket', {status: 2, manager: this.user._id}, this.basket._id, false).then((v) => {
      if (v) {
        const populate = JSON.stringify([{path: 'products', select: 'price count', populate: {path: 'orderOwner', select: 'name'}}, {path: 'createdBy', select: 'name address'},{path: 'deliveryAddress', populate: {path: 'city'}, select: 'name street build department' }, {path: 'manager', select: 'name'}]);
        this.crud.get(`basket?query={"_id":"${this.id}"}&populate=${populate}`).then((b: any) => {
          if (b && b.length > 0) {
            this.basketCopy = b[0];
          }
        });
      }
    });
  }

  done() {
    if (this.basketCopy.payMethod === 'Наличными') {
      Swal.fire({
        title: 'Заказ был оплачен полностью?',
        type: 'warning',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: true,
        reverseButtons: true,
        cancelButtonText: 'Нет',
        confirmButtonText: 'ДА',
        confirmButtonColor: '#dd4535',
      }).then((result) => {
        if (result.value){
          this.crud.post('basket', {status: 4}, this.basket._id, false).then((v) => {
            if (v) {
              this.basketCopy.status = 4;
            }
          });
        } else {
          this.crud.post('basket', {status: 4, deptor:true}, this.basket._id, false).then((v) => {
            if (v) {
              this.basketCopy.status = 4;
            }
          });
        }
      });
    }
  }
  cancelEdit() {
    this.editBasket = false;
  }
  decrement(i) {
    // this.showDescription();
    let count = this.basket.products[i].count;
    count--;
    if (count < 1) {
      return;
    }
    this.basket.products[i].count--;
    this.crud.post('product', {count: this.basket.products[i].count}, this.basket.products[i]._id, false).then();
    this.refresh();
  }
  increment(i) {
    // this.showDescription();
    let count = this.basket.products[i].count;
    count++;
    if (count > this.basketCopy.products[i].count) {
        Swal.fire({
          title: 'Вы не можете превысить число заказа',
          type: 'info',
          confirmButtonColor: '#748AA1',
          cancelButtonText: 'Назад',
        });
        return;
    }
    this.basket.products[i].count++;
    this.crud.post('product', {count: this.basket.products[i].count}, this.basket.products[i]._id, false).then();
    this.refresh();
  }
  removeProduct(i) {
    if (this.basket.products.length === 1) {
      Swal.fire({
        title: 'Вы уверены что хотите отменить заказ?',
        type: 'warning',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: true,
        reverseButtons: true,
        cancelButtonText: 'Назад',
        confirmButtonText: 'Отменить заказ',
        confirmButtonColor: '#dd4535',
      }).then((result) => {
        if (result.value) {
          this.crud.post('basket', {status: 5}, this.basket._id, false).then((v) => {
            if (v) {
              const populate = JSON.stringify([{path: 'products', select: 'price count', populate: {path: 'orderOwner', select: 'name'}}, {path: 'createdBy', select: 'name address'},{path: 'deliveryAddress', populate: {path: 'city'}, select: 'name street build department' }, {path: 'manager', select: 'name'}]);
              this.crud.get(`basket?query={"_id":"${this.id}"}&populate=${populate}`).then((b: any) => {
                if (b && b.length > 0) {
                  this.basket = Object.assign({}, b[0]);
                  this.editBasket = false;
                  this.refresh();
                }
              });
            }
          });
        }
      });
      return;
    }
    Swal.fire({
      title: 'Вы уверены что хотите удалить продукт c заказа?',
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: true,
      reverseButtons: true,
      cancelButtonText: 'Назад',
      confirmButtonText: 'Удалить продукт',
      confirmButtonColor: '#dd4535',
    }).then((result) => {
      if (result.value) {
        this.crud.delete('product', this.basket.products[i]._id).then((v: any) => {
          if (v) {
            this.basket.products.splice(i, 1);
            this.refresh();
          }
        });
      }
    });
  }
  cancel() {
    Swal.fire({
      title: 'Вы уверены что хотите удалить заказ?',
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: true,
      reverseButtons: true,
      cancelButtonText: 'Назад',
      confirmButtonText: 'Отменить заказ',
      confirmButtonColor: '#dd4535',
    }).then((result) => {
      if (result.value) {
        this.crud.post('basket', {status: 5}, this.basket._id, false).then((v) => {
          if (v) {
            const populate = JSON.stringify([{path: 'products', select: 'price count', populate: {path: 'orderOwner', select: 'name'}}, {path: 'createdBy', select: 'name address'}, {path: 'deliveryAddress', populate: {path: 'city'}, select: 'name street build department' }, {path: 'manager', select: 'name'}]);
            this.crud.get(`basket?query={"_id":"${this.id}"}&populate=${populate}`).then((b: any) => {
              if (b && b.length > 0) {
                this.basket = b[0];
              }
            });
          }
        });
      }
    });
  }
  refresh() {
    const populate = JSON.stringify([{path: 'products', select: 'price count', populate: {path: 'orderOwner', select: 'name'}}, {path: 'createdBy', select: 'name address'}, {path: 'deliveryAddress', populate: {path: 'city'}, select: 'name street build department' }, {path: 'manager', select: 'name'}]);
    this.crud.get(`basket?query={"_id":"${this.id}"}&populate=${populate}`).then((b: any) => {
      if (b && b.length > 0) {
        this.basket = Object.assign({}, b[0]);
        this.basketCopy = Object.assign({}, b[0]);
        this.loading = true;
      }
    });
  }
  showDescription() {
      this.dialogOpen = true;
      if (!this.basketCopy.description) {
        this.basketCopy.description = 'Ваш заказ был изменен, подтвердите изменения';
      }
  }
  descriptionSubmit() {
    this.crud.post('basket', {description: this.basketCopy.description}, this.basket._id, false).then((v: any) => {
      if (v) {
        this.dialogOpen = false;
      }
    });
  }
  confirmDescriptionSubmit() {
    if (!this.basketCopy.description) {
      this.showDescription();
      return;
    }
    this.crud.post('basket', {status: 3, manager: this.user._id}, this.basket._id, false).then((v) => {
      if (v) {
        const populate = JSON.stringify([{path: 'products', select: 'price count', populate: {path: 'orderOwner', select: 'name'}}, {path: 'createdBy', select: 'name address'}, {path: 'deliveryAddress', populate: {path: 'city'}, select: 'name street build department' }, {path: 'manager', select: 'name'}]);
        this.crud.get(`basket?query={"_id":"${this.id}"}&populate=${populate}`).then((b: any) => {
          if (b && b.length > 0) {
            this.basketCopy = b[0];
            this.editBasket = false;
          }
        });
      }
    });
    }
}
