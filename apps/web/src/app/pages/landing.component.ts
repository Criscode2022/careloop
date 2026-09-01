import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,#c7ead6,transparent_40%),linear-gradient(180deg,#f4faf6,#e8f3ec)]">
      <header class="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div class="font-serif text-2xl">CareLoop</div>
        <a routerLink="/login" class="btn-ghost">Sign in</a>
      </header>
      <main class="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p class="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-moss">Family care operating system</p>
          <h1 class="font-serif text-5xl leading-tight md:text-6xl">One shared loop for the people you love.</h1>
          <p class="mt-6 max-w-xl text-lg text-emerald-950/70">Medications, handoff tasks, and bedside notes — a calm workspace for real households.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a routerLink="/login" class="btn-primary">Open the demo circle</a>
            <a href="https://github.com/Criscode2022/careloop" class="btn-ghost">View source</a>
          </div>
        </div>
        <div class="card p-6">
          <p class="text-xs uppercase tracking-widest text-moss">Today in the Chen household</p>
          <h2 class="mt-2 font-serif text-3xl">Robert · 76</h2>
          <ul class="mt-6 space-y-3 text-sm">
            <li class="flex justify-between rounded-xl bg-mist px-4 py-3"><span>Metformin 500mg</span><span class="text-amber-700">due soon</span></li>
            <li class="flex justify-between rounded-xl bg-mist px-4 py-3"><span>Refill at CVS</span><span class="text-rose-700">high</span></li>
          </ul>
        </div>
      </main>
    </div>`
})
export class LandingComponent {}
