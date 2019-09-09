import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-product-id',
  templateUrl: './product-id.component.html',
  styleUrls: ['./product-id.component.scss']
})
export class ProductIDComponent implements OnInit {
  public language: string;
  public favorite: boolean = false;
  public count: number = 0;
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
}
