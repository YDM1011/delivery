import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss']
})
export class CategoryItemComponent implements OnInit, OnDestroy {
  @Input() obj;
  public language: string;
  public _subscription: Subscription[] = [];
  constructor(
      private auth: AuthService
  ) { }

  ngOnInit() {
    this._subscription.push(this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    }))
  }
  ngOnDestroy(){
    this._subscription.forEach((item) => {
      item.unsubscribe();
    })
  }
}
