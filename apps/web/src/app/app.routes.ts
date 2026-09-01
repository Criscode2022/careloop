import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing.component').then((m) => m.LandingComponent) },
  { path: 'login', loadComponent: () => import('./pages/login.component').then((m) => m.LoginComponent) },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'meds', loadComponent: () => import('./pages/meds.component').then((m) => m.MedsComponent) },
      { path: 'tasks', loadComponent: () => import('./pages/tasks.component').then((m) => m.TasksComponent) },
      { path: 'journal', loadComponent: () => import('./pages/journal.component').then((m) => m.JournalComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
