import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let res = "Status";
    // let res = un know value ${value};
    value = parseInt(value);
    switch (value) {
      case 1: res = '<div class="status__title active">Активное</div>';
        break;
      case 2: res = '<div class="status__title confirm">Подтвердждено</div>';
        break;
      case 3: res = '<div class="status__title edit">Изменено менеджером, ожидайте подтверждения от клиента</div>';
        break;
      case 4: res = '<div class="status__title done">Готово</div>';
        break;
      case 5: res = '<div class="status__title remove">Отменено</div>';
        break;
      default: break;
    }
    return res;
  }
}
