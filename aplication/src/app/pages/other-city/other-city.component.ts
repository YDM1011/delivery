import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-other-city',
  templateUrl: './other-city.component.html',
  styleUrls: ['./other-city.component.scss']
})
export class OtherCityComponent implements OnInit {
  public language;
  public phone;
  public cityplaceholder = {
    ru: 'Город',
    ua: 'Місто'
  };

  public translate ={
    title: {
      ru: 'Другой город',
      ua: 'Інше місто'
    },
    p1: {
      ru: 'Не нашли свой город в списке?',
      ua: 'Не знайшли своє місто в списку?'
    },
    pmain: {
      ru: 'Мы активно работаем и расширяемся. Надеемся, что в скором времени в Вашем районе тоже будет выбор. Оставьте свой номер телефона и мы отправим Вам сообщение как будем готовы!',
      ua: 'Ми активно працюємо і розширюємося. Сподіваємося, що незабаром у Вашому районі теж буде вибір. Залиште свій номер телефону і ми відправимо Вам повідомлення як будемо готові!'
    },
    subscribe: {
      ru: 'Подписаться',
      ua: 'Підписатися'
    }
  };
  constructor(
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    })
  }

  phoneOutput(e) {
    this.phone = e;
  }

}
