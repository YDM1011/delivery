import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {Me} from "../../interfaces/me";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  public language: string;
  public toggleMain: boolean = true;
  public favoriteCompany = [];
  public favoriteProduct = [];
  public me:Me;
  constructor(
      private auth: AuthService,
      private crud: CrudService,
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.auth.onMe.subscribe(v=>{
      if (!v) return;
      this.me = v;
      console.log(this.me)
      let fcs = [];
      let fps = [];
      this.me.favoriteCompany.forEach(it=>{
        fcs.push(JSON.stringify({_id: it}))
      });
      this.me.favoriteProduct.forEach(it=>{
        fps.push(JSON.stringify({_id: it}))
      });
      const queryComp = `?query={"$or":[${fcs}]}`;
      const queryProd = `?query={"$or":[${fps}]}`;
      if (fcs.length>0){
        this.crud.get('company', '', queryComp).then((v:any)=>{
          this.favoriteCompany = v;
        });
      }
      if (fps.length>0){
        this.crud.get('order', '', queryProd).then((v:any)=>{
          this.favoriteProduct = v;
        })
      }

    });
  }

}
