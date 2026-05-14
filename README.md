# Football Hub

Football Hub is a modern football web application built with React and Vite. It provides fans with a fast, responsive experience for live scores, upcoming fixtures, standings, and player information.

## Project Overview

Football Hub delivers:

- Live scores, fixtures, league standings, and player statistics
- Server-side favorite team persistence using session cookies
- Authentication flows with local and social-style login
- A responsive UI for desktop and mobile devices
- A backend API that stores data on disk instead of browser storage
- GitHub Actions deployment pipeline

## Features

- Home dashboard with match summaries and league snapshots
- Protected dashboard and profile pages for authenticated users
- Favorite team tracking persisted by the backend
- Search and quick access to teams and players
- Standard navigation flow with React Router

## Technologies

- React 19
- Vite
- React Router DOM
- Express backend
- Cookie-based session auth
- Vitest + Testing Library

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the backend server:

```bash
npm run dev:server
```

3. Start the frontend:

```bash
npm run dev
```

The client proxies requests to `/api` through Vite to `http://localhost:3000`.

## Testing

Run tests and coverage:

```bash
npm run coverage
```

## Release

Release a patch version with semantic versioning:

```bash
npm run release
```

## Deployment

GitHub Actions is configured in `.github/workflows/deploy.yml` to validate tests and build the app on pushes to `main`.

## Persistence

Football Hub stores state in `server/data/db.json` and uses session cookies for auth, avoiding browser local storage or cache.
