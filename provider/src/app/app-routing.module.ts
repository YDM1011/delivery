import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {LoginComponent} from "./pages/login/login.component";
import {AdminLogoutGuard} from "./admin-logout.guard";
import {AdminLoginedGuard} from "./admin-logined.guard";
import {MainComponent} from "./layout/main/main.component";


const routes: Routes = [
  {path: '', component: MainComponent, children: [
      {path: '', component: DashboardComponent},
    ], canActivate: [AdminLoginedGuard]},
  {path: 'login', component: LoginComponent, canActivate: [AdminLogoutGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
