import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appScrollSmooth]'
})
export class ScrollSmoothDirective {

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onDragStart(event) {
    this.init()
  }

  @Input('appScrollSmooth') el;

  constructor(el: ElementRef){
    // window.scroll({top:document.getElementsByClassName('catalog')[0].offsetTop-70, behavior:'smooth'})
    this.el = el.nativeElement as HTMLImageElement;
    console.log(this.el)
  }

  init(){
    if (window.pageYOffset+70 < this.el.offsetTop)
    window.scroll({top:this.el.offsetTop-70, behavior:'smooth'})
  }
}
