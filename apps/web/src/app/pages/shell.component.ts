import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen">
      <aside class="fixed inset-y-0 left-0 hidden w-60 border-r border-emerald-900/10 bg-white/70 p-5 md:block">
        <div class="font-serif text-2xl">CareLoop</div>
        <nav class="mt-8 grid gap-1 text-sm">
          <a routerLink="/app" routerLinkActive="bg-mist" [routerLinkActiveOptions]="{exact:true}" class="rounded-xl px-3 py-2">Overview</a>
          <a routerLink="/app/meds" routerLinkActive="bg-mist" class="rounded-xl px-3 py-2">Medications</a>
          <a routerLink="/app/tasks" routerLinkActive="bg-mist" class="rounded-xl px-3 py-2">Tasks</a>
          <a routerLink="/app/journal" routerLinkActive="bg-mist" class="rounded-xl px-3 py-2">Journal</a>
        </nav>
        <button class="btn-ghost mt-10 w-full" (click)="auth.logout()">Sign out</button>
      </aside>
      <div class="md:pl-60"><main class="px-6 py-8"><router-outlet /></main></div>
    </div>`
})
export class ShellComponent { constructor(readonly auth: AuthService) {} }
