import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../auth.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-brand-item',
  templateUrl: './brand-item.component.html',
  styleUrls: ['./brand-item.component.scss']
})
export class BrandItemComponent implements OnInit, OnDestroy {
  @Input() obj;
  public language: string;
  private _subscription: Subscription[] = [];
  constructor(
      private auth: AuthService
  ) { }

  ngOnInit() {
    this._subscription.push(this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    }))
  }

  ngOnDestroy() {
    this._subscription.forEach((item) => {
      item.unsubscribe();
    })
  }
}
