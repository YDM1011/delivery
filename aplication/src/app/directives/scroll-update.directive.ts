import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {CrudService} from "../crud.service";

@Directive({
  selector: '[appScrollUpdate]'
})
export class ScrollUpdateDirective implements AfterViewInit  {
  @Input('appScrollUpload') scrollUpload;
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
              console.log(this.triger)
              this.triger = false;
              this.upload();
            }
          };
        }
      });

      //
      // const query1 = JSON.stringify({'createdBy.itemId': this.id});
      // this.crud.get(`order/count?query=${query1}`).then((v: any) => {
      //   this.count = v.count;
      //   block.onscroll = e => {
      //     if ((e.srcElement.scrollTop + (e.target.offsetHeight * 1.2) > e.target.scrollHeight) && this.triger) {
      //       this.triger = false;
      //       this.upload();
      //     }
      //   };
      // });
  }
  upload() {
    if (this.count <= this.skip * 1) {return; }
    console.log('upload')
    const query = `?query={"companyOwner":"${this.idCompany}","categoryOwner":"${this.idCategory}"}&limit=1&skip=${this.skip * 1}`;
    this.crud.get('order', '', query).then((v: any) => {
      console.log(v)
      if (v) {
        this.skip++;
        this.triger = true;
        this.output.emit(v);
      }
    });

      // const populate = JSON.stringify({path: 'orders', options: {skip: this.skip * 8, limit: 8, sort: {updatedAt: -1}}, populate: [{path: 'products'}, {path: 'cleanerOwner', select: 'name'}, {path: 'deliveryOwner', select: 'name superManager'}]});
      // this.crud.get(`actionLog/${this.id}?populate=${populate}`).then((basket: any) => {
      //   this.skip++;
      //   this.triger = true;
      //   this.output.emit(basket);
      // });
    }
}
