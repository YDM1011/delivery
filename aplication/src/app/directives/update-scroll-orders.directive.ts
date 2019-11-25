import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {CrudService} from "../crud.service";

@Directive({
  selector: '[appUpdateScrollOrders]'
})
export class UpdateScrollOrdersDirective implements AfterViewInit {
  @Input() userId;
  @Input() type;
  @Input() dateStart;
  @Input() dateEnd;
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
    let dateS = null;
    let dateE = null;
    if (this.dateStart && this.dateEnd){
      dateS = new Date(this.dateStart.getTime() - this.dateStart.getHours()*60*60*1000 - this.dateStart.getMinutes()*60*1000  - this.dateStart.getSeconds()*1000).getTime();
      dateE = new Date(this.dateEnd.getTime() - this.dateEnd.getHours()*60*60*1000 - this.dateEnd.getMinutes()*60*1000  - this.dateEnd.getSeconds()*1000).getTime();
    }
    if (this.type === 'new') {
      this.crud.get(`basket/count?query={"createdBy":"${this.userId}","$or":[{"status":1},{"status":2},{"status":3}]}`).then((count: any) => {
        if (count) {
          this.count = count.count;
        }
      });
    }
    if (this.type === 'old') {
      this.crud.get(`basket/count?query={"createdBy":"${this.userId}","date":{"$gte":"${dateS ? dateS : ''}","$lte":"${dateE ? dateE : ''}"},"$or":[{"status":4},{"status":5}]}`).then((count: any) => {
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
    let dateS = null;
    let dateE = null;
    if (this.dateStart && this.dateEnd){
      dateS = new Date(this.dateStart).toISOString();
      dateE = new Date(this.dateEnd).toISOString();
    }
    if (this.count <= this.skip * 5) {return; }
    if (this.type === 'new') {
      this.crud.get(`basket?query={"createdBy":"${this.userId}","$or":[{"status":1},{"status":2},{"status":3}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name img"}]&skip=${this.skip * 5}&limit=5&sort={"date":-1}`).then((v: any) => {
        if (v) {
          this.skip++;
          this.triger = true;
          this.output.emit(v);
        }
      });
    }

    if (this.type === 'old') {
      this.crud.get(`basket?query={"createdBy":"${this.userId}","date":{"$gte":"${dateS ? dateS : ''}","$lte":"${dateE ? dateE : ''}"},"$or":[{"status":4},{"status":5}]}&populate=[{"path":"deliveryAddress","select":"name img"},{"path":"companyOwner","select":"name img"}]&skip=${this.skip * 5}&limit=5&sort={"date":-1}`).then((v: any) => {
        if (v) {
          this.skip++;
          this.triger = true;
          this.output.emit(v);
        }
      });
    }
  }
}
