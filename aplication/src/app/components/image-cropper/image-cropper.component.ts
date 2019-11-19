import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {CrudService} from '../../crud.service';
import Cropper from 'cropperjs';
import {AuthService} from '../../auth.service';
import {environment} from "../../../environments/environment";
import {UploadService} from "../upload/upload.service";

interface imageSlice {
  fileName: string;
  xx: number[];
  yy: number[];
}

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("image", { static: false })
  public imageElement: ElementRef;
  public domain = environment.domain;
  @Output() done = new EventEmitter();
  @Input("src") imageSource;
  @Input() dir: string;
  public imageDestination: string;
  private cropper: Cropper;
  public ok = false;
  public imageData: imageSlice;
  public translate = {
      ru: 'Сохранить',
      ua: 'Зберегти'
  };
  public constructor(
    private uploadService: UploadService,
    private crud: CrudService,
    private auth: AuthService
  ) {
    this.imageDestination = '';
  }
  ngOnInit() {
  }
  public ngAfterViewInit() {
  }

  rotete() {
    const canvas = this.cropper.rotate(90);
    // this.imageDestination = canvas.toDataURL("image/png");
  }
  getCropBoxData() {
    const canvas = this.cropper.getCropBoxData();
    // console.log(canvas);
    // this.imageDestination = canvas.toDataURL("image/png");
  }
  getCanvasData() {
    const canvas = this.cropper.getCanvasData();
    // console.log(canvas);
    // this.imageDestination = canvas.toDataURL("image/png");
  }
  getImageData() {

    const canvas = this.cropper.getImageData();
    // console.log(canvas);
    // this.imageDestination = canvas.toDataURL("image/png");
  }
  onCrop(e) {
    const path = this.imageSource.split('/');
    const file = path[path.length - 1];
    this.imageData = {
      fileName: file,
      yy: [e.y, e.height],
      xx: [e.x, e.width]
    };
    // console.log(this.imageData)
  }
  onCropDef(e) {
    const path = this.imageSource.split('/');
    const file = path[path.length - 1];
    this.imageData = {
      fileName: file,
      yy: [e.y, e.height],
      xx: [e.x, e.width]
    };
    this.getData();
  }
  getData() {
    if (!this.imageData || this.imageData.xx[0] === NaN || this.imageData.yy[0] === NaN) {
      this.auth.callDefCrop();
    }
    let link = 'imgSlice';
    if (this.dir) {link = link + '/' + this.dir; }

    this.crud.post(link , this.imageData, null)
      .then(v => {
        this.done.emit(v);
        this.ok = true;
      })
  }
  ngOnDestroy() {
    if (!this.ok) {
      this.crud.post('deleteFile', {file: this.imageSource}, null).then((v:any) => {
        if (v) {
          this.uploadService.setFile(null);
        }
      })
    }
  }
}

