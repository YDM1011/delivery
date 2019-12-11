import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  @Output() output = new EventEmitter();
  @Input() inputApi;
  @Input() inputQuery;
  @Input() queryValue = null;
  @Input() querySearch = null;
  @Input() populate = null;
  public filterInput = '';
  public search = [];
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
  }

  filterSearch() {
    if (this.filterInput.length > 0) {
      if (this.queryValue) {
        const query = JSON.stringify({$regex: this.filterInput, $options: 'gi'});
        this.crud.get(`${this.inputApi}?query={"${this.inputQuery}":${query}, "${this.queryValue}":"${this.querySearch}"}&populate={"path":"${this.populate}"}&skip=0&limit=5`).then((v: any) => {
          if (v) {
            this.search = v;
            this.output.emit(this.search);
          }
        });
      } else {
        const query2 = JSON.stringify({$regex: this.filterInput, $options: 'gi'});
        this.crud.get(`${this.inputApi}?query={"${this.inputQuery}":${query2}}&populate={"path":${this.populate}&skip=0&limit=5`).then((v: any) => {
          if (v) {
            this.search = v;
            this.output.emit(this.search);
          }
        });
      }
    }
    else {
      this.output.emit([]);
    }
  }
}
