import { Pipe, PipeTransform } from '@angular/core';
import {AuthService} from "../auth.service";

@Pipe({
  name: 'rating'
})
export class RatingPipe implements PipeTransform {
  public language;
  constructor(
      private auth: AuthService
  ){
    this.auth.onLanguage.subscribe((v:any) =>{
      if (v) {
        this.language = v
      }
    })
  }
  transform(value: any, args?: any): any {
    let res = "";
    value = parseInt(value);
    switch (value) {
      case 1: res = `${this.language === 'ru' ? 'Ужасно' : 'Жахливо'}`;
        break;
      case 2: res = `${this.language === 'ru' ? 'Плохо' : 'Погано'}`;
        break;
      case 3: res = `${this.language === 'ru' ? 'Нормально' : 'Нормально'}`;
        break;
      case 4: res = `${this.language === 'ru' ? 'Хорошо' : 'Добре'}`;
        break;
      case 5: res = `${this.language === 'ru' ? 'Отлично' : 'Відмінно'}`;
        break;
      default: break;
    }
    return res;
  }

}
