import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusDetailProvider'
})
export class StatusDetailProviderPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let res = "Status";
    value = parseInt(value);
    switch (value) {
      case 1: res = '<span>Активное</span>';
        break;
      case 2: res = '<span>Подтвердждено</span>';
        break;
      case 3: res = '<span>Изменено менеджером</span>';
        break;
      case 4: res = '<span>Готово</span>';
        break;
      case 5: res = '<span>Отменено</span>';
        break;
      default: break;
    }
    return res;
  }
}
