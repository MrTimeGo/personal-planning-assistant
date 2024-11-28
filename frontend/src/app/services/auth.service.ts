import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth, AuthVerification } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.backendUrl;

  httpClient = inject(HttpClient);

  signIn(auth: Auth) {
    return this.httpClient.post(`${this.baseUrl}/login`, auth, {
      responseType: 'text',
    });
  }

  signUp(auth: Auth) {
    return this.httpClient.post(`${this.baseUrl}/signup`, auth, {
      responseType: 'text',
    });
  }

  verify(auth: AuthVerification) {
    return this.httpClient.post(`${this.baseUrl}/verify`, auth, {
      responseType: 'text',
    });
  }

  profile(): Observable<string> {
    return this.httpClient.get(`${this.baseUrl}/profile`, {
      responseType: 'text',
    });
  }

  logout() {
    return this.httpClient.post(
      `${this.baseUrl}/logout`,
      {},
      {
        responseType: 'text',
      }
    );
  }
}
