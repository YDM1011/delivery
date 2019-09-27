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
import {LoginComponent} from "./pages/login/login.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {AdminLogoutGuard} from "./admin-logout.guard";
import {MainComponent} from "./layout/main/main.component";
import {AdminLoginedGuard} from "./admin-logined.guard";

const routes: Routes = [
  {path: '', component: MainComponent, canActivate: [AdminLoginedGuard], children: [
      {path: '', component: DashboardComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'city', component: CityComponent},
      {path: 'translate', component: TranslateComponent},
      {path: 'category', component: CategoryComponent},
      {path: 'brands', component: BrandsComponent},
      {path: 'create', component: CreateClientsComponent},
      {path: 'list-providers', component: ListProvidersComponent},
      {path: 'list-clients', component: ListClientsComponent},
    ]},
    {path: 'login', component: LoginComponent, canActivate: [AdminLogoutGuard]},
    {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
