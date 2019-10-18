import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {CrudService} from "../../crud.service";
import {ActivatedRoute} from "@angular/router";

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
    this.route.params.subscribe((params: any) => {
      this.id = this.route.snapshot.paramMap.get('id');
      const query = `?query={"companyOwner":"${this.id}","categoryOwner":"${this.catId}"}&limit=1&skip=0`;
      this.crud.get('order', '', query).then(v => {
        if (v) {
          this.products = this.products.concat(v);
        }
      });
    });
  }

  getProduct(id) {
    const skip = this.products ? this.products.length : 0;
    const query = `?query={"companyOwner":"${this.id}","categoryOwner":"${id}"}&limit=1&skip=${skip}`;
    this.crud.get('order', '', query).then(v => {
      if (v) {
        this.products = this.products.concat(v);
      }
    });
  }
}
