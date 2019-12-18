import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss']
})
export class PhoneComponent implements OnInit {
  @Input() other: boolean;
  @Input() number: string;
  @Output() phone = new EventEmitter();
  @ViewChild('firstInput', {static: false}) firstInput: ElementRef;
  @ViewChild('secondInput', {static: false}) secondInput: ElementRef;
  @ViewChild('thirdInput', {static: false}) thirdInput: ElementRef;
  public firstModel = '';
  public secondModel = '';
  public thirdModel = '';
  public phoneNumber = '';
  public mainPhone = '';
  constructor() { }

  ngOnInit() {
    if (this.number) {
      if (this.other){
        this.number = this.number.slice(1,10);
      }
      this.mainPhone = this.number;
      this.firstModel = this.number.slice(0, 2);
      this.secondModel = this.number.slice(2, 5);
      this.thirdModel = this.number.slice(5, 9);
      this.phoneNumber = '+380' + this.firstModel + this.secondModel  + this.thirdModel;
    }
  }
  splitPhone() {
    this.firstModel = this.mainPhone.slice(0, 2);
    this.secondModel = this.mainPhone.slice(2, 5);
    this.thirdModel = this.mainPhone.slice(5, 9);
    this.phoneNumber = '+380' + this.firstModel + this.secondModel  + this.thirdModel;
    this.phone.emit(this.phoneNumber);
  }
}
