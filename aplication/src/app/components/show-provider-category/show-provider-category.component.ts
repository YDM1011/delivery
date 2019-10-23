import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {CrudService} from '../../crud.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-show-provider-category',
  templateUrl: './show-provider-category.component.html',
  styleUrls: ['./show-provider-category.component.scss']
})
export class ShowProviderCategoryComponent implements OnInit, OnChanges {
  @Input() catId;
  public id;
  public products = [];
  constructor(
     private crud: CrudService,
     private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.products = [];
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      const query = `?query={"companyOwner":"${this.id}","categoryOwner":"${this.catId}"}&limit=5&skip=0`;
      this.crud.get('order', '', query).then(v => {
        if (v) {
          this.products = this.products.concat(v);
        }
      });
    });
  }
  getOutput(e) {
    if (e) {
      this.products = this.products.concat(e);
    }
  }
}
