import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-provider-all',
  templateUrl: './provider-all.component.html',
  styleUrls: ['./provider-all.component.scss']
})
export class ProviderAllComponent implements OnInit {
  public language: string;
  constructor(
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    })
  }
}
