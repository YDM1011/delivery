import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {HttpClientModule} from '@angular/common/http';
import {LayoutAdminComponent} from "./layout/layout-admin/layout-admin.component";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {SettingsComponent} from "./pages/settings/settings.component";
import {TranslateComponent} from "./pages/translate/translate.component";
import {CategoryComponent} from "./pages/category/category.component";
import {BrandsComponent} from "./pages/brands/brands.component";
import {CityComponent} from "./pages/city/city.component";
import {LangTabComponent} from "./components/lang-tab/lang-tab.component";

@NgModule({
  declarations: [
    AppComponent,
    LayoutAdminComponent,
    SidebarComponent,
    SettingsComponent,
    TranslateComponent,
    CategoryComponent,
    BrandsComponent,
    CityComponent,
    LangTabComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
