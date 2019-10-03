import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {LoginComponent} from './pages/login/login.component';
import {AdminLogoutGuard} from './admin-logout.guard';
import {AdminLoginedGuard} from './admin-logined.guard';
import {MainComponent} from './layout/main/main.component';
import {CategoryComponent} from './pages/category/category.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {ProductComponent} from './pages/product/product.component';
import {CategoryDetailComponent} from './pages/category-detail/category-detail.component';
import {CreateComponent} from './pages/create/create.component';
import {DebtorComponent} from './pages/debtor/debtor.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {WorkTimeComponent} from './pages/work-time/work-time.component';
import {ActionComponent} from './pages/action/action.component';

const routes: Routes = [
  {path: '', component: MainComponent, children: [
      {path: '', component: DashboardComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'category', component: CategoryComponent},
      {path: 'category-detail/:id', component: CategoryDetailComponent},
      {path: 'product', component: ProductComponent},
      {path: 'create', component: CreateComponent},
      {path: 'debtor', component: DebtorComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'work-time', component: WorkTimeComponent},
      {path: 'action', component: ActionComponent},
    ], canActivate: [AdminLoginedGuard]},
  {path: 'login', component: LoginComponent, canActivate: [AdminLogoutGuard]},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
