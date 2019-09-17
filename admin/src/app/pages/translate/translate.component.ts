import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../../../aplication/src/app/auth.service";

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
      private auth: AuthService,
      private router: Router
  ) { }

  ngOnInit() {
    this.auth.onTranslate.subscribe((v: any) => {
      if (v) {
        this.words = v;
        this.loaded = true;
      }
    });
  }

  addTranslate(data) {
    this.activeWord = data;
    this.lnObj.ua = data;
    this.lnObj.ru = this.words[data].ru;
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
