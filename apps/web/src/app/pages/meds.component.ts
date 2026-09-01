import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
@Component({
  standalone: true,
  template: `
    <div class="mx-auto max-w-5xl">
      <h1 class="font-serif text-4xl">Medications</h1>
      <div class="mt-6 grid gap-4">
        @for (m of meds(); track m.id) {
          <article class="card flex items-center justify-between p-5">
            <div><h2 class="font-medium">{{ m.name }} · {{ m.dosage }}</h2><p class="text-sm text-emerald-900/60">{{ m.recipient?.name }} · {{ m.schedule }}</p></div>
            <button class="btn-primary" (click)="log(m.id)">Mark taken</button>
          </article>
        }
      </div>
    </div>`
})
export class MedsComponent implements OnInit {
  meds = signal<any[]>([]);
  constructor(private api: ApiService) {}
  async ngOnInit() { const id = this.api.circleId(); if (id) this.meds.set(await this.api.get('/medications', { circleId: id })); }
  async log(id: string) { await this.api.post(`/medications/${id}/log`, { status: 'taken' }); await this.ngOnInit(); }
}
