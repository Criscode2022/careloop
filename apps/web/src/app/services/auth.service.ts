import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from './environment';
export interface User { id: string; email: string; name: string; }
@Injectable({ providedIn: 'root' })
export class AuthService {
  token = signal(localStorage.getItem('careloop.token'));
  user = signal<User | null>(JSON.parse(localStorage.getItem('careloop.user') || 'null'));
  constructor(private http: HttpClient, private router: Router) {}
  async login(email: string, password: string) {
    const res = await firstValueFrom(this.http.post<{ token: string; user: User }>(`${environment.apiUrl}/auth/login`, { email, password }));
    this.persist(res);
  }
  async register(name: string, email: string, password: string) {
    const res = await firstValueFrom(this.http.post<{ token: string; user: User }>(`${environment.apiUrl}/auth/register`, { name, email, password }));
    this.persist(res);
  }
  logout() {
    localStorage.removeItem('careloop.token');
    localStorage.removeItem('careloop.user');
    this.token.set(null);
    this.user.set(null);
    void this.router.navigateByUrl('/');
  }
  private persist(res: { token: string; user: User }) {
    localStorage.setItem('careloop.token', res.token);
    localStorage.setItem('careloop.user', JSON.stringify(res.user));
    this.token.set(res.token);
    this.user.set(res.user);
    void this.router.navigateByUrl('/app');
  }
}
