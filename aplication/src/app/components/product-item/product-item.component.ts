import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  public count: number = 0;
  public language: string;
  constructor(
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    })
  }
  increment(){
    this.count ++;
  }
  decrement(){
    if (this.count === 0) return;
    this.count --;
  }

  alert(text){
    alert(text)
  }
}
