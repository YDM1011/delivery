import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {CrudService} from "../crud.service";

@Directive({
  selector: '[appScrollUpdateBrands]'
})
export class ScrollUpdateBrandsDirective implements AfterViewInit {
  @Input() folder;
  @Input() idCompany;
  @Input() idBrand;
  @Input() type;
  @Input() role;
  @Output() output = new EventEmitter();
  public skip = 1;
  public elem: ElementRef;
  public scroll;
  public count = 0;
  public triger: boolean = true;

  constructor(
      private el: ElementRef,
      private crud: CrudService
  ) {
    this.elem = el;
  }

  ngAfterViewInit() {
    const block = this.elem.nativeElement;
    const query = `/count?query={"companyOwner":"${this.idCompany}","brand":"${this.idBrand}"}`;
    this.crud.get('order', '', query).then((count: any) => {
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
    const query = `?query={"companyOwner":"${this.idCompany}","brand":"${this.idBrand}"}&limit=5&skip=${this.skip * 5}`;
    this.crud.get('order', '', query).then((v: any) => {
      if (v) {
        this.skip++;
        this.triger = true;
        this.output.emit(v);
      }
    });
  }
}
