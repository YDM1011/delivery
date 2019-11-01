import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {CrudService} from "../../crud.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss']
})
export class EditAddressComponent implements OnInit {
  public language: string;
  public cities;
  public id;
  public address = {
    city: '',
    img: '',
    name: '',
    street: '',
    build: '',
    department: '',
    comment: '',
  };
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private crud: CrudService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.init();
    });
    this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    });

  }
  init() {
    this.crud.get('shopAddress', this.id).then((v: any) => {
      if (!v) {return; }
      this.address = v;
      this.crud.getCity().then((v: any) => {
        this.cities = v;
      });
    });
  }
  onFs(body) {
    this.address.img = null;
    setTimeout(() => {
      this.address.img = body.file;
    }, 0);
  }
  save(e) {
    e.preventDefault();
    this.crud.post('shopAddress', this.address, this.id).then((v: any) => {
      if (!v) {return; }
      this.router.navigate(['/' + this.language + '/my-address']);
    });
  }
  select(e) {
    this.address.city = e.value;
  }
  removeImg() {
    delete this.address.img;
    this.address.img = '';
  }
}
