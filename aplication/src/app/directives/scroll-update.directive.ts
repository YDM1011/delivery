import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {CrudService} from "../crud.service";

@Directive({
  selector: '[appScrollUpdateCategory]'
})
export class ScrollUpdateDirective implements AfterViewInit  {
  // @Input('appScrollUpload') scrollUpload;
  @Input() folder;
  @Input() idCompany;
  @Input() idCategory;
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
      const query = `/count?query={"companyOwner":"${this.idCompany}","categoryOwner":"${this.idCategory}"}`;
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
    const query = `?query={"companyOwner":"${this.idCompany}","categoryOwner":"${this.idCategory}"}&limit=5&skip=${this.skip * 5}`;
    this.crud.get('order', '', query).then((v: any) => {
      if (v) {
        this.skip++;
        this.triger = true;
        this.output.emit(v);
      }
    });
  }
}
