import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuard implements CanActivate {
  public language;
  constructor(
      private router: Router,
      private auth: AuthService
  ) {
    this.auth.onLanguage.subscribe((v: string) => {
      if(!v) return;
      this.language = v;
    })
  }
  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot) {
    if (this.auth.isAuth()) {
      return true;
    } else {
      this.router.navigate(['/' + this.language + '/signin']);
      return false;
    }

  }
}
