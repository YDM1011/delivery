import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-work-time',
  templateUrl: './work-time.component.html',
  styleUrls: ['./work-time.component.scss']
})
export class WorkTimeComponent implements OnInit {
  public timeCopy;
  public user;
  public isBlok: boolean = false;
  public time;
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) {return; }
      this.user = v;
      this.timeCopy = Object.assign({}, v.companies[0].workTime);
      this.time = Object.assign({}, v.companies[0].workTime);
    });
  }
  setTimeAll(range, v) {
    this.isBlok = true;
    // v = !v;
    if (v) {
      this.time[range].isWeekend = false;
      this.time[range].isTimeRange = false;
      this.time[range].isAllTime = true;
      return;
    }
    this.time[range].isTimeRange = true;
    this.time[range].isAllTime = false;
  }
  setTimeWeekend(range, v) {
    this.isBlok = true;
    // v = !v;
    if (v) {
      this.time[range].isAllTime = false;
      this.time[range].isTimeRange = false;
      this.time[range].isWeekend = true;
      return;
    }
    this.time[range].isTimeRange = true;
    this.time[range].isWeekend = false;
  }
  setTimeStart(range, v) {
    this.time[range].timeStart = v;
    this.isBlok = true;
  }
  setTimeEnd(range, v) {
    this.time[range].timeEnd = v;
    this.isBlok = true;
  }
  saveTime() {
    console.log(this.time);
    this.user.companies[0].workTime = this.time;
    this.crud.post('company', {workTime: this.time}, this.user.companies[0]._id).then((v: any) => {
      if (v) {
        this.auth.setMe(this.user);
      }
    });
  }

  validate() {
    let isTrue = false;
    for (const key in this.time) {
      if (this.time[key] !== this.timeCopy[key]) {isTrue = true; }
    }
    return isTrue;
  }
  btnBlok(is) {
    this.isBlok = is;
  }

  formCheck() {
    this.btnBlok(this.validate());
  }
}
