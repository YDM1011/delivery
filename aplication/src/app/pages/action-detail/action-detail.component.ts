import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth.service';
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-action-detail',
  templateUrl: './action-detail.component.html',
  styleUrls: ['./action-detail.component.scss']
})
export class ActionDetailComponent implements OnInit {
  public id: string;
  public language;
  public action;

  public translate = {
    title: {
      ru: 'Акции',
      ua: 'Акції'
    },
    btn_provider: {
      ru: 'Перейти к поставщику',
      ua: 'Перейти до поставщика'
    },
    btn_product: {
      ru: 'Перейти к продукту',
      ua: 'Перейти до продукту'
    },
    btn_back: {
      ru: 'Назад',
      ua: 'Назад'
    }
  };
  constructor(
      private route: ActivatedRoute,
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.getAction(this.id);
    });
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }
  getAction(id) {
    this.crud.get(`action?query={"_id":"${id}"}&populate={"path":"companyOwner","select":"name img"}`).then((v: any) => {
      if (v) {
        this.action = v[0];
      }
    });
  }
  back() {
    window.history.back();
  }
}
