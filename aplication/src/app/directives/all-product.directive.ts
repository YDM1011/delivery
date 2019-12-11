import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {CrudService} from "../crud.service";

@Directive({
  selector: '[appAllProduct]'
})
export class AllProductDirective  implements AfterViewInit {
  @Input('appAllProduct') appAllProduct;
  @Output() output = new EventEmitter();
  public skip = 1;
  public elem: ElementRef;
  public scroll;
  public count = 0;
  public trigger = true;

  constructor(
      private el: ElementRef,
      private crud: CrudService
  ) {
    this.elem = el;
  }

  ngAfterViewInit() {
    const block = this.elem.nativeElement;
    this.crud.getCountTopProduct().then((count: any) => {
      if (count){
        this.count = count.count;
        block.onscroll = e => {
          if ((e.srcElement.scrollTop + (e.target.offsetHeight * 1.2) > e.target.scrollHeight) && this.trigger) {
            this.trigger = false;
            this.upload();
          }
        };
      }
    });
  }
  upload() {
    if (this.count <= this.skip * 5) {return; }
    if (this.appAllProduct === 'top') {
      this.crud.getTopProduct(this.skip, 5, true).then((v: any) => {
        if (v) {
          this.skip++;
          this.trigger = true;
          this.output.emit(v);
        }
      });
    } else {
      this.crud.getTopProduct(this.skip, 5, false).then((v: any) => {
        if (v) {
          this.skip++;
          this.trigger = true;
          this.output.emit(v);
        }
      });
    }

  }
}
