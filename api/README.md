# API Surface

In this MVP, API endpoints are implemented with Next.js App Router route handlers under `app/api`.

- `POST /api/deals` - submit a deal and compute decision result.
- `POST /api/outcomes/:dealId` - save outcome feedback.
