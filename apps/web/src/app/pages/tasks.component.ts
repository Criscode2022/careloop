import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="mx-auto max-w-5xl">
      <h1 class="font-serif text-4xl">Care tasks</h1>
      <form class="mt-6 flex gap-2" (ngSubmit)="add()">
        <input class="input" name="title" [(ngModel)]="title" placeholder="Add a handoff task" />
        <button class="btn-primary" type="submit">Add</button>
      </form>
      <div class="mt-6 grid gap-3">
        @for (t of tasks(); track t.id) {
          <article class="card flex items-center justify-between p-4">
            <p [class.line-through]="t.status==='done'">{{ t.title }}</p>
            <button class="btn-ghost" (click)="done(t)">Done</button>
          </article>
        }
      </div>
    </div>`
})
export class TasksComponent implements OnInit {
  tasks = signal<any[]>([]);
  title = '';
  constructor(private api: ApiService) {}
  async ngOnInit() { const id = this.api.circleId(); if (id) this.tasks.set(await this.api.get('/tasks', { circleId: id })); }
  async add() {
    const circleId = this.api.circleId();
    if (!circleId || !this.title.trim()) return;
    await this.api.post('/tasks', { circleId, title: this.title, priority: 'medium' });
    this.title = '';
    await this.ngOnInit();
  }
  async done(t: any) { await this.api.patch(`/tasks/${t.id}`, { status: 'done' }); await this.ngOnInit(); }
}
