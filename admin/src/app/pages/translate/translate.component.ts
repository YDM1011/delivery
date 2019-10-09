import { Component, OnInit } from '@angular/core';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent implements OnInit {
  objectKeys = Object.keys;
  public filterInput = '';
  public words;
  public ln;
  public lnObj = {ua: '', ru: ''};
  public activeWord;
  public loaded = false;
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.crud.get('translator').then((v: any) => {
      if (v) {
        this.words = v;
        this.loaded = true;
      }
    }).catch( e => console.log(e));
  }
  remove(i) {
    this.crud.delete('translator', this.words[i]._id).then((v: any) => {
      if (v) {
        this.words.splice(i, 1);
      }
    }).catch( e => console.log(e));
  }
  addTranslate(data) {
    this.activeWord = data;
    this.lnObj.ru = this.words[data].ru;
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
      }).catch( e => console.log(e));
    }).catch( e => console.log(e));
    this.activeWord = null;
  }

}
