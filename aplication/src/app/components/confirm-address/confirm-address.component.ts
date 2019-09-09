import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirm-address',
  templateUrl: './confirm-address.component.html',
  styleUrls: ['./confirm-address.component.scss']
})
export class ConfirmAddressComponent implements OnInit {
  @Output() cancelConfirmAddress = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
