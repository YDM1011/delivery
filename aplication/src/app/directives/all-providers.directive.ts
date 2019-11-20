import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {CrudService} from "../crud.service";

@Directive({
  selector: '[appAllProviders]'
})
export class AllProvidersDirective implements AfterViewInit {
  @Input() cityId;
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
    const query = `?query={"city":"${this.cityId}","verify":true}&sort={"rating":-1}`;
    this.crud.get('company/count', '', query).then((count: any)=>{
      if(count) {
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
    if (this.count <= this.skip * 8) {return; }
    const query = `?query={"city":"${this.cityId}","verify":true}&limit=8&skip=${this.skip * 8}&sort={"rating":-1}`;
    this.crud.get('company', '', query).then((v: any)=>{
      if(v) {
        this.skip++;
        this.trigger = true;
        this.output.emit(v);
      }
    });
  }
}
