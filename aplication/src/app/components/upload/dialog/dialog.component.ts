import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {forkJoin} from 'rxjs';
import {UploadService} from '../upload.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {MatDialogRef} from '@angular/material';
import {AuthService} from "../../../auth.service";

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
  public step = 1;
  public img;
  public files: Set<File> = new Set();
  public language;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>,
    public uploadService: UploadService,
    private auth: AuthService) {
  }

  ngOnInit() {
    this.auth.onLanguage.subscribe((l: any) => {
      if (l) {
        this.language = l;
      }
    });
    this.uploadService.onMultiple.subscribe(v => {
      this.multiple = v;
    });
    this.uploadService.onFile.subscribe(v => {
      // console.log(v);
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
  next() {}
  send(v) {
    this.uploadService.setCropper(v);
    this.file.nativeElement.value = '';
    this.img = '';
    this.files = new Set();
    // console.log(this.file.nativeElement);
    this.dialogRef.close();
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
      this.progress[key].progress.subscribe();
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
