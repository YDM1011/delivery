import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss']
})
export class PhoneComponent implements OnInit {
  @Output() phone = new EventEmitter();
  @ViewChild('firstInput', {static: false}) firstInput: ElementRef;
  @ViewChild('secondInput', {static: false}) secondInput: ElementRef;
  @ViewChild('thirdInput', {static: false}) thirdInput: ElementRef;
  public firstModel: string = '';
  public secondModel: string = '';
  public thirdModel: string = '';
  public phoneNumber = '';
  constructor() { }

  ngOnInit() {
  }

  keyPressFirst() {
    this.phoneNumber = '+38' + this.firstModel + this.secondModel  + this.thirdModel;
    if (this.firstModel.length > 2 ) {
      this.secondInput.nativeElement.focus();
    }
  }
  keyPressSecond(e) {
    this.phoneNumber = '+38' + this.firstModel + this.secondModel  + this.thirdModel;
    if (e.keyCode === 8 && this.secondModel.length === 0) {
      this.firstInput.nativeElement.focus();
    }
    if (this.secondModel.length > 2) {
      this.thirdInput.nativeElement.focus();
    }
  }
  keyPressThird(e) {
    this.phoneNumber = '+38' + this.firstModel + this.secondModel + this.thirdModel;
    this.phone.emit(this.phoneNumber);
    if (e.keyCode === 8 && this.thirdModel.length === 0) {
      this.secondInput.nativeElement.focus();
    }
  }
}
