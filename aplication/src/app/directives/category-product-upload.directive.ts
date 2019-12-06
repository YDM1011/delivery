import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {CrudService} from '../crud.service';

@Directive({
  selector: '[appCategoryProductUpload]'
})
export class CategoryProductUploadDirective implements AfterViewInit, OnChanges{
  @Input() cityLinkArr;
  @Input() mainCategory;
  @Input() filter;
  @Input() companyIdArr;
  @Input() sortFilter;
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
    const query = `/count?query={"$and":[${this.cityLinkArr.length > 0 ? JSON.stringify( {$or: this.cityLinkArr} ) : {} },{"mainCategory":"${this.mainCategory._id}"}${this.filter ? this.filter : ''}],"companyOwner":${JSON.stringify( {$in:this.companyIdArr})}}`;
    this.crud.get('order', '',  query).then((count: any) => {
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
    const query = `/count?query={"$and":[${this.cityLinkArr.length > 0 ? JSON.stringify( {$or: this.cityLinkArr} ) : {} },{"mainCategory":"${this.mainCategory._id}"}${this.filter ? this.filter : ''}],"companyOwner":${JSON.stringify( {$in:this.companyIdArr})}}`;
    this.crud.get('order', '',  query).then((count: any) => {
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
    const query = `?query={"$and":[${this.cityLinkArr.length > 0 ? JSON.stringify( {$or: this.cityLinkArr} ) : {} },{"mainCategory":"${this.mainCategory._id}"}${this.filter ? this.filter : ''}],"companyOwner":${JSON.stringify( {$in:this.companyIdArr})}}&populate={"path":"companyOwner"}&skip=${this.skip * 5}&limit=5&sort=${this.sortFilter}`;
    this.crud.get('order', '',  query).then((v: any) => {
        if (v) {
          this.skip++;
          this.triger = true;
          this.output.emit(v);
        }
    });

  }
}
