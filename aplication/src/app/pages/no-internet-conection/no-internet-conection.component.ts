import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-internet-conection',
  templateUrl: './no-internet-conection.component.html',
  styleUrls: ['./no-internet-conection.component.scss']
})
export class NoInternetConectionComponent implements OnInit {
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;

  constructor() {
    this.lottieConfig = {
      path: 'assets/not-connection.json',
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }
  ngOnInit() {
  }

}
