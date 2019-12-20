import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-all',
  templateUrl: './product-all.component.html',
  styleUrls: ['./product-all.component.scss']
})
export class ProductAllComponent implements OnInit, OnDestroy {
  public language;
  public id;
  public loading = false;
  public orders = [];
  public translate ={
    title: {
      ru: 'Товары',
      ua: 'Товари'
    }
  };
  private _subscription: Subscription[] = [];
  constructor(
      private route: ActivatedRoute,
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this._subscription.push(this.route.params.subscribe((params: any) => {
      this.id = this.route.snapshot.paramMap.get('id');
      if (!this.id) return;
      this.init()
    }));
    this._subscription.push(this.auth.onLanguage.subscribe((l: any) => {
      if (l) {
        this.language = l;
      }
    }));

  }
  init(){
    if (this.id === 'top'){
      this.crud.getTopProduct(0, 5, true).then((v: any) => {
        if (v) {
          this.orders = v;
          this.loading = true;
        }
      });
    } else {
      this.crud.getTopProduct(0, 5, false).then((v: any) => {
        if (v) {
          this.orders = v;
          this.loading = true;
        }
      });
    }

  }
  output(e) {
    if (e) {
      this.orders.concat(e);
    }
  }

  ngOnDestroy() {
    this._subscription.forEach((item) => {
      item.unsubscribe();
    });
    this.id = ''
  }
}
