import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {CrudService} from "../crud.service";

@Directive({
  selector: '[appScrollUpdateAction]'
})
export class ScrollUpdateActionDirective  implements AfterViewInit {
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
    const query = `/count?query=${JSON.stringify({client: {$in: localStorage.getItem('userId')}})}`;
    this.crud.get('action', '', query).then((count: any) => {
      if (count) {
        this.count = count.count;

        block.onscroll = e => {
          if ((e.srcElement.scrollTop + (e.target.offsetHeight * 1.2) > e.target.scrollHeight) && this.triger) {
            this.triger = false;
            this.upload();
          }
        };
      }
    });

  }
  upload() {
    if (this.count <= this.skip * 3) {return; }
    const date = new Date(new Date().getTime() - new Date().getHours()*60*60*1000 - new Date().getMinutes()*60*1000  - new Date().getSeconds()*1000).getTime();
    const query = `?query=${JSON.stringify({client: {$in: localStorage.getItem('userId')},dateEnd:{$gte:date}})}&sort={"date":-1}&skip=${this.skip * 3}&limit=3`;
    this.crud.get('action', '', query).then((v: any) => {
      if (v) {
        this.skip++;
        this.triger = true;
        this.output.emit(v);
      }
    });
  }
}
