# David Amberg — Portfolio

Source code for my personal portfolio site: [davidamberg.work](https://davidamberg.work).

Instead of a list, projects are laid out as a spatial network you can explore. A small console logs what you do on the page, and the background changes with your local time of day.

## Concept & features

- **Project network**: each project is a node placed at a stored x/y position. Major projects get larger nodes. Selecting a node opens a detail panel with description, links and an image gallery.
- **Console**: an expandable log at the bottom of the page records interactions such as click origins, plus the occasional personal fragment.
- **Time-of-day background**: the page background moves through eight phases, from dawn to late night, based on the visitor's local clock.
- **Scratch drawing**: moving the cursor leaves faint SVG strokes that slowly fade. They are not drawn over buttons, links or panels. As visitors move from node to node, their strokes sketch connections between projects, so the network takes shape as it is explored.
- **Mobile layout**: touch devices get a separate layout with project cards and a bottom sheet instead of the network view.
- **About panel**: a short about page with contact details.

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router, `standalone` output) and React 19
- TypeScript
- Redux Toolkit for client state
- Tailwind CSS
- Prisma with PostgreSQL
- Project images are stored externally and referenced by URL

## Architecture

```
app/            Root layout, page, Redux provider, API routes (app/api/projects/...)
components/     UI: Portfolio, Desktop/MobileLayout, ProjectNetwork, ProjectNode,
                DetailPanel, ImageGalleryOverlay, Console, AboutPanel, BottomSheet, ...
hooks/          Page effects: useBackground, useScratch, useClickTracking,
                usePerformance, useProjectImages
store/          Redux store, slices (app, console, portfolio, project, scratch)
                and a performance-logging middleware
lib/            Prisma client and ProjectService (database queries)
prisma/         Schema and migrations
utils/          DOM and image helpers
```

### Data model

- **Project**: `title`, `meta`, `description`, `tags[]`, `isMajor`, `positionX` / `positionY` (placement in the network), `links` (JSON array of `{ title, url }`)
- **ProjectImage**: `blobUrl`, `filename`, `altText`, `displayOrder`. Belongs to a project and is deleted along with it.

### API

All routes are read-only `GET` endpoints:

| Route | Returns |
| --- | --- |
| `/api/projects` | All projects |
| `/api/projects/major` | Projects with `isMajor = true` |
| `/api/projects/[id]` | A single project |
| `/api/projects/[id]/images` | Images of a project, ordered by `displayOrder` |
| `/api/projects/tag/[tag]` | Projects with the given tag |

## Local setup

Prerequisites: Node.js 20 and a PostgreSQL database.

```bash
cp env.example .env          # set DATABASE_URL to your Postgres connection string
npm install
npx prisma migrate deploy    # apply migrations (use `migrate dev` while changing the schema)
npm run dev
```

The site is then available at [http://localhost:3000](http://localhost:3000).

There is no seed script or admin UI. Projects and images are added directly in the database, for example with `npx prisma studio`.

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate the Prisma client and build for production |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Deployment

The site runs as a Docker container on a self-hosted server.

- The multi-stage `Dockerfile` builds Next.js's standalone output and runs it as a non-root user on port 3000.
- On every push to `master`, [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
  1. builds the image and pushes it to `ghcr.io/neuercoolername/website:latest`
  2. connects to the server over SSH through a Cloudflare Access tunnel
  3. runs `docker compose pull` and `docker compose up -d` for the website service
- `DATABASE_URL` is provided to the container at runtime by the server's compose setup.
