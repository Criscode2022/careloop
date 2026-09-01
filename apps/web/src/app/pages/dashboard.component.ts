import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
@Component({
  standalone: true,
  template: `
    <div class="mx-auto max-w-5xl">
      <h1 class="font-serif text-4xl">{{ dash()?.circle?.name || 'Your circle' }}</h1>
      @if (error()) { <p class="mt-4 text-rose-700">{{ error() }}</p> }
      <div class="mt-8 grid gap-4 sm:grid-cols-4">
        @for (s of stats(); track s.label) {
          <div class="card p-4"><p class="text-xs uppercase tracking-widest text-moss">{{ s.label }}</p><p class="mt-2 font-serif text-3xl">{{ s.value }}</p></div>
        }
      </div>
    </div>`
})
export class DashboardComponent implements OnInit {
  dash = signal<any>(null);
  error = signal('');
  constructor(private api: ApiService) {}
  stats() {
    const s = this.dash()?.stats;
    return [
      { label: 'People', value: s?.recipients ?? '—' },
      { label: 'Active meds', value: s?.activeMeds ?? '—' },
      { label: 'Open tasks', value: s?.openTasks ?? '—' },
      { label: 'Overdue', value: s?.overdueMeds ?? '—' },
    ];
  }
  async ngOnInit() {
    try {
      const circles = await this.api.get<any[]>('/circles');
      const id = circles[0]?.circle?.id;
      if (!id) { this.error.set('No circle yet.'); return; }
      this.api.setCircle(id);
      this.dash.set(await this.api.get(`/circles/${id}/dashboard`));
    } catch { this.error.set('API unreachable. Run npm run start:dev in apps/api.'); }
  }
}
