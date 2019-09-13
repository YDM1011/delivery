import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { InitLayoutComponent } from './layout/init-layout/init-layout.component';
import { IndexComponent } from './pages/index/index.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { BasketComponent } from './pages/basket/basket.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CategoryComponent } from './pages/category/category.component';
import { CategoryIDComponent } from './pages/category-id/category-id.component';
import { ProductIDComponent } from './pages/product-id/product-id.component';
import { BrandsComponent } from './pages/brands/brands.component';
import { CityComponent } from './pages/city/city.component';
import { VerificationComponent } from './pages/verification/verification.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { OtherCityComponent } from './pages/other-city/other-city.component';
import { ProviderComponent } from './pages/provider/provider.component';
import { ProviderAllComponent } from './pages/provider-all/provider-all.component';
import { MyInfoComponent } from './pages/my-info/my-info.component';
import { MyBonusesComponent } from './pages/my-bonuses/my-bonuses.component';
import { MyAddressComponent } from './pages/my-address/my-address.component';
import { NewAddressComponent } from './pages/new-address/new-address.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SupportComponent } from './pages/support/support.component';
import { AddressItemComponent } from './components/address-item/address-item.component';
import { BasketItemComponent } from './components/basket-item/basket-item.component';
import { CategoryItemComponent } from './components/category-item/category-item.component';
import { ControlerComponent } from './components/controler/controler.component';
import { PhoneComponent } from './components/phone/phone.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProviderItemComponent } from './components/provider-item/provider-item.component';
import { NoInternetConectionComponent } from './pages/no-internet-conection/no-internet-conection.component';
import {FormsModule} from '@angular/forms';
import {LottieAnimationViewModule} from 'ng-lottie';
import { TranslatePipe } from './pipe/translate.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { ActionItemComponent } from './components/action-item/action-item.component';
import { RatingServiceItemComponent } from './components/rating-service-item/rating-service-item.component';
import { ActionDetailComponent } from './pages/action-detail/action-detail.component';
import { RatingServiceHistoryItemComponent } from './components/rating-service-history-item/rating-service-history-item.component';
import { RaitingComponent } from './components/raiting/raiting.component';
import { RemoveBasketItemComponent } from './components/remove-basket-item/remove-basket-item.component';
import { BasketOrderItemComponent } from './components/basket-order-item/basket-order-item.component';
import { ConfirmOrderComponent } from './components/confirm-order/confirm-order.component';
import { ChangeAddressComponent } from './components/change-address/change-address.component';
import { ConfirmAddressComponent } from './components/confirm-address/confirm-address.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrdersItemComponent } from './components/orders-item/orders-item.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import { ImgComponent } from './components/img/img.component';
import {CookieService} from "ngx-cookie-service";
import {ApiInterceptor} from "./api.interceptor";
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import {MatCarouselModule} from "@ngmodule/material-carousel";
import { RemoveOrdersComponent } from './components/remove-orders/remove-orders.component';
import {StarRatingComponent} from "./components/star-rating/star-rating.component";
import {MatIcon, MatIconModule, MatSnackBar, MatTooltipModule} from "@angular/material";
import { FilterComponent } from './components/filter/filter.component';
import {Ng5SliderModule} from "ng5-slider";
import {HttpClientModule} from "@angular/common/http";
import { WsLayoutComponent } from './layout/ws-layout/ws-layout.component';
import {WebsocketModule} from './websocket';
import {environment} from "../environments/environment";
import { BrandItemComponent } from './components/brand-item/brand-item.component';

@NgModule({
  declarations: [
    AppComponent,
    InitLayoutComponent,
    IndexComponent,
    NotificationComponent,
    BasketComponent,
    FavoritesComponent,
    ProfileComponent,
    CategoryComponent,
    CategoryIDComponent,
    ProductIDComponent,
    BrandsComponent,
    CityComponent,
    VerificationComponent,
    SigninComponent,
    SignupComponent,
    OtherCityComponent,
    ProviderComponent,
    ProviderAllComponent,
    MyInfoComponent,
    MyBonusesComponent,
    MyAddressComponent,
    NewAddressComponent,
    NotFoundComponent,
    SupportComponent,
    AddressItemComponent,
    BasketItemComponent,
    CategoryItemComponent,
    ControlerComponent,
    PhoneComponent,
    ProductItemComponent,
    ProviderItemComponent,
    NoInternetConectionComponent,
    TranslatePipe,
    ActionItemComponent,
    RatingServiceItemComponent,
    ActionDetailComponent,
    RatingServiceHistoryItemComponent,
    RaitingComponent,
    RemoveBasketItemComponent,
    BasketOrderItemComponent,
    ConfirmOrderComponent,
    ChangeAddressComponent,
    ConfirmAddressComponent,
    OrdersComponent,
    OrdersItemComponent,
    ImgComponent,
    NumbersOnlyDirective,
    RemoveOrdersComponent,
    StarRatingComponent,
    FilterComponent,
    BrandItemComponent,
  ],
  imports: [
    Ng5SliderModule,
    MatIconModule,
    MatTooltipModule,
    MatCarouselModule,
    HttpClientModule,
    MatRadioModule,
    MatCheckboxModule,
    MatExpansionModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    LottieAnimationViewModule.forRoot(),
    WebsocketModule.config({
      url: environment.ws
    })
  ],
  providers: [CookieService, {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
