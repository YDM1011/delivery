import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public user;
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) {
        this.crud.get(`client?query="${localStorage.getItem('userId')}"&populate={"path": "companies"}`).then((v: any) => {
          if (!v) return;
          this.auth.setMe(v[0]);
          console.log(v[0]);
        });
      }
      this.user = v;
    });
  }
}
