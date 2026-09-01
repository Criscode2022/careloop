# CareLoop

**Family caregiver coordination that does not live in a group chat.**

CareLoop is a production-oriented full-stack workspace for households sharing care. It gives the night shift and the day shift the same picture: medications due, handoff tasks, and a short care journal.

## Stack

| Layer | Choice |
| --- | --- |
| Web | Angular 18 standalone + Tailwind CSS |
| API | NestJS, JWT auth |
| Data | Neon Postgres via Prisma, plus an in-memory store so the app runs without a cloud database |
| Ops | Docker Compose, GitHub Actions CI |

## Product

- Care **circles** with invite codes and roles
- **Care recipients** and **medication** schedules
- **Dose logs** (`taken` / `missed` / `skipped`)
- Shared **tasks** with priority
- Timestamped **journal** with mood tags
- Dashboard stats for overdue work

## Quick start

```bash
cd apps/api && npm install && npm test && npm run start:dev
cd apps/web && npm install && npm start
```

Demo login (seeded on API boot):

- Email: `maya@careloop.app`
- Password: `CareLoop!2026`

## Neon

1. Create a project at https://neon.tech
2. Put the connection string in `.env` as `DATABASE_URL`
3. From `apps/api`: `npx prisma generate && npx prisma db push`

Until `DATABASE_URL` is set the API uses the in-memory store so CI and first-run demos stay green.

## Deploy

- API: Node 20+ on Render, Railway, or Fly. Set `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `PORT`.
- Web: static host (Vercel / Netlify / GitHub Pages) after `ng build`.
- Docker: `docker compose up --build`

GitHub Actions runs `npm test` and `npm run build` on the API for every push to `main`.

## License

MIT
