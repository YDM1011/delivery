import { Component, OnInit } from '@angular/core';
import {CrudService} from '../../crud.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss']
})
export class OrdersDetailComponent implements OnInit {
  public user;
  public id;
  public basket;
  public editBasket = false;
  public defLang = 'ru-UA';
  constructor(
      private crud: CrudService,
      private route: ActivatedRoute,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((me: any) => {
      if (!me) {return; }
      this.user = me;
    });
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id) {
        const populate = JSON.stringify([{path: 'products', select: 'price count', populate: {path: 'orderOwner', select: 'name'}}, {path: 'createdBy', select: 'name address'}, {path: 'manager', select: 'name'}]);
        this.crud.get(`basket?query={"_id":"${this.id}"}&populate=${populate}`).then((b: any) => {
          if (b && b.length > 0) {
            this.basket = Object.assign({}, b[0]);
          }
        });
      }
    });
  }

  takeOrder() {
    this.crud.post('basket', {status: 2, manager: this.user._id}, this.basket._id, false).then((v) => {
      if (v) {
        const populate = JSON.stringify([{path: 'products', select: 'price count', populate: {path: 'orderOwner', select: 'name'}}, {path: 'createdBy', select: 'name address'}, {path: 'manager', select: 'name'}]);
        this.crud.get(`basket?query={"_id":"${this.id}"}&populate=${populate}`).then((b: any) => {
          if (b && b.length > 0) {
            this.basket = b[0];
          }
        });
      }
    });
  }
  saveChanges() {
    console.log(this.basket);
    // this.crud.post('basket', this.basket, this.basket._id, false).then((v) => {
    //   if (v) {
    //     const populate = JSON.stringify([{path: 'products', select: 'price count', populate: {path: 'orderOwner', select: 'name'}}, {path: 'createdBy', select: 'name address'}, {path: 'manager', select: 'name'}]);
    //     this.crud.get(`basket?query={"_id":"${this.id}"}&populate=${populate}`).then((b: any) => {
    //       if (b && b.length > 0) {
    //         this.basket = Object.assign({}, b[0]);
    //       }
    //     });
    //   }
    // });
  }
  edit() {
    this.editBasket = true;
  }

  done() {
    this.crud.post('basket', {status: 4}, this.basket._id, false).then((v) => {
      if (v) {
        const populate = JSON.stringify([{path: 'products', select: 'price count', populate: {path: 'orderOwner', select: 'name'}}, {path: 'createdBy', select: 'name address'}, {path: 'manager', select: 'name'}]);
        this.crud.get(`basket?query={"_id":"${this.id}"}&populate=${populate}`).then((b: any) => {
          if (b && b.length > 0) {
            this.basket = b[0];
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
      cancelButtonText: 'Cancel!',
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dd4535',
    }).then((result) => {
      if (result.value) {
        this.crud.post('basket', {status: 5}, this.basket._id, false).then((v) => {
          if (v) {
            const populate = JSON.stringify([{path: 'products', select: 'price count', populate: {path: 'orderOwner', select: 'name'}}, {path: 'createdBy', select: 'name address'}, {path: 'manager', select: 'name'}]);
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
}
