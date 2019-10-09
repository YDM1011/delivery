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
  public id: string;
  public language: string;
  public companies;
  public showFilter: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private crud: CrudService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.init()
    });
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });

  }
  init(){
    this.auth.onCity.subscribe((city:any) => {
      if (city) {
        this.crud.getBrandName(this.id, city._id).then((companies)=>{
          this.companies = companies;
        }).catch(e=>console.log(e));
      }
    })
  }

  closeFilter(e){
    this.showFilter = e;
  }
}
