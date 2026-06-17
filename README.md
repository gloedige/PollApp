# PollApp

A survey/polling application built with Angular 21, featuring a dashboard to browse surveys and a detail view to fill them in.

## Tech Stack

- **Framework:** Angular 21 (standalone components, signals)
- **Language:** TypeScript (strict mode)
- **Styling:** SCSS
- **Unit Tests:** [Vitest](https://vitest.dev/)
- **E2E Tests:** [Playwright](https://playwright.dev/)

## Prerequisites

- Node.js ≥ 20
- npm ≥ 10

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
ng serve
```

Open your browser at `http://localhost:4200/`.

## Routes

| Path | Description |
|------|-------------|
| `/dashboard` | Survey dashboard — lists all available surveys |
| `/detail/:id` | Survey detail — view and interact with a single survey |

## Project Structure

```
src/
└── app/
    ├── features/
    │   ├── components/       # Shared feature components
    │   ├── interfaces/       # TypeScript interfaces/models
    │   ├── services/         # Feature services
    │   ├── survey-dashboard/ # Dashboard feature
    │   ├── survey-detail/    # Detail feature
    │   └── survey-dialog/    # Dialog feature
    ├── shared/               # App-wide shared utilities
    ├── styles/               # Global style tokens/mixins
    ├── environments/         # Environment configs
    ├── app.config.ts
    └── app.routes.ts
```

## Running Unit Tests

Uses [Vitest](https://vitest.dev/):

```bash
ng test
```

## Running E2E Tests

Uses [Playwright](https://playwright.dev/):

```bash
npx playwright test
```

## Building

```bash
ng build
```

Build artifacts are output to the `dist/` directory.

## License

[MIT](LICENSE)
