import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-brands-id',
  templateUrl: './brands-id.component.html',
  styleUrls: ['./brands-id.component.scss']
})
export class BrandsIDComponent implements OnInit {
  @Input() obj;
  public language: string;
  public id: string;
  public data: any;
  constructor(
    private route: ActivatedRoute,
    private crud: CrudService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.init()
    });

    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    })
  }

  init(){
    this.crud.getDetailBrand(this.id).then(v=>{
      this.data = v;
    })
  }
}
