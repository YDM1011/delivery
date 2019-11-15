import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InitLayoutComponent} from './layout/init-layout/init-layout.component';
import {IndexComponent} from './pages/index/index.component';
import {NotificationComponent} from './pages/notification/notification.component';
import {BasketComponent} from './pages/basket/basket.component';
import {FavoritesComponent} from './pages/favorites/favorites.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {CategoryComponent} from './pages/category/category.component';
import {CategoryIDComponent} from './pages/category-id/category-id.component';
import {ProductIDComponent} from './pages/product-id/product-id.component';
import {BrandsComponent} from './pages/brands/brands.component';
import {CityComponent} from './pages/city/city.component';
import {VerificationComponent} from './pages/verification/verification.component';
import {SigninComponent} from './pages/signin/signin.component';
import {SignupComponent} from './pages/signup/signup.component';
import {OtherCityComponent} from './pages/other-city/other-city.component';
import {ProviderComponent} from './pages/provider/provider.component';
import {ProviderAllComponent} from './pages/provider-all/provider-all.component';
import {MyInfoComponent} from './pages/my-info/my-info.component';
import {MyAddressComponent} from './pages/my-address/my-address.component';
import {NewAddressComponent} from './pages/new-address/new-address.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {ActionDetailComponent} from './pages/action-detail/action-detail.component';
import {OrdersComponent} from './pages/orders/orders.component';
import {IsLoginGuard} from "./is-login.guard";
import {IsLogoutGuard} from "./is-logout.guard";
import {BrandsIDComponent} from "./pages/brands-id/brands-id.component";
import {EditAddressComponent} from "./pages/edit-address/edit-address.component";
import {NotificationIdComponent} from "./components/notification-id/notification-id.component";

const routes: Routes = [
  {path: ':lang', component: InitLayoutComponent, children: [
      {path: '', component: IndexComponent},
      {path: 'notification', component: NotificationComponent, canActivate: [IsLoginGuard]},
      {path: 'basket', component: BasketComponent, canActivate: [IsLoginGuard]},
      {path: 'favorites', component: FavoritesComponent, canActivate: [IsLoginGuard]},
      {path: 'profile', component: ProfileComponent, canActivate: [IsLoginGuard]},
      {path: 'category', component: CategoryComponent},
      {path: 'category/:id', component: CategoryIDComponent},
      {path: 'product/:id', component: ProductIDComponent},
      {path: 'brands', component: BrandsComponent},
      {path: 'brand/:id', component: BrandsIDComponent},
      {path: 'city', component: CityComponent},
      {path: 'verification', component: VerificationComponent},
      {path: 'login', component: SigninComponent, canActivate: [IsLogoutGuard]},
      {path: 'signup', component: SignupComponent, canActivate: [IsLogoutGuard]},
      {path: 'other-city', component: OtherCityComponent},
      {path: 'provider/:id', component: ProviderComponent},
      {path: 'provider-all', component: ProviderAllComponent},
      {path: 'my-info', component: MyInfoComponent},
      {path: 'my-address', component: MyAddressComponent},
      {path: 'edit-address/:id', component: EditAddressComponent},
      {path: 'new-address', component: NewAddressComponent},
      {path: 'action/:id', component: ActionDetailComponent},
      {path: 'notification/:id', component: NotificationIdComponent},
      {path: 'orders', component: OrdersComponent, canActivate: [IsLoginGuard]},
    ]},
  {path: '', redirectTo: 'ru', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
