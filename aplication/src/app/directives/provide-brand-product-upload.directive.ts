import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {CrudService} from "../crud.service";

@Directive({
  selector: '[appProvideBrandProductUpload]'
})
export class ProvideBrandProductUploadDirective implements AfterViewInit, OnChanges{
  @Input() id;
  @Input() companyId;
  @Input() sort;
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
  ngOnChanges() {
    this.triger = true;
    const block = this.elem.nativeElement;
    this.skip = 1;
    this.crud.get(`order/count?query={"brand":"${this.id}","companyOwner":"${this.companyId}"}&populate={"path":"companyOwner"}`).then((count: any) => {
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
  ngAfterViewInit() {
    const block = this.elem.nativeElement;
    this.crud.get(`order/count?query={"brand":"${this.id}","companyOwner":"${this.companyId}"}&populate={"path":"companyOwner"}`).then((count: any) => {
      this.count = count.count;
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
    if (this.count <= this.skip * 5) {return; }
    this.crud.get(`order?query={"brand":"${this.id}","companyOwner":"${this.companyId}"}&populate={"path":"companyOwner"}&skip=${this.skip * 5}&limit=5&sort=${this.sort}`).then((v: any) => {
      if (v) {
        this.skip++;
        this.triger = true;
        this.output.emit(v);
      }
    });
  }
}
