import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appScrollSmoothTouch]'
})
export class ScrollSmoothTouchDirective {

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onDragStart(event) {
    this.init();
  }

  @Input('appScrollSmoothTouch') el;

  constructor(el: ElementRef) {
    // window.scroll({top:document.getElementsByClassName('catalog')[0].offsetTop-70, behavior:'smooth'})
    this.el = el.nativeElement as HTMLImageElement;
    // console.log(this.el)
  }

  init() {
    if (window.pageYOffset + 70 < this.el.offsetTop) {
      window.scroll({top: this.el.offsetTop - 70, behavior: 'smooth'});
    }
  }
}
