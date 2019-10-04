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
    if (!localStorage.getItem('userId')) { return; }
    const userId = localStorage.getItem('userId');
    const query = JSON.stringify({_id: userId});
    const populate = JSON.stringify(
        {'path': 'companies', 'populate': ['action', 'collaborators', 'debtors', 'categories']}
    );
    this.crud.get(`client?query=${query}&populate=${populate}`)
        .then((v2: any) => {
          if (!v2) {return; }
          this.auth.setMe(v2[0]);
          console.log(v2[0]);
        });
    this.auth.onMe.subscribe((v: any) => {
      if (v) {
        this.user = v;
      }
    });
  }
}
