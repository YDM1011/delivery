import {Component, OnInit, ViewChild} from '@angular/core';
import Swal from "sweetalert2";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {CrudService} from "../../crud.service";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  public mainCategoryChoose: string;
  public mainCategory;
  public user;
  public defLang = 'ru-UA';
  public showPagin: boolean = false;
  public addShow: boolean = false;
  public editShow: boolean = false;
  public categorys = [];
  public editObj = {
    name: '',
  };
  public category = {
    name: '',
    companyOwner: '',
    orders: [],
    mainCategory: '',
  };

  displayedColumns: string[] = ['Номер', 'Назва бренда', 'data', 'delete'];
  dataSource = new MatTableDataSource(this.categorys);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.crud.get('mainCategory').then((v: any) => {
      if(!v) return;
      this.mainCategory = v;
    });
    this.auth.onMe.subscribe((v: any) => {
      if (!v) return;
      this.user = v;
      this.categorys = this.user.category;
      this.dataSource = new MatTableDataSource(this.categorys);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.chackDataLength();
    });
  }

  create() {
    if (this.category.name === '') {
      Swal.fire('Error', 'Название категории не может быть пустым', 'error');
      return;
    }
    this.category['mainCategory'] = this.mainCategoryChoose;
    this.category['companyOwner'] = this.user.companies[0]._id;
    this.crud.post('company', {categories: this.category}, this.user.companies[0]._id).then((v: any) => {
      if (v) {
        this.categorys.push(this.category);
        this.dataSource = new MatTableDataSource(this.categorys);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
        this.category = {
          name: '',
          companyOwner: '',
          orders: [],
          mainCategory: '',
        };
        this.mainCategoryChoose = null;
        this.addShow = false;
      }
    });
  }

  delete(i) {
    this.crud.delete('mainCategory', this.categorys[i]['_id']).then((v: any) => {
      if (v) {
        this.categorys.splice(i, 1);
        this.dataSource = new MatTableDataSource(this.categorys);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
      }
    });
  }
  edit(i) {
    this.editObj = Object.assign({}, this.categorys[i]);
    this.addShow = false;
    this.editShow = true;
  }
  confirmEdit() {
    this.confirmEditCategoryCrud();
  }
  confirmEditCategoryCrud() {
    if (this.editObj.name === '') {
      Swal.fire('Error', 'Название категории не может быть пустым', 'error');
      return;
    }
    this.crud.post('mainCategory', {name: this.editObj['name']}, this.editObj['_id']).then((v: any) => {
      if (v) {
        this.editShow = false;
        this.categorys[this.crud.find('_id', this.editObj['_id'], this.categorys)] = v;
        this.dataSource = new MatTableDataSource(this.categorys);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
        this.editObj = {
          name: ''
        };
      }
    });
  }
  openAdd() {
    this.addShow = true;
    this.editShow = false;
  }
  cancelAdd() {
    this.addShow = false;
    this.category = {
      name: ''
    };
  }
  cancelEdit() {
    this.editShow = false;
    this.editObj = {
      name: ''
    };
  }

  chackDataLength() {
    if (!this.categorys || this.categorys.length === 0 || this.categorys === undefined) {
      this.showPagin = false;
    } else {
      this.showPagin = true;
    }
  }
  log() {
    console.log(this.mainCategoryChoose)
  }
}
