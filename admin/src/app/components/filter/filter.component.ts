import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() output = new EventEmitter();
  @Input() query:string;
  @Input() populate:string;
  @Input() apiName;
  @Input() inputQuery;
  @Input() sort:string = null;
  public filterInput = '';
  public search = [];
  constructor(
      private crud: CrudService
  ) { }

  ngOnInit() {
  }

  filterSearch(){
    const query = JSON.stringify({
      $regex: this.filterInput,
      $options: 'gi'
    });
    if(this.filterInput.length>0){
      this.crud.get(`${this.apiName}?query={"${this.inputQuery}":${query}${this.query?','+this.query:''}}&populate=${this.populate}&sort={${this.sort?this.sort:''}}&skip=0&limit=5`).then((v:any) => {
        if (v) {
          this.output.emit(v);
        }
      })
    } else {
      this.output.emit(null);
    }
  }

}
