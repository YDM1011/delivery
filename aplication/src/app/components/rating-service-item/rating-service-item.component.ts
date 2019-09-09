import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-rating-service-item',
  templateUrl: './rating-service-item.component.html',
  styleUrls: ['./rating-service-item.component.scss']
})
export class RatingServiceItemComponent implements OnInit {
  public language: string;

  constructor(
      private auth: AuthService

  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }


}
