import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="grid min-h-screen lg:grid-cols-2">
      <div class="hidden bg-ink p-12 text-mist lg:flex lg:flex-col lg:justify-between">
        <div class="font-serif text-3xl">CareLoop</div>
        <p class="max-w-sm font-serif text-4xl">Keep the night shift informed without another text thread.</p>
      </div>
      <form class="mx-auto flex w-full max-w-md flex-col justify-center gap-4 px-6" (ngSubmit)="submit()">
        <a routerLink="/" class="text-sm text-moss">← Home</a>
        <h1 class="font-serif text-4xl">{{ mode() === 'login' ? 'Welcome back' : 'Create an account' }}</h1>
        @if (mode() === 'register') { <input class="input" name="name" [(ngModel)]="name" placeholder="Your name" required /> }
        <input class="input" name="email" [(ngModel)]="email" placeholder="Email" type="email" required />
        <input class="input" name="password" [(ngModel)]="password" placeholder="Password" type="password" required />
        @if (error()) { <p class="text-sm text-rose-700">{{ error() }}</p> }
        <button class="btn-primary" type="submit">{{ mode() === 'login' ? 'Sign in' : 'Register' }}</button>
        <button class="btn-ghost" type="button" (click)="mode.set(mode() === 'login' ? 'register' : 'login')">{{ mode() === 'login' ? 'Need an account?' : 'Have an account?' }}</button>
        <p class="text-xs text-emerald-900/60">Demo: maya@careloop.app / CareLoop!2026</p>
      </form>
    </div>`
})
export class LoginComponent {
  mode = signal<'login' | 'register'>('login');
  email = 'maya@careloop.app';
  password = 'CareLoop!2026';
  name = 'Maya Chen';
  error = signal('');
  constructor(private auth: AuthService) {}
  async submit() {
    this.error.set('');
    try {
      if (this.mode() === 'login') await this.auth.login(this.email, this.password);
      else await this.auth.register(this.name, this.email, this.password);
    } catch { this.error.set('Could not authenticate. Start the Nest API on :3000.'); }
  }
}
