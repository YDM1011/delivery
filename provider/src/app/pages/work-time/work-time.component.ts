import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-work-time',
  templateUrl: './work-time.component.html',
  styleUrls: ['./work-time.component.scss']
})
export class WorkTimeComponent implements OnInit {
  public time;
  constructor(
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) {return; }
      this.time = v.companies[0].workTime;
    });
  }
  setTimeStart(range, v) {
    this.time[range].timeStart = v;
  }
  setTimeEnd(range, v) {
    this.time[range].timeEnd = v;
  }
}
