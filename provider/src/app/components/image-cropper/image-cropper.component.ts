import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import Cropper from "cropperjs";
import {CrudService} from "../../crud.service";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../auth.service";
import {UploadService} from "../upload/upload.service";

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
export class ImageCropperComponent implements OnInit, OnDestroy {
  @ViewChild("image", { static: false })
  public imageElement: ElementRef;
  public domain = environment.domain;
  public ok = false;
  @Output() done = new EventEmitter();
  @Input("src") imageSource;
  @Input() dir:string;
  @Input() rate;

  public imageDestination: string;
  private cropper: Cropper;

  public imageData: imageSlice;

  public constructor(
    private uploadService: UploadService,
    private crud: CrudService,
    private auth: AuthService
  ) {
    this.imageDestination = '';
  }

  onCrop(e){
    const path = this.imageSource.split('/');
    let file = path[path.length-1];
    this.imageData = {
      fileName: file,
      yy:[e.y, e.height],
      xx:[e.x, e.width]
    };
  }
  onCropDef(e){
    const path = this.imageSource.split('/');
    let file = path[path.length-1];
    if (!e) return this.getData();
    this.imageData = {
      fileName: file,
      yy:[e.y, e.height],
      xx:[e.x, e.width]
    };
    this.getData();
  }
  getData() {
    if (!this.imageData || this.imageData.xx[0] === NaN || this.imageData.yy[0] === NaN) {
      this.auth.callDefCrop();
    }
    let link = 'imgSlice';
    if (this.dir) link = link + '/'+this.dir;

    this.crud.post(link , this.imageData, null, false)
      .then(v=>{
        this.ok = true;
        this.done.emit(v)
      })
  }
  ngOnInit() {

  }
  ngOnDestroy() {
    if (!this.ok) {
      this.crud.post('deleteFile', {file: this.imageSource}, null, false).then((v:any) => {
        if (v) {
          this.uploadService.setFile(null);
        }
      })
    }
  }
}
