import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-lang-tab',
  templateUrl: './lang-tab.component.html',
  styleUrls: ['./lang-tab.component.scss']
})
export class LangTabComponent implements OnInit {
  @Input() defLang = 'ua';
  @Output() onLang = new EventEmitter();
  public langs = [{
    name: 'українська',
    value: 'ua'
  },
    {
    name: 'Російська',
    value: 'ru'
  }];
  constructor() { }

  ngOnInit() {
    this.onLang.emit(this.defLang);
  }

  checkLan(ln) {
    this.defLang = ln;
    this.onLang.emit(ln);
  }

}
