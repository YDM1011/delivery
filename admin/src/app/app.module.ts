import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import localeRu from '@angular/common/locales/ru-UA';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {TranslateComponent} from './pages/translate/translate.component';
import {CategoryComponent} from './pages/category/category.component';
import {BrandsComponent} from './pages/brands/brands.component';
import {CityComponent} from './pages/city/city.component';
import {LangTabComponent} from './components/lang-tab/lang-tab.component';
import {DialogComponent} from './components/upload/dialog/dialog.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material-module';
import {UploadComponent} from './components/upload/upload.component';
import {ImgComponent} from './components/img/img.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { ListProvidersComponent } from './pages/list-providers/list-providers.component';
import { ListClientsComponent } from './pages/list-clients/list-clients.component';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {CookieService} from 'ngx-cookie-service';
import {ApiInterceptor} from './api.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainComponent } from './layout/main/main.component';
import {MatDatepickerModule, MatInputModule} from '@angular/material';
import { ListAdminsComponent } from './pages/list-admins/list-admins.component';
import {LottieAnimationViewModule} from 'ng-lottie';
import {CreditCardDirectivesModule} from "angular-cc-library";
import {NumbersOnlyDirective} from "./directives/numbers-only.directive";
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { ProviderDetailsComponent } from './pages/provider-details/provider-details.component';
import { StatusDetailProviderPipe } from './pipe/status-detail-provider.pipe';
import { SaveHtmlPipe } from './pipe/save-html.pipe';
import { LoadingComponent } from './components/loading/loading.component';
import {ImageCropperComponent} from "./components/image-cropper/image-cropper.component";
import {CroperComponent, TouchStart} from "./components/croper/croper.component";
import {ImageCropperModule} from "ngx-image-cropper";
import {Ng5SliderModule} from "ng5-slider";
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    SettingsComponent,
    TranslateComponent,
    CategoryComponent,
    BrandsComponent,
    CityComponent,
    LangTabComponent,
    DialogComponent,
    UploadComponent,
    ImgComponent,
    DashboardComponent,
    HeaderComponent,
    ListProvidersComponent,
    ListClientsComponent,
    LoginComponent,
    NotFoundComponent,
    MainComponent,
    ListAdminsComponent,
    NumbersOnlyDirective,
    SearchFilterComponent,
    ProviderDetailsComponent,
    StatusDetailProviderPipe,
    SaveHtmlPipe,
    LoadingComponent,
    ImageCropperComponent,
    CroperComponent,
    TouchStart
  ],
  imports: [
    LottieAnimationViewModule.forRoot(),
    MatInputModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SweetAlert2Module.forRoot(),
    MaterialModule,
    Ng2SearchPipeModule,
    CreditCardDirectivesModule,
    MatDatepickerModule,
    ImageCropperModule,
    Ng5SliderModule
  ],
  exports: [MaterialModule],
  providers: [CookieService, {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true},
    {provide: LOCALE_ID, useValue: 'ru-UA'}, {provide: LOCALE_ID, useValue: 'uk'}],
  entryComponents: [
    DialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeRu);
    registerLocaleData(localeUk);
  }
}
