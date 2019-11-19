import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-rating-service-item',
  templateUrl: './rating-service-item.component.html',
  styleUrls: ['./rating-service-item.component.scss']
})
export class RatingServiceItemComponent implements OnInit {
  public language;
  @Input() data;
  public title = {
    ru: 'Оцените сервис поставщика',
    ua: 'Оцініть сервіс постачальника'
  };
  public button_t = {
    ru: '',
    ua: ''
  };
  constructor(
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }


}
