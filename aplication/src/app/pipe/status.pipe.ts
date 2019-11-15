import { Pipe, PipeTransform } from '@angular/core';
import {AuthService} from "../auth.service";

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {
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
    let res = "Status";
    value = parseInt(value);
    switch (value) {
      case 1: res = `<span class="lamp active"></span> ${this.language === 'ru' ? 'В обработке' : 'В обробці'}`;
        break;
      case 2: res = `<span class="lamp confirm"></span> ${this.language === 'ru' ? 'Подтвердждено' : 'Підтверджено'}`;
        break;
      case 3: res = `<span class="lamp edit"></span> ${this.language === 'ru' ? 'Изменено менеджером' : 'Змінено менеджером'}`;
        break;
      case 4: res = `<span class="lamp done"></span>Готово`;
        break;
      case 5: res = `<span class="lamp remove"></span> ${this.language === 'ru' ? 'Отменено' : 'Відмінено'}`;
        break;
      default: break;
    }
    return res;
  }
}
