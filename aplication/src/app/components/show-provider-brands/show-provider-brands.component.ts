import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {CrudService} from "../../crud.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-show-provider-brands',
  templateUrl: './show-provider-brands.component.html',
  styleUrls: ['./show-provider-brands.component.scss']
})
export class ShowProviderBrandsComponent implements OnInit, OnChanges {
  @Input() brandId;
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
      const query = `?query={"companyOwner":"${this.id}","brand":"${this.brandId}"}&limit=1&skip=0`;
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
