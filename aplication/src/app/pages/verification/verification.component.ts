import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../auth.service";

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
      private route: ActivatedRoute,
      private auth: AuthService
  ) { }

  ngOnInit() {

    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
    this.route.params.subscribe((params: any) => {
      this.token = this.route.snapshot.paramMap.get('token');
      console.log(this.token);
      if (this.token) {
        localStorage.setItem("token", this.token)
      }
    })
  }

}
