import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  public lottieConfig: object;
  private anim: any;
  constructor() {
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
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

}
