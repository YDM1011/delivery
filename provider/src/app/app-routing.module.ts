import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {LoginComponent} from "./pages/login/login.component";
import {AdminLogoutGuard} from "./admin-logout.guard";
import {AdminLoginedGuard} from "./admin-logined.guard";
import {MainComponent} from "./layout/main/main.component";
import {CategoryComponent} from "./pages/category/category.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {ProductComponent} from "./pages/product/product.component";
import {CategoryDetailComponent} from "./pages/category-detail/category-detail.component";


const routes: Routes = [
  {path: '', component: MainComponent, children: [
      {path: '', component: DashboardComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'category', component: CategoryComponent},
      {path: 'category-detail/:id', component: CategoryDetailComponent},
      {path: 'product', component: ProductComponent},
    ], canActivate: [AdminLoginedGuard]},
  {path: 'login', component: LoginComponent, canActivate: [AdminLogoutGuard]},
  {path: '**', component: NotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
