import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import Cropper from "cropperjs";
import {CrudService} from "../../crud.service";
import {environment} from "../../../../../aplication/src/environments/environment";

interface imageSlice {
  fileName: string,
  xx: number[],
  yy: number[]
}

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit, AfterViewInit {
  @ViewChild("image", { static: false })
  public imageElement: ElementRef;
  public domain = environment.domain;

  @Output() done = new EventEmitter();
  @Input("src") imageSource;
  @Input() dir:string;

  public imageDestination: string;
  private cropper: Cropper;

  public imageData: imageSlice;

  public constructor(
    private crud: CrudService
  ) {
    this.imageDestination = '';
  }

  public ngAfterViewInit() {
    this.cropper = new Cropper(this.imageElement.nativeElement, {
      zoomable: false,
      scalable: false,
      checkCrossOrigin: false,
      aspectRatio: 1,
      crop: () => {
        // const canvas = this.cropper.getCroppedCanvas();
        // this.imageDestination = canvas.toDataURL("image/png");
      }
    });
  }

  rotete() {
    const canvas = this.cropper.rotate(90);
    // this.imageDestination = canvas.toDataURL("image/png");
  }
  getCropBoxData() {
    const canvas = this.cropper.getCropBoxData();
    console.log(canvas);
    // this.imageDestination = canvas.toDataURL("image/png");
  }
  getCanvasData() {
    const canvas = this.cropper.getCanvasData();
    console.log(canvas);
    // this.imageDestination = canvas.toDataURL("image/png");
  }
  getImageData() {

    const canvas = this.cropper.getImageData();
    console.log(canvas);
    // this.imageDestination = canvas.toDataURL("image/png");
  }

  getData() {
    const canvas = this.cropper.getData();
    console.log(canvas);
    const path = this.imageSource.split('/');
    const file = path[path.length - 1];
    this.imageData = {
      fileName: file,
      yy: [canvas.x, canvas.x + canvas.width],
      xx: [canvas.y, canvas.y + canvas.height]
    };
    let link = 'imgSlice';
    if (this.dir) link = link + '/' + this.dir;

    // console.log(link)
    this.crud.post(link , this.imageData, null, false)
      .then(v => {
        console.log(v)
        this.done.emit(v);
      }).catch(e => console.log(e));
    // this.imageDestination = canvas.toDataURL("image/png");
  }
  public ngOnInit() {

  }
  // ngAfterViewInit(){
  //
  // }
}
