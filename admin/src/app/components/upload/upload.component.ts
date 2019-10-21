import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {DialogComponent} from "./dialog/dialog.component";
import {MatDialog} from "@angular/material";
import {UploadService} from "./upload.service";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, OnDestroy, OnChanges {
  @Output() onFs = new EventEmitter();
  @Input() multiple = true;
  @Input() defType = {'image/png': true, 'image/jpg': true, 'image/jpeg': true};
  @Input() tooltip = '';

  constructor(public dialog: MatDialog,
              public uploadService: UploadService) {}
  ngOnInit() {
    this.uploadService.onFs.subscribe(v => {
      if (v) {
        this.onFs.emit(v);
      }
    });
  }

  ngOnChanges() {
    this.uploadService.setMultiple(this.multiple);
  }
  openUploadDialog() {
    const dialogRef = this.dialog.open(DialogComponent, { width: '360px', height: '360px',
      data: {type: this.defType, tooltip: this.tooltip} });
  }
  ngOnDestroy() {
    this.uploadService.setNull();
  }

}
