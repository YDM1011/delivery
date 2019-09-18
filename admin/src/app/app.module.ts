import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {HttpClientModule} from '@angular/common/http';
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
    HeaderComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SweetAlert2Module.forRoot(),
    MaterialModule
  ],
  exports: [MaterialModule],
  providers: [],
  entryComponents: [
    DialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
