import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent implements OnInit {
  objectKeys = Object.keys;
  public words;
  public ln;
  public lnObj = {ua: '', ru: ''};
  public activeWord;
  public loaded = false;
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.crud.get('translator').then((v: any) => {
      if (v) {
        this.words = v;
        this.loaded = true;
      }
    });
  }

  addTranslate(data) {
    this.activeWord = data;
    this.lnObj.ru = data;
    this.lnObj.ua = this.words[data].ua;
  }
  checkLang(ln) {
    this.ln = ln;
  }
  setTranslate() {
    this.crud.post('translator', this.lnObj, this.words[this.activeWord].id).then((v: any) => {
      this.lnObj = {ua: '', ru: ''};
      this.crud.get('translator').then((v: any) => {
        if (v) {
          this.words = v;
        }
      });
    });
    this.activeWord = null;
  }

}
