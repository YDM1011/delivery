import {Component, OnDestroy, OnInit} from '@angular/core';
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
      this.timeCopy = Object.assign({}, v.companyOwner.workTime);
      this.time = Object.assign({}, v.companyOwner.workTime);
    });
  }
  setTimeAll(range, v) {
    if (v) {
      this.time[range].isWeekend = false;
      this.time[range].isTimeRange = false;
      this.time[range].isAllTime = true;
      this.saveTime(false);
      return;
    }
    this.time[range].isTimeRange = true;
    this.time[range].isAllTime = false;
    this.saveTime(false);
  }
  setTimeWeekend(range, v) {
    if (v) {
      this.time[range].isAllTime = false;
      this.time[range].isTimeRange = false;
      this.time[range].isWeekend = true;
      this.saveTime(false);
      return;
    }
    this.time[range].isTimeRange = true;
    this.time[range].isWeekend = false;
    this.saveTime(false);
  }
  setTimeStart(range, v) {
    this.time[range].timeStart = v;
    this.isBlok = true;
  }
  setTimeEnd(range, v) {
    this.time[range].timeEnd = v;
    this.isBlok = true;
  }
  saveTime(isAllert = true) {
    this.user.companyOwner.workTime = this.time;
    this.crud.post('company', {workTime: this.time, img: this.user.companyOwner.img}, this.user.companyOwner._id, isAllert).then((v: any) => {
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
