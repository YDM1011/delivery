import {Component, Input, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})
export class ImgComponent implements OnInit {
  @Input() fs;
  @Input() product;
  public domain = environment.domain;
  constructor() { }

  ngOnInit() {
  }

}
