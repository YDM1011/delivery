import {
  AfterViewInit,
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
import {CrudService} from "../../crud.service";
import {AuthService} from "../../auth.service";

@Directive({selector: '[crop]'})
export class TouchStart {

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
    console.log(this.startX,event)
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  onDragMove(event) {
    if (!this.trigerStart) return;
    event.preventDefault();
    let clientY = (event.offsetY || event.targetTouches[0].clientY);
    let clientX = (event.offsetX || event.targetTouches[0].clientX);
    if ((-(this.startX - clientX) <= event.target.clientWidth/2 - 50) && ((this.startX - clientX) <= event.target.clientWidth/2 - 50)){
      document.getElementById('cropper-img').style.left = -(this.startX - clientX)  + 'px';
    }
    if ((-(this.startY - clientY) <= event.target.clientHeight/2 - 50) && ((this.startY - clientY) <= event.target.clientHeight/2 - 50)){
      document.getElementById('cropper-img').style.top = -(this.startY - clientY)  + 'px';
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
    this.data.emit({
      x: rateX * (event.target.clientWidth/2 - 50 - parseInt(img.style.left)),
      y: rateY * (event.target.clientHeight/2 - 50 - parseInt(img.style.top)),
      width: rateX*100,
      height: rateX*100,
    });
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
          x: rateX * (img.clientWidth/2 - 50),
          y: rateY * (img.clientHeight/2 - 50),
          width: rateX*100,
          height: rateX*100,
        };
        this.dataDef.emit(this.def);
      }
    })
  }
  send(e){
    this.data.emit(e)
  }
}
