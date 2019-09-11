import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  public language: string;
  public phone;
  constructor(
      private auth: AuthService,
      private router: Router
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    })
  }

  signin(){
    localStorage.setItem('userId', '3');
    this.router.navigate(['/'+this.language])
  }
  phoneOutput(e) {
    this.phone = e.value;
    console.log(this.phone)
  }
}
