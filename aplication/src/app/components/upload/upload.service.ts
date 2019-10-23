import { Injectable } from '@angular/core';
import {HttpClient, HttpEventType, HttpRequest, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {environment} from "../../../environments/environment";

const url = environment.host + 'upload';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private fs = new BehaviorSubject<any>(null);
  public onFs = this.fs.asObservable();
  private multiple = new BehaviorSubject<any>(null);
  public onMultiple = this.multiple.asObservable();
  private file = new BehaviorSubject<any>(null);
  public onFile = this.file.asObservable();
  private crop = new BehaviorSubject<any>(null);
  public onCrop = this.crop.asObservable();
  constructor(private http: HttpClient) {}
  setNull(){
    this.fs = new BehaviorSubject<any>(null);
    this.onFs = this.fs.asObservable();
    this.file = new BehaviorSubject<any>(null);
    this.onFile = this.file.asObservable();
    this.crop = new BehaviorSubject<any>(null);
    this.onCrop = this.crop.asObservable();
  }
  setMultiple(is){
    this.multiple.next(is ? true : false);
  }

  setFile(d){
    this.file.next(d);
  }
  setCropper(d){
    this.crop.next(d);
  }

  public upload(
    files: Set<File>
  ): { [key: string]: { progress: Observable<number> } } {
    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};
    let s = this;
    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append("file", file, file.name);
      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest("POST", url, formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates

      let startTime = new Date().getTime();
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage

          const percentDone = Math.round((100 * event.loaded) / event.total);
          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete

          // @ts-ignore

          // s.fsName.push(Object.assign(event.body));
          s.fs.next(Object.assign(event.body));
          progress.complete();

        }

      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });


    // return the map of progress.observables
    return status;


  }
}
