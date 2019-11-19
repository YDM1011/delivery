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
  public language;
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
          this.crud.post('signin', {login: this.data.login, pass: this.data.pass, role: 'client'}).then((user: any) => {
            if (user) {
              localStorage.setItem('userId', user.userId);
              localStorage.setItem('token', user.token);
              this.auth.setMe(user.user);
              this.route.navigate(['']);
            }
          })
        }
      });
    }
  }
}
