import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../auth.service";
import {Options} from "ng5-slider";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() closeFilter = new EventEmitter();
  public language: string;
  public priceFilter = 0;
  public priceMax = 1000;
  public priceMin = 0;
  options: Options = {
    floor: this.priceFilter,
    ceil: this.priceMax,
  };
  constructor(
      private route: ActivatedRoute,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    })
  }
  closefilter(){
    this.closeFilter.emit(false);
  }
  priceFilterFunc(){

  }
}
