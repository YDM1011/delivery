import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import Cropper from "cropperjs";
import {CrudService} from "../../crud.service";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../auth.service";

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
export class ImageCropperComponent implements OnInit {
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
    console.log(this.imageData)
  }
  onCropDef(e){
    const path = this.imageSource.split('/');
    let file = path[path.length-1];
    this.imageData = {
      fileName: file,
      yy:[e.y, e.height],
      xx:[e.x, e.width]
    };
    this.getData();
  }
  getData() {
    if (!this.imageData || this.imageData.xx[0] == NaN || this.imageData.yy[0] == NaN) {
      this.auth.callDefCrop();
    }
    let link = 'imgSlice';
    if (this.dir) link = link + '/'+this.dir;

    this.crud.post(link , this.imageData, null)
      .then(v=>{
        this.done.emit(v)
      }).catch(e=>console.log(e))
  }
  public ngOnInit() {

  }
  // ngAfterViewInit(){
  //
  // }
}
