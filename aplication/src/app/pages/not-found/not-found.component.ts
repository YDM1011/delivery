import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  public language: string;
  public lottieConfig: Object;
  private anim: any;

  constructor(
      public auth: AuthService
  ) {
    this.lottieConfig = {
      path: './assets/not-found.json',
      renderer: 'svg',
      width:300,
      height:400,
      autoplay: true,
      loop: false,
      rendererSettings: {
        className: 'svg-not-found'
      }
    };
  }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

}
