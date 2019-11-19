import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-action-item',
  templateUrl: './action-item.component.html',
  styleUrls: ['./action-item.component.scss']
})
export class ActionItemComponent implements OnInit {
  @Input() obj;
  public language;

  constructor(
      private auth: AuthService

  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });
  }

}
