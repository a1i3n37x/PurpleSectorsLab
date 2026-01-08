# Purple Sectors Training Lab

## Getting Started

Install dependencies:

```bash
npm install
```

Set up the database (Postgres). You can copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then set your connection string and run:

```bash
# in .env
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public"

npx prisma migrate dev --name init
```

Seed starter data (cars, tracks, tags, drills, sample entries):

```bash
npm run db:seed
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Notes

- Database: Postgres (`DATABASE_URL` in your environment or `.env`).
- Seed script: `prisma/seed.js` (clears existing seed tables before inserting).
- Prisma schema: `prisma/schema.prisma`.
- Public pages live in `src/app`, private pages are grouped under `src/app/(private)`.

## Scripts

- `npm run dev` - Start Next.js dev server.
- `npm run build` - Production build.
- `npm run start` - Start production server.
- `npm run db:migrate` - Run Prisma migrations.
- `npm run db:seed` - Seed starter content.

## Deployment

Deploy to Vercel or your preferred platform. Set `DATABASE_URL` in Vercel
environment variables and the build will run `prisma migrate deploy` before
`next build`.

See Next.js deployment docs for additional hosting guidance.
# PurpleSectorsLab
# PurpleSectorsLab
