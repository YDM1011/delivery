import {Component, Input, OnInit} from '@angular/core';
import {CrudService} from '../../crud.service';
import {Router} from '@angular/router';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  public token = null;
  public language: string;
  @Input() data;
  constructor(
      private crud: CrudService,
      private auth: AuthService,
      private route: Router
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }
  confirm() {
    console.log(this.data);
    if (this.data) {
      this.crud.confirmAuth(this.data).then((v: any) => {
        localStorage.setItem('userId', v.userId);
        localStorage.setItem('token', v.token);
        this.auth.setMe(v.user);
        this.route.navigate(['']);
      });
    }
  }

}
