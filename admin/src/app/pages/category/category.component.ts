import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CrudService} from "../../crud.service";
import Swal from "sweetalert2";
import {MatPaginator, MatTableDataSource} from "@angular/material";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, AfterViewInit {
  public defLang = 'ru-UA';
  public showPagin: boolean = false;
  public addShow: boolean = false;
  public editShow: boolean = false;
  public categorys = [];
  public page = {pageSize:5,pageIndex:0};
  public editObj = {
    name: '',
  };
  public category = {
    name: ''
  };

  displayedColumns: string[] = ['Номер', 'Назва бренда', 'data', 'delete'];
  dataSource = new MatTableDataSource(this.categorys);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
      private crud: CrudService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.crud.get('mainCategory').then((v: any) => {
      if (!v) return;
      this.categorys = v;
      this.dataSource = new MatTableDataSource(this.categorys);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.chackDataLength();
    }).catch( e => console.log(e));
  }

  create() {
    if (this.category.name === '') {
      Swal.fire('Error', 'Название категории не может быть пустым', 'error');
      return;
    }
    this.crud.post('mainCategory', this.category).then((v: any) => {
      if (v) {
        this.categorys.push(v);
        this.dataSource = new MatTableDataSource(this.categorys);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
        this.category = {
          name: ''
        };
        this.addShow = false;
      }
    }).catch( e => console.log(e));
  }

  delete(i) {
    this.crud.delete('mainCategory', this.categorys[i]['_id']).then((v: any) => {
      if (v) {
        this.categorys.splice(i, 1);
        this.dataSource = new MatTableDataSource(this.categorys);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.chackDataLength();
      }
    }).catch( e => console.log(e));
  }
  edit(i) {
    this.editObj = Object.assign({}, this.categorys[i]);
    this.addShow = false;
    this.editShow = true;
  }
  confirmEdit(id) {
      this.confirmEditCategoryCrud(id);
  }
  confirmEditCategoryCrud(id) {
    if (this.editObj.name === '') {
      Swal.fire('Error', 'Название категории не может быть пустым', 'error');
      return;
    }
    this.crud.post('mainCategory', {name: this.editObj['name']}, id).then((v: any) => {
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
    }).catch( e => console.log(e));
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
    if (this.categorys.length > 0 ) {
      this.showPagin = true;
    } else {
      this.showPagin = false;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
