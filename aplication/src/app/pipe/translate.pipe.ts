import {Pipe, PipeTransform} from '@angular/core';
import {AuthService} from '../auth.service';
import {CrudService} from "../crud.service";

@Pipe({
  name: 'trans',
  pure: true
})
export class TranslatePipe implements PipeTransform {
  public lang: string = 'ua';
  private check: boolean = false;
  private value;
  public obj: any = {};
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) {
    this.auth.onTranslate.subscribe(v => {
      if (v) {
        this.obj = v;
      }
    });
    this.auth.onLanguage.subscribe((v: string) => {
      if (!v) return;
      this.lang = v;
    });
  }

  transform(value: any, args?: any): any {
    if (!value) return;
    this.value = value;
    this.check = false;
    return this.translate();
  }
  translate() {
    if (!this.obj[String(this.value)]) return this.newWord(this.value);
    if (this.obj[String(this.value)] && this.obj[String(this.value)][this.lang]) {
      return this.obj[String(this.value)][this.lang];
    } else {
      return this.value;
    }
  }

  newWord(v) {
    this.obj[String(this.value)] = {ru: this.value, ua: this.value};
    // this.crud.post('translator', {value: v}, '');
    return this.value;
  }
}
