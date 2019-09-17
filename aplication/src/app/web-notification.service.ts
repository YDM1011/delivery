import { Injectable } from '@angular/core';
import {SwPush} from "@angular/service-worker";
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebNotificationService {
    private domain = environment.domain;
    readonly VAPID_PUBLIC_KEY = 'BF5nS5fuWP8dDcwM-r2S8HTdeAMLWo5H-XqizujO79IAmg2d1cEtcDoeM4WfUbzs1NKoJwV_CuV7IG98Bq0z7Is';
    private baseUrl = `${this.domain}/api/notifications`;
    constructor(private http: HttpClient,
                private swPush: SwPush) {}
    subscribeToNotification() {
        this.swPush.requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC_KEY
        })
            .then(sub => this.sendToServer(sub))
            .catch(err => console.error('Could not subscribe to notifications', err));
    }
    sendToServer(params: any) {
        this.http.post(this.baseUrl, { notification : params }).subscribe();
    }
}
