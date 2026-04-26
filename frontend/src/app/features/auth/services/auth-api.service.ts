import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginRequest, LoginResponse } from '../auth.types';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/auth`;

  login(request: LoginRequest): Observable<LoginResponse> {
    if (environment.useMockApi) {
      return of({ success: true });
    }
    return this.http.post<LoginResponse>(`${this.endpoint}/login`, request);
  }
}
