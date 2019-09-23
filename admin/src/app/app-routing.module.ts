import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsComponent} from "./pages/settings/settings.component";
import {CityComponent} from "./pages/city/city.component";
import {TranslateComponent} from "./pages/translate/translate.component";
import {CategoryComponent} from "./pages/category/category.component";
import {BrandsComponent} from "./pages/brands/brands.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {CreateClientsComponent} from "./pages/create-clients/create-clients.component";
import {ListProvidersComponent} from "./pages/list-providers/list-providers.component";
import {ListClientsComponent} from "./pages/list-clients/list-clients.component";


const routes: Routes = [
  {path: '', children: [
      {path: '', component: DashboardComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'city', component: CityComponent},
      {path: 'translate', component: TranslateComponent},
      {path: 'category', component: CategoryComponent},
      {path: 'brands', component: BrandsComponent},
      {path: 'create', component: CreateClientsComponent},
      {path: 'list-providers', component: ListProvidersComponent},
      {path: 'list-clients', component: ListClientsComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
