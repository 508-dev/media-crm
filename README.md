# media-crm

A CRM to personally track various types of media you consume, such as videogames, books, movies, or TV shows.

## Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Backend** | Node.js, Express, tRPC |
| **Database** | SQLite (better-sqlite3) |
| **ORM** | Drizzle ORM |
| **Validation** | Zod (shared schemas) |
| **Monorepo** | pnpm workspaces |

## Project Structure

```
media-crm/
├── packages/
│   ├── shared/          # Zod schemas, types, constants
│   ├── server/          # Express + tRPC API
│   │   ├── src/
│   │   │   ├── schema.ts    # Drizzle table definitions
│   │   │   ├── db.ts        # Database connection & queries
│   │   │   └── routers/     # tRPC procedures
│   │   └── drizzle/         # Migration files
│   └── client/          # React frontend
├── docker-compose.yml
└── Dockerfile
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

This starts both:
- **Server** at http://localhost:3001
- **Client** at http://localhost:5173 (proxies API requests to server)

### Production Build

```bash
pnpm build
pnpm start
```

## Database Migrations

Migrations are managed with [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview). The schema is defined in `packages/server/src/schema.ts` and derives enum values from the shared Zod schemas.

### Generate a Migration

After modifying `packages/server/src/schema.ts`:

```bash
cd packages/server
pnpm db:generate
```

This creates a new SQL migration file in `packages/server/drizzle/`.

### Apply Migrations

Migrations run automatically on server startup. To run them manually:

```bash
cd packages/server
pnpm db:migrate
```

### Explore the Database

```bash
cd packages/server
pnpm db:studio
```

Opens Drizzle Studio for browsing and editing data.

### Migration Workflow

1. Edit `packages/shared/src/schemas/media.ts` to add/modify enum values
2. Update `packages/server/src/schema.ts` if adding new columns
3. Run `pnpm db:generate` in the server package
4. Review the generated SQL in `drizzle/`
5. Restart the server (migrations apply automatically)

## Docker

### Build and Run

```bash
docker-compose up --build
```

Access at http://localhost:3000

### Data Persistence

SQLite database is stored in a Docker volume (`media-data`) at `/data/media.db`.

## API

tRPC procedures available at `/trpc`:

| Procedure | Type | Description |
|-----------|------|-------------|
| `media.list` | Query | List all media (optional type/status filter) |
| `media.getById` | Query | Get single item by ID |
| `media.create` | Mutation | Create new item |
| `media.update` | Mutation | Update existing item |
| `media.delete` | Mutation | Delete item |

## Schema

Media items have the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Auto-incremented primary key |
| `title` | string | Required |
| `type` | enum | `book`, `movie`, `tv_show`, `game`, `podcast` |
| `status` | enum | `want_to_consume`, `in_progress`, `completed`, `dropped` |
| `rating` | number \| null | 0-10 scale |
| `notes` | string \| null | Free-form notes |
| `completedAt` | string \| null | ISO date string |
| `createdAt` | string | Auto-set on creation |
| `updatedAt` | string | Auto-updated on changes |
