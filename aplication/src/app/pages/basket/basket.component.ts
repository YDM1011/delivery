import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth.service';
import {CrudService} from "../../crud.service";
import {query} from "@angular/animations";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  public id: string;
  public baskets;
  public language: string;
  public removeItem: boolean = false;
  public showConfirm: boolean = false;
  constructor(
      private route: ActivatedRoute,
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.id = this.route.snapshot.paramMap.get('id');
    });
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    const query = `?query={"status":0}&populate={"path":"companyOwner"}`;
    this.crud.get('basket', '', query).then((v:any)=>{
      this.baskets = v;
    })
  }
  removeItembasket(e) {

  }

}
