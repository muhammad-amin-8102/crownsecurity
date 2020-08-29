import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { finalize, catchError } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs';
import { AuthenticationService } from '@app/_services/authentication.service';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
	private count: number = 0;
	constructor(
		public loaderService: NgxSpinnerService,
		private authenticationService: AuthenticationService
		) { }
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.count++;
		if (this.count === 1) { this.loaderService.show(); }
		return next.handle(req).pipe(
			finalize(() => {
				this.count--;
            	if (this.count === 0) { this.loaderService.hide(); }
			}),
			catchError((err: any) => {
				this.count--;
				if ([401, 403].indexOf(err.status) !== -1) {
					// auto logout if 401 Unauthorized or 403 Forbidden response returned from api
					this.authenticationService.logout();
					location.reload(true);
				}
				const error = err.error.message || err.statusText;
				return throwError(error);
			})
		);
	}
}
