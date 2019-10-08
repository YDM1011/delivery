import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public lengthPagination = 10;
  public pageSizePagination = 10;
  public pageSizeOptionsPagination: number[] = [5, 10, 15];
  public loading = false;
  constructor() { }

  ngOnInit() {
    this.loading = true;
  }
  selectChange(e) {
    this.loading = false;
    setTimeout(() => this.loading = true, 1000);
    if (e === 1) {}
  }

  pageEvent(e) {
    console.log('pag', e);
  }
}
