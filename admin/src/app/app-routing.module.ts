import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsComponent} from "./pages/settings/settings.component";
import {CityComponent} from "./pages/city/city.component";
import {TranslateComponent} from "./pages/translate/translate.component";
import {CategoryComponent} from "./pages/category/category.component";
import {BrandsComponent} from "./pages/brands/brands.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";


const routes: Routes = [

  {path: '', children: [
      {path: '', component: DashboardComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'city', component: CityComponent},
      {path: 'translate', component: TranslateComponent},
      {path: 'category', component: CategoryComponent},
      {path: 'brands', component: BrandsComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
