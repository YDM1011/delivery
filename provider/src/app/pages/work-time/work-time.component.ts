import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {CrudService} from '../../crud.service';

@Component({
  selector: 'app-work-time',
  templateUrl: './work-time.component.html',
  styleUrls: ['./work-time.component.scss']
})
export class WorkTimeComponent implements OnInit {
  public time;
  public timeCopy;
  public user;
  public isBlok: boolean = false;
  constructor(
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) {return; }
      this.user = v;
      this.time = Object.assign({}, v.companies[0].workTime);
      this.timeCopy = v.companies[0].workTime;
    });
  }
  setTimeStart(range, v) {
    this.time[range].timeStart = v;
    this.formCheck();
  }
  setTimeEnd(range, v) {
    this.time[range].timeEnd = v;
    this.formCheck();
  }
  saveTime() {
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
      // console.log(key);
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
