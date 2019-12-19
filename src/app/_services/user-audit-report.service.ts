import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class UserAuditReportService {
    constructor(private http: HttpClient) { }

    getByParams(params: any) {
        return this.http.post(`${environment.apiUrl}/reports/find-report`, params);
    }
}