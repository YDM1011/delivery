import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {AuthService} from "../../auth.service";
import {Options} from "ng5-slider";

@Directive({selector: '[crop]'})
export class TouchStart {

  @Input('crop') width = 50;
  @Output() data = new EventEmitter();
  public trigerStart = false;
  public startX;
  public startY;

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onDragStart(event) {
    event.preventDefault();
    this.trigerStart = true;
    this.startX = -(parseInt(document.getElementById('cropper-img').style.left)  || 0) + (event.offsetX || event.targetTouches[0].clientX);
    this.startY = -(parseInt(document.getElementById('cropper-img').style.top)  || 0) + (event.offsetY || event.targetTouches[0].clientY);
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  onDragMove(event) {
    if (!this.trigerStart) return;
    event.preventDefault();
    let clientY = (event.offsetY || event.targetTouches[0].clientY);
    let clientX = (event.offsetX || event.targetTouches[0].clientX);
    if ((-(this.startX - clientX) <= event.target.clientWidth/2 - this.width) &&
      ((this.startX - clientX) <= event.target.clientWidth/2 - this.width)){
      document.getElementById('cropper-img').style.left = -(this.startX - clientX)  + 'px';
    } else if (this.startX - clientX < 0) {
      document.getElementById('cropper-img').style.left = event.target.clientWidth/2 - this.width  + 'px';
    } else if (this.startX - clientX > 0) {
      document.getElementById('cropper-img').style.left = -(event.target.clientWidth/2 - this.width)  + 'px';
    }
    if ((-(this.startY - clientY) <= event.target.clientHeight/2 - this.width) &&
      ((this.startY - clientY) <= event.target.clientHeight/2 - this.width)){
      document.getElementById('cropper-img').style.top = -(this.startY - clientY)  + 'px';
    } else if (this.startY - clientY < 0) {
      document.getElementById('cropper-img').style.top = event.target.clientHeight/2 - this.width  + 'px';
    } else if (this.startY - clientY > 0) {
      document.getElementById('cropper-img').style.top = -(event.target.clientHeight/2 - this.width)  + 'px';
    }
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('touchend', ['$event'])
  onDragEnd(event) {
    event.preventDefault();
    this.trigerStart = false;
    let img = document.getElementById('cropper-img') as HTMLImageElement;
    let rateX =  img.naturalWidth / event.target.clientWidth;
    let rateY = img.naturalHeight / event.target.clientHeight;
    if (((-parseInt(img.style.left) <= event.target.clientWidth/2 - this.width) &&
      (parseInt(img.style.left) <= event.target.clientWidth/2 - this.width)) &&
      ((-parseInt(img.style.top) <= event.target.clientHeight/2 - this.width) &&
        (parseInt(img.style.top) <= event.target.clientHeight/2 - this.width))){
      this.data.emit({
        x: rateX * (event.target.clientWidth/2 - this.width - parseInt(img.style.left)),
        y: rateY * (event.target.clientHeight/2 - this.width - parseInt(img.style.top)),
        width: rateX*this.width*2,
        height: rateX*this.width*2,
      });
    } else {
      this.data.emit({
        x: NaN,
        y: NaN,
        width: event.target.clientWidth,
        height: event.target.clientHeight,
      });
    }

  }
}


@Component({
  selector: 'app-croper',
  templateUrl: './croper.component.html',
  styleUrls: ['./croper.component.scss']
})
export class CroperComponent implements OnInit{
  @ViewChild("image", { static: false })
  public imageElement: ElementRef;
  @Output() data = new EventEmitter();
  @Output() dataDef = new EventEmitter();
  @Input() srcImg;
  public def;
  public max = 50;
  public width = 50;
  options: Options = {
    floor: 20,
    ceil: 100
  };
  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.onDefCrop.subscribe(v=>{
      if (v) {
        let img = document.getElementById('cropper-img') as HTMLImageElement;
        let rateX =  img.naturalWidth / img.clientWidth;
        let rateY = img.naturalHeight / img.clientHeight;
        this.def = {
          x: rateX * (img.clientWidth/2 - this.width),
          y: rateY * (img.clientHeight/2 - this.width),
          width: rateX*this.width*2,
          height: rateX*this.width*2,
        };
        this.dataDef.emit(this.def);
      }
    })
  }
  send(e){
    this.data.emit(e)
  }
  priceFilterFunc(){
    let img = document.getElementById('cropper-img') as HTMLImageElement;
    let top = document.getElementsByClassName('t')[0] as HTMLImageElement;
    let left = document.getElementsByClassName('l')[0] as HTMLImageElement;
    let right = document.getElementsByClassName('r')[0] as HTMLImageElement;
    let bottom = document.getElementsByClassName('b')[0] as HTMLImageElement;

    img.style.left = '0px';
    img.style.top = '0px';

    this.width = (this.max/100) * img.clientHeight/2;

    top.style.height = img.clientHeight/2 -  this.width + "px";
    top.style.left = img.clientWidth/2 - this.width + "px";
    top.style.width = this.width*2 +1 + 'px';

    left.style.width = img.clientWidth/2 - this.width + 'px';

    bottom.style.height = img.clientHeight/2 -  this.width + "px";
    bottom.style.right = img.clientWidth/2 - this.width + "px";
    bottom.style.width = this.width*2 +1 + 'px';

    right.style.width = img.clientWidth/2 -  this.width + "px";

  }
}
