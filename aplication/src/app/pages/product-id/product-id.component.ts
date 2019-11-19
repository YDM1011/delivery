import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Me} from '../../interfaces/me';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-product-id',
  templateUrl: './product-id.component.html',
  styleUrls: ['./product-id.component.scss']
})
export class ProductIDComponent implements OnInit {
  public language;
  public count = 0;
  public favoriteShow;
  public id;
  public me: Me;
  public product;
  public company;
  public loading = false;
  public categorys = [];
  public translate ={
    title: {
      ru: 'Адреса доставки',
      ua: 'Адреси доставки'
    },
    description: {
      ru: 'Описание',
      ua: 'Опис'
    },
    by_now: {
      ru: 'Купить сейчас',
      ua: 'Купити зараз'
    },
    withProduct: {
      ru: 'С этим товаром покупают',
      ua: 'З цим товаром купують'
    },
    basket: {
      ru: 'В корзину',
      ua: 'До кошика'
    },
    count: {
      ru: 'Количество',
      ua: 'Кількість'
    }
  };
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private route: ActivatedRoute,
      private router: Router,
      private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.init();
    });
    this.auth.onMe.subscribe((v: any) => {
      this.me = v;
      if (this.me && this.me.favoriteProduct && (this.me.favoriteProduct.indexOf(this.id) > -1)) {
        this.favoriteShow = true;
      }
    });
  }
  init() {
    this.crud.getDetailProduct(this.id).then((v: any) => {
      if (v) {
        this.product = v;
        this.crud.getDetailCompany(this.product.companyOwner).then((v: any) => {
          if (v) {
            this.company = v;
          }
        });
        this.loading = true;
        this.crud.get(`order?query={"companyOwner":"${this.product.companyOwner}","categoryOwner":"${this.product.categoryOwner}"}&skip=0&limit=5`).then((v: any) => {
          if (v && v.length > 0) {
            this.categorys = v;
            const index = this.crud.find('_id', this.id, this.categorys);
            if (this.categorys[index]) {
              this.categorys.splice(index, 1);
            }
          }
        });
      }
    });
  }

  favorite() {
    this.crud.favoriteProduct({productId: this.id}).then((v: any) => {
      if (v) {
        this.me.favoriteProduct = v;
        if (v && (v.indexOf(this.id) > -1)) {
          this.favoriteShow = true;
          return;
        }
        this.favoriteShow = false;
      }
    });
  }
  increment() {
    this.count ++;
  }
  decrement() {
    if (this.count === 0) {return; }
    this.count --;
  }
  addProduct(id) {
    this.crud.post('product', {orderOwner: id, count: this.count}).then((v: any) => {
      if (v) {
        this.count = 0;
        this.auth.setCheckBasket(true);
        this.openSnackBar('Товар додан в корзину',  'Ok');
      }
    });
  }
  byNow(id){
    console.log(id)
    this.crud.post('product', {orderOwner: id, count: this.count}).then((v: any) => {
      if (v) {
        this.count = 0;
        this.auth.setConfirmOrder(v)
        this.router.navigate(['/' + this.language + '/basket']);
        // this.auth.setCheckBasket(true);
        // this.openSnackBar('Товар додан в корзину',  'Ok');
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
