import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import Cropper from "cropperjs";
import {CrudService} from "../../crud.service";

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

  @Input("src")
  public imageSource: string;

  public imageDestination: string;
  private cropper: Cropper;

  public imageData: imageSlice;

  public constructor(
    private crud: CrudService
  ) {
    this.imageDestination = "";
  }

  public ngAfterViewInit() {
    this.cropper = new Cropper(this.imageElement.nativeElement, {
      zoomable: false,
      scalable: false,
      aspectRatio: 1,
      crop: () => {
        const canvas = this.cropper.getCroppedCanvas();
        this.imageDestination = canvas.toDataURL("image/png");
      }
    });
  }
  rotete() {

    const canvas = this.cropper.rotate(90);
    // this.imageDestination = canvas.toDataURL("image/png");
  }
  getCropBoxData() {

    const canvas = this.cropper.getCropBoxData();
    console.log(canvas)
    // this.imageDestination = canvas.toDataURL("image/png");
  }
  getCanvasData() {

    const canvas = this.cropper.getCanvasData();
    console.log(canvas)
    // this.imageDestination = canvas.toDataURL("image/png");
  }
  getImageData() {

    const canvas = this.cropper.getImageData();
    console.log(canvas)
    // this.imageDestination = canvas.toDataURL("image/png");
  }
  getData() {

    const canvas = this.cropper.getData();
    console.log(canvas);
    const path = this.imageSource.split('/');
    let file = path[path.length-1];
    this.imageData = {
      fileName: file,
      yy:[canvas.x, canvas.x+canvas.width],
      xx:[canvas.y, canvas.y+canvas.height]
    };
    this.crud.post('imgSlice', this.imageData, null, null)
      .then(v=>{
        console.log(v)
      }).catch(e=>console.log(e))
    // this.imageDestination = canvas.toDataURL("image/png");
  }
  public ngOnInit() { }
}
