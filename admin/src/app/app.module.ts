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
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {SettingsComponent} from "./pages/settings/settings.component";
import {TranslateComponent} from "./pages/translate/translate.component";
import {CategoryComponent} from "./pages/category/category.component";
import {BrandsComponent} from "./pages/brands/brands.component";
import {CityComponent} from "./pages/city/city.component";
import {LangTabComponent} from "./components/lang-tab/lang-tab.component";
import {DialogComponent} from "./components/upload/dialog/dialog.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MaterialModule} from "./material-module";
import {UploadComponent} from "./components/upload/upload.component";
import {ImgComponent} from "./components/img/img.component";
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { ListProvidersComponent } from './pages/list-providers/list-providers.component';
import { ListClientsComponent } from './pages/list-clients/list-clients.component';
import { CreateClientsComponent } from './pages/create-clients/create-clients.component';
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {CookieService} from "ngx-cookie-service";
import {ApiInterceptor} from "./api.interceptor";
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainComponent } from './layout/main/main.component';
import {MatInputModule} from "@angular/material";

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
    CreateClientsComponent,
    LoginComponent,
    NotFoundComponent,
    MainComponent
  ],
  imports: [
    MatInputModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SweetAlert2Module.forRoot(),
    MaterialModule,
    Ng2SearchPipeModule
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
