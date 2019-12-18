import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-work-time',
  templateUrl: './work-time.component.html',
  styleUrls: ['./work-time.component.scss']
})
export class WorkTimeComponent implements OnInit {
  @Input() data;
  public detail = false;
  public language;
  public translate = {
    ru: 'График работы',
    ua: 'Графік роботи'
  };
  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    })
  }
  show(e){
    e.stopPropagation();
    this.detail = !this.detail
  }
  close() {
    this.detail = !this.detail;
  }
}
