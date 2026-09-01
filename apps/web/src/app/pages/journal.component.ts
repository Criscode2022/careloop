import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../services/api.service';
@Component({
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="mx-auto max-w-3xl">
      <h1 class="font-serif text-4xl">Care journal</h1>
      <form class="card mt-6 grid gap-3 p-5" (ngSubmit)="add()">
        <textarea class="input min-h-28" name="body" [(ngModel)]="body" placeholder="What should the next caregiver know?"></textarea>
        <div class="flex gap-2">
          <select class="input max-w-40" name="mood" [(ngModel)]="mood">
            <option value="steady">Steady</option><option value="low">Low</option><option value="anxious">Anxious</option><option value="relieved">Relieved</option>
          </select>
          <button class="btn-primary" type="submit">Publish note</button>
        </div>
      </form>
      @for (n of notes(); track n.id) {
        <article class="card mt-4 p-5">
          <p class="text-xs uppercase tracking-widest text-moss">{{ n.author?.name }} · {{ n.createdAt | date:'short' }} · {{ n.mood }}</p>
          <p class="mt-2">{{ n.body }}</p>
        </article>
      }
    </div>`
})
export class JournalComponent implements OnInit {
  notes = signal<any[]>([]);
  body = '';
  mood = 'steady';
  constructor(private api: ApiService) {}
  async ngOnInit() { const id = this.api.circleId(); if (id) this.notes.set(await this.api.get('/journal', { circleId: id })); }
  async add() {
    const circleId = this.api.circleId();
    if (!circleId || !this.body.trim()) return;
    await this.api.post('/journal', { circleId, body: this.body, mood: this.mood });
    this.body = '';
    await this.ngOnInit();
  }
}
