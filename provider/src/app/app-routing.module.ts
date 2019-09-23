import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {LoginComponent} from "./pages/login/login.component";
import {AdminLogoutGuard} from "./admin-logout.guard";
import {AdminLoginedGuard} from "./admin-logined.guard";
import {MainComponent} from "./layout/main/main.component";
import {CategoryComponent} from "./pages/category/category.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";


const routes: Routes = [
  {path: '', component: MainComponent, children: [
      {path: '', component: DashboardComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'category', component: CategoryComponent},
    ], canActivate: [AdminLoginedGuard]},
  {path: 'login', component: LoginComponent, canActivate: [AdminLogoutGuard]},
  {path: '**', component: NotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
