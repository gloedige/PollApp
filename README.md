# PollApp

PollApp is an Angular survey application for browsing polls, answering questions, reviewing results, and creating new surveys.

## Table of Contents

- [Demo](#demo)
- [Requirements](#requirements)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [Features](#features)
- [File Structure](#file-structure)
- [Technologies](#technologies)
- [License](#license)

## Demo

Run the app locally and open:

- `http://localhost:4200/dashboard` for the survey overview
- `http://localhost:4200/detail/:id` for an individual survey

When built for its configured production base path, the app is served under `/angular-projects/Poll_App/`.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Installation

```bash
npm install
```

## How to Use

1. Start the development server:

   ```bash
   npm start
   ```

2. Open `http://localhost:4200/dashboard`.
3. Browse active or past surveys and filter them by category.
4. Open a survey detail page to answer questions and submit votes.
5. Use the survey dialog to create and publish a new survey.

Optional project commands:

```bash
npm test -- --watch=false
npm run build
npx playwright test
```

## Features

- Survey dashboard with active and past survey views
- Category-based filtering
- Survey detail view with voting flow
- Survey result display
- Survey creation dialog with reactive form validation
- Support for single-choice and multiple-choice questions
- Supabase-backed survey, question, option, and vote persistence
- Unit and end-to-end test coverage

## File Structure

```text
src/
└── app/
    ├── app.config.ts
    ├── app.routes.ts
    ├── environments/
    ├── features/
    │   ├── components/
    │   ├── interfaces/
    │   ├── services/
    │   ├── survey-dashboard/
    │   ├── survey-detail/
    │   └── survey-dialog/
    ├── shared/
    │   └── components/
    └── styles/

pw tests/
├── example.spec.ts
└── survey-dialog.spec.ts
```

## Technologies

- Angular 21
- TypeScript
- SCSS
- RxJS
- Supabase JavaScript client
- Vitest
- Playwright

## License

This project is licensed under the [MIT License](LICENSE).
