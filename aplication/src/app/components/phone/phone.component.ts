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
      this.mainPhone = this.number;
      this.firstModel = this.number.slice(0, 3);
      this.secondModel = this.number.slice(3, 6);
      this.thirdModel = this.number.slice(6, 10);
      this.phoneNumber = '+38' + this.firstModel + this.secondModel  + this.thirdModel;
    }
  }
  splitPhone() {
    this.firstModel = this.mainPhone.slice(0, 3);
    this.secondModel = this.mainPhone.slice(3, 6);
    this.thirdModel = this.mainPhone.slice(6, 10);
    this.phoneNumber = '+38' + this.firstModel + this.secondModel  + this.thirdModel;
    this.phone.emit(this.phoneNumber);
  }
  // keyPressFirst() {
  //   this.phoneNumber = '+38' + this.firstModel + this.secondModel  + this.thirdModel;
  //   if (this.firstModel.length > 2 ) {
  //     this.secondInput.nativeElement.focus();
  //     this.secondModel = '';
  //   }
  // }
  // keyPressSecond(e) {
  //   this.phoneNumber = '+38' + this.firstModel + this.secondModel  + this.thirdModel;
  //   if (e.keyCode === 8 && this.secondModel.length === 0) {
  //     this.firstInput.nativeElement.focus();
  //   }
  //   if (this.secondModel.length > 2) {
  //     this.thirdInput.nativeElement.focus();
  //     this.thirdModel = '';
  //   }
  //   console.log(this.phoneNumber);
  // }
  // keyPressThird(e) {
  //   this.phoneNumber = '+38' + this.firstModel + this.secondModel + this.thirdModel;
  //   this.phone.emit(this.phoneNumber);
  //   if (e.keyCode === 8 && this.thirdModel.length === 0) {
  //     this.secondInput.nativeElement.focus();
  //   }
  //   console.log(this.phoneNumber);
  // }
}
