import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from './environment';
@Injectable({ providedIn: 'root' })
export class ApiService {
  circleId = signal<string | null>(localStorage.getItem('careloop.circle'));
  constructor(private http: HttpClient) {}
  setCircle(id: string) { localStorage.setItem('careloop.circle', id); this.circleId.set(id); }
  get<T>(path: string, params?: Record<string, string>) { return firstValueFrom(this.http.get<T>(`${environment.apiUrl}${path}`, { params })); }
  post<T>(path: string, body: unknown) { return firstValueFrom(this.http.post<T>(`${environment.apiUrl}${path}`, body)); }
  patch<T>(path: string, body: unknown) { return firstValueFrom(this.http.patch<T>(`${environment.apiUrl}${path}`, body)); }
}
