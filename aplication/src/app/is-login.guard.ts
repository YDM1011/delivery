import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuard implements CanActivate {
  public language;
  public lang;
  constructor(
      private router: Router,
      private auth: AuthService
  ) {
    this.auth.onLanguage.subscribe((v: string) => {
      if(!v) return;
      this.language = v;
    });
  }
  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot) {

    if (this.auth.isAuth()) {
      return true;
    } else {
      this.router.navigate(['/'+next.parent.params.lang+'/login']);
      return false;
    }

  }
}
