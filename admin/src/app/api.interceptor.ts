import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/internal/operators/tap';
import {CookieService} from 'ngx-cookie-service';
import Swal from "sweetalert2";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    public localStorage = localStorage ;
    constructor(
        private coockieService: CookieService
    ) { }

    // intercept request and add token
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // modify request
        request = request.clone({
            setHeaders: {Authorization: (this.localStorage.getItem('adminToken')) || this.coockieService.get('adminToken')},
            withCredentials: true
        });
        return next.handle(request)
            .pipe(
                tap(event => {
                    if (event instanceof HttpResponse) {
                        // http response status code
                    }
                }, error => {
                    // http response status code
                    console.log(error);
                    switch (error.status) {
                        case 404: Swal.fire('Oops...', error.error, 'error');
                        case 403: Swal.fire('Oops...', error.error, 'error');
                    }
                })
            );
    }

}
