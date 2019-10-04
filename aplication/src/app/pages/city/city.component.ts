import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit, OnDestroy {
  public language: string;
  public city;
  private _subscription: Subscription;
  constructor(
      private auth: AuthService,
      private crud: CrudService,
      private router: Router

  ) { }

  ngOnInit() {
    this._subscription = this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.init();
  }


  async init() {
    await this.crud.getCity().then((v: any) => {
      this.city = v;
    });
  }

  changeCity(index){
    this.auth.setCity(this.city[index]);
    this.router.navigate(['/' + this.language])
  }
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
