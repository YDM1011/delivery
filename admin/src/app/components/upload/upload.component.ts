import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {UploadService} from './upload.service';
import {DialogComponent} from './dialog/dialog.component';
import {CrudService} from '../../crud.service';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, OnDestroy, OnChanges {
  @Output() onFs = new EventEmitter();
  @Output() onCrop = new EventEmitter();
  @Input() multiple = true;
  @Input() defType = {'image/png': true, 'image/jpg': true, 'image/jpeg': true};
  @Input() tooltip = '';
  @Input() dir = '';
  @Input() cropper = false;
  constructor(
      public dialog: MatDialog,
      public crud: CrudService,
      public uploadService: UploadService,
      public auth: AuthService
  ) {}
  ngOnInit() {
    this.uploadService.onFs.subscribe(v => {
      if (v) {
        this.onFs.emit(v);
        if (this.cropper) {
          // this.crud.post('upload2', {body: v}, null).then((v: any) => {
          //   if (!v) {return; }
          this.uploadService.setFile(v);
          // }).catch(e => console.log(e));
        }
      }
    });
    this.uploadService.onCrop.subscribe(v => {
      if (v) {
        this.onCrop.emit(v);
        this.onCrop = new EventEmitter();
      }
    });
  }

  ngOnChanges() {
    this.uploadService.setMultiple(this.multiple);
  }
  openUploadDialog() {
    const dialogRef = this.dialog.open(DialogComponent, { width: '360px', height: '360px',
      data: {type: this.defType, tooltip: this.tooltip, cropper: this.cropper, dir: this.dir} });
  }
  ngOnDestroy() {
    this.uploadService.setNull();
  }

}
