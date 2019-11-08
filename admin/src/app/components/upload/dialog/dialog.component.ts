import {Component, OnInit, ViewChild} from '@angular/core';
import {UploadService} from "../upload.service";
import {MatDialogRef} from "@angular/material";
import {forkJoin} from "rxjs";
import { Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  // @ts-ignore
  @ViewChild('file') file;
  public disBtn = true;
  public multiple;
  public files: Set<File> = new Set();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>,
    public uploadService: UploadService) {
  }

  ngOnInit() {
    this.uploadService.onMultiple.subscribe(v => {
      this.multiple = v;
    });
  }
  ngOnChanges() {
    // this.multiple = this.uploadService.multiple
  }

  progress;
  canBeClosed = true;
  primaryButtonText = 'Загрузить';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    // console.log(this.data.type);
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

  closeDialog() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map

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
    this.primaryButtonText = 'Закончить';

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
