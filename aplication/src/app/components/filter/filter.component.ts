import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../auth.service";
import {Options} from "ng5-slider";
import {CrudService} from "../../crud.service";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() closeFilter = new EventEmitter();
  @Output() onFilter = new EventEmitter();
  public language: string;
  public priceFilter = 0;
  public priceMax;
  public isInit=false;
  public priceMin = 0;
  public sub = [];
  @Input() mainCategory;
  @Input() city;
  options: Options = {
    floor: this.priceFilter,
    ceil: this.priceMax,
  };
  constructor(
      private route: ActivatedRoute,
      private auth: AuthService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    })

    let arr = [];
    if(this.city.links){
      this.city.links.forEach(it=>{
        if (it)
          arr.push({"cityLink":it})
      });
    }

    const query = `?query={"$and":[${arr.length>0 ? JSON.stringify( {$or:arr} ) : {} },{"mainCategory":"${this.mainCategory._id}"}]}
    &sort={price:-1}&limit=1`;
    this.crud.get('order', '',  query).then((max) => {
      this.priceMax = max[0].price;
      this.options = {
        floor: this.priceFilter,
        ceil: this.priceMax,
      };
      this.isInit = true
    });
  }
  closefilter(){
    this.closeFilter.emit(false);
  }
  initfilter(){
    let sub = JSON.stringify( {$or:this.sub});
    this.onFilter.emit(sub);
    this.closeFilter.emit(false);
  }
  priceFilterFunc(){

  }
  getCheckSub(e){
    if (!e.checked) return
    this.sub.push({subCategory:e.source.value});
    console.log(this.sub, {"subCategory":e.source.value})
  }
}
