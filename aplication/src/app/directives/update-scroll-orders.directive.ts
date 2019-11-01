import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {CrudService} from "../crud.service";

@Directive({
  selector: '[appUpdateScrollOrders]'
})
export class UpdateScrollOrdersDirective implements AfterViewInit {
  @Input() userId;
  @Input() type;
  @Output() output = new EventEmitter();
  public skip = 1;
  public elem: ElementRef;
  public scroll;
  public count = 0;
  public triger = true;

  constructor(
      private el: ElementRef,
      private crud: CrudService
  ) {
    this.elem = el;
  }

  ngAfterViewInit() {
    const block = this.elem.nativeElement;
    if (this.type === 'new') {
      this.crud.get(`basket/count?query={"createdBy":"${this.userId}","$or":[{"status":1},{"status":2},{"status":3}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name"}]`).then((count: any) => {
        if (count) {
          this.count = count.count;
        }
      });
    }
    if (this.type === 'old') {
      this.crud.get(`basket/count?query={"createdBy":"${this.userId}","$or":[{"status":4},{"status":5}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name"}]`).then((count: any) => {
        if (count) {
          this.count = count.count;
        }
      });
    }
    block.onscroll = e => {
      if ((e.srcElement.scrollTop + (e.target.offsetHeight * 1.2) > e.target.scrollHeight) && this.triger) {
        this.triger = false;
        this.upload();
      }
    };
  }
  upload() {
    if (this.count <= this.skip * 5) {return; }
    if (this.type === 'new') {
      this.crud.get(`basket?query={"createdBy":"${this.userId}","$or":[{"status":1},{"status":2},{"status":3}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name"}]&skip={${this.skip * 5}&limit=5&sort={"date":-1}`).then((v: any) => {
        if (v) {
          this.skip++;
          this.triger = true;
          this.output.emit(v);
        }
      });
    }

    if (this.type === 'old') {
      this.crud.get(`basket?query={"createdBy":"${this.userId}","$or":[{"status":4},{"status":5}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name"}]&skip=${this.skip * 5}&limit=5&sort={"date":-1}`).then((v: any) => {
        if (v) {
          this.skip++;
          this.triger = true;
          this.output.emit(v);
        }
      });
    }
  }
}