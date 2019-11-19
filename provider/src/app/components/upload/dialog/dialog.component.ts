import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UploadService} from "../upload.service";
import {MatDialogRef} from "@angular/material";
import {forkJoin} from "rxjs";
import { Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {CrudService} from "../../../crud.service";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild('file') file;
  public disBtn = true;
  public multiple;
  public step = 1;
  public img;
  public files: Set<File> = new Set();

  constructor(
    private crud: CrudService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>,
    public uploadService: UploadService) {
  }

  ngOnInit() {
    this.uploadService.onMultiple.subscribe(v => {
      this.multiple = v;
    });
    this.uploadService.onFile.subscribe(v => {
      if (v) {
        this.img = v;
        this.step = 2;
      }
    });
  }
  progress;
  canBeClosed = true;
  primaryButtonText = 'Загрузить';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  ngOnDestroy(){}
  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      if (this.data.type[files[key].type]) {
        if (!isNaN(parseInt(key))) {
          this.files.add(files[key]);
        }
      } else {
        this.canBeClosed = true;
        this.showCancelButton = true;
        this.uploading = false;
        this.disBtn = false;
        return;
      }
    }
  }

  addFiles() {
    this.file.nativeElement.click();
  }
  next() {}
  send(v) {
    this.uploadService.setCropper(v);
    this.dialogRef.close();
  }
  closeDialog() {
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    this.uploading = true;

    this.progress = this.uploadService.upload(this.files);
    for (const key in this.progress) {
      this.progress[key].progress.subscribe(val => console.log(key, val));
    }

    // convert the progress map into an array
    const allProgressObservables = [];
    for (const key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Сохранить';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      // ... the dialog can be closed again...
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;

      // ... the upload was successful...
      this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;
    });
  }
}
