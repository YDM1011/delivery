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
      case 1: res = '<span class="lamp active"></span>В обработке';
        break;
      case 2: res = '<span class="lamp confirm"></span>Подтвердждено';
        break;
      case 3: res = '<span class="lamp edit"></span>Изменено менеджером';
        break;
      case 4: res = '<span class="lamp done"></span>Готово';
        break;
      case 5: res = '<span class="lamp remove"></span>Отменено';
        break;
      default: break;
    }
    return res;
  }
}
