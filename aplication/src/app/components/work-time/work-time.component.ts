import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-work-time',
  templateUrl: './work-time.component.html',
  styleUrls: ['./work-time.component.scss']
})
export class WorkTimeComponent implements OnInit {
  @Input() data;
  public detail = false;
  constructor() { }

  ngOnInit() {
  }
  show(){
    this.detail = !this.detail
  }
}
