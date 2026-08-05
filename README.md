# RepoIQ Insight

RepoIQ is a React frontend for exploring GitHub repository health, AI summaries, and analysis insights.

## Stack

- React and TypeScript
- Vite
- React Router DOM
- React Query
- Axios
- Tailwind CSS

## Getting started

1. Copy `.env.example` to `.env` and set `VITE_API_URL` if needed.
2. Install dependencies with `npm install`.
3. Start the app with `npm run dev`.

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — create a production build
- `npm run lint` — lint TypeScript and React source files

## Project structure

```text
src/
  components/  Reusable UI and feature components
  layouts/     Shared application and authentication layouts
  pages/       Route-level page components
  routes/      React Router route definitions
  services/    API client and external integrations
  hooks/       Reusable React hooks
  utils/       Shared utilities and placeholder data
  types/       Shared TypeScript types
```

The app currently uses placeholder data. `src/services/api.ts` provides the shared Axios client for future backend integration.
