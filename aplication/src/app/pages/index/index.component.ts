import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../auth.service";
import {WS} from "../../websocket/websocket.events";
import {WebsocketService} from "../../websocket";
import {CrudService} from "../../crud.service";
import {Subscription} from "rxjs";
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  public count = null;
  public user;
  public notification$: any;
  public companyArr: any;
  public language: string;
  public curentCity:any = {};
  public category = [];
  public brandy = [];
  public topCompany = [];
  public toggleMain: boolean = true;
  public loadingCount: boolean = true;
  public images = [`./assets/images/tmp/img-deli.png`, `./assets/images/tmp/img-product.png`, `./assets/images/tmp/img-deli.png`];
  public carentPhoto;
  public number: number = 0;
  public loaded = {
    category: false,
    topCompany: false,
    brand: false
  };
  private _subscription: Subscription[] = [];
  constructor(
      private auth: AuthService,
      private wsService: WebsocketService,
      private crud: CrudService
  ) { }

  ngOnInit() {
    this.auth.onMe.subscribe((v: any) => {
      if (!v) {return; }
      this.user = v;
      if (this.user && this.user._id) {
        this.basketCount();
      }
    });
    this._subscription.push(this.auth.onBasketCount.subscribe((v: any) => {
      this.count = v;
      this.loadingCount = true;
    }));
    this._subscription.push(this.auth.onLanguage.subscribe((v: string) => {
      this.language = v;
    }));
    this._subscription.push(this.auth.onCity.subscribe((v:any) => {
      if (v) {
        this.crud.getCompany(v).then((arr) => {
          this.curentCity = v;
          this.companyArr = arr;
          this.init();
        });

      }
    }));
    this.carentPhoto = `url(${this.images[0]})`;

    // this.wsService.send(WS.SEND.NOTIFICATION, 'admin1',  { data: 'test sf' });
    this.notification$ = this.wsService.on(WS.ON.ON_NOTIFICATION);

    this.notification$.subscribe(v => {
      this.playAudio();
    });
  }
  playAudio() {
    const audio = new Audio();
    audio.src = '../../../assets/audio/alert.mp3';
    audio.load();
    audio.play();
  }

  async init() {
    await this.crud.getBrands().then((v: any) => {
      if (!v) return;
      this.brandy = v;
      this.loaded.brand = true;
    }).catch(e => { this.loaded.brand = true });
    await this.crud.getCategory().then((v: any) => {
      if (!v) return;
      this.category = v;
      this.loaded.category = true;
    }).catch(e => { this.loaded.category = true});
    await this.crud.getTopCompany().then((v:any) => {
      if (!v) return;
      this.topCompany = v;
      this.loaded.topCompany = true;
    }).catch(e => { this.loaded.topCompany = true});
  }
  changeCar(e) {
    this.carentPhoto = `url(${e})`;
  }
  ngOnDestroy() {
    this._subscription.forEach(it => it.unsubscribe());
  }

  basketCount() {
    this.crud.get(`basket/count?query={"createdBy":"${this.user._id}","status":0}`).then((count: any) => {
      if (count) {
        this.count = count.count;
        this.loadingCount = true;
      }
    });
  }
}
