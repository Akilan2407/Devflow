# DevFlow

DevFlow is an enterprise developer collaboration and project management platform.

## Prerequisites

- Node.js 22 or newer
- npm 10 or newer
- MongoDB, local or MongoDB Atlas
- Redis, local or Redis Cloud

## Installation

```powershell
npm install
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Do not commit either `.env` file. Credentials and secrets belong in environment variables only.

## Environment Variables

### Server (`server/.env`)

| Variable      | Description               | Example                             |
| ------------- | ------------------------- | ----------------------------------- |
| `NODE_ENV`    | Runtime environment       | `development`                       |
| `PORT`        | API port                  | `4000`                              |
| `CLIENT_URL`  | Allowed frontend origin   | `http://localhost:5173`             |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/devflow` |
| `GITHUB_TOKEN` | Server-only GitHub API token | `github-pat-kept-out-of-the-client` |
| `REDIS_URL`   | Redis connection string   | `redis://127.0.0.1:6379`            |

### Client (`client/.env`)

| Variable       | Description  | Example                     |
| -------------- | ------------ | --------------------------- |
| `VITE_API_URL` | API base URL | `http://localhost:4000/api` |

## Folder Structure

```text
Devflow/
├── client/
│   └── src/
│       ├── components/ layouts/ pages/ features/
│       ├── hooks/ lib/ services/ stores/ types/ utils/
│       └── App.tsx
├── server/
│   └── src/
│       ├── config/ controllers/ middleware/ models/ routes/
│       ├── services/ validators/ utils/ sockets/ types/
│       └── server.ts
├── .env files (local only)
├── .gitignore
├── package.json
└── README.md
```

## Start Frontend

```powershell
npm run dev:client
```

Frontend: `http://localhost:5173`

## Start Backend

```powershell
npm run dev:server
```

API: `http://localhost:4000`

Health endpoints:

- `GET /api/health`
- `GET /api/health/database`
- `GET /api/health/redis`

The database and Redis health endpoints return `503` until their configured services are reachable.

## Validation

```powershell
npm run typecheck
npm run lint
npm run format:check
npm run build
```

No Docker or Docker Compose configuration is used by this project.
