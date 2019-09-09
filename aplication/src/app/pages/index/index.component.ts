import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  public language: string;
  public toggleMain: boolean = true;
  constructor(
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }
  // mySlideImages = [1,2,3].map((i)=> `./assets/images/tmp/img-deli.png`);
  // mySlideOptions={items: 1, dots: false, nav: false, autoplay: true};
}
