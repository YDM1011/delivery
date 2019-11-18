import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  public token = null;
  public language: string;
  @Input() data;
  public translate ={
    title: {
      ru: 'Подтверждение',
      ua: 'Підтвердження'
    },
    input: {
      ru: 'Введите код из смс',
      ua: 'Введіть код з смс'
    },
    btn: {
      ru: 'Подтвердить',
      ua: 'Підтвердити'
    }
  };
  constructor(
      private crud: CrudService,
      private auth: AuthService,
      private route: Router
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }
  confirm() {
    if (this.data) {
      this.crud.confirmAuth(this.data).then((v: any) => {
        if (v) {
          localStorage.setItem('userId', v.userId);
          localStorage.setItem('token', v.token);
          this.auth.setMe(v.user);
          this.route.navigate(['']);
        }
      });
    }
  }
}
