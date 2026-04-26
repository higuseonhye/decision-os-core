# Decision OS Core - Deal Gate MVP

Open-source infrastructure for how AI-native companies make decisions.

Deal Gate is a decision workflow system for evaluating inbound deals with deterministic scoring, recommendations, and feedback loops.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase Postgres + Supabase Auth
- Route handlers for backend APIs
- Deterministic local decision engine (AI-ready architecture)

## Core Features Implemented

- Landing page with product narrative and CTA
- Supabase Auth: sign up, sign in, logout
- Dashboard metrics:
  - Open Decisions
  - Approved This Month
  - Avg Decision Time
  - Estimated Revenue Impact
- New deal submission form
- Deterministic scoring engine:
  - Deal score
  - Risk score
  - Recommendation: APPROVE / REJECT / RENEGOTIATE / REVIEW_MANUALLY
- Decision result page:
  - Recommendation
  - Reasoning bullets
  - Revenue upside
  - Risk flags
  - Suggested next action
- Decision log table
- Feedback loop outcomes:
  - won / lost / bad_fit / delayed / pending
- Optional Slack incoming webhook on new deal

## File Tree

```text
.
|-- api/
|   `-- README.md
|-- app/
|   |-- api/
|   |   |-- deals/route.ts
|   |   `-- outcomes/[dealId]/route.ts
|   |-- auth/
|   |   |-- sign-in/page.tsx
|   |   `-- sign-up/page.tsx
|   |-- dashboard/page.tsx
|   |-- deals/
|   |   |-- [id]/page.tsx
|   |   `-- new/page.tsx
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components/
|   |-- auth-form.tsx
|   |-- deals-table.tsx
|   |-- metric-card.tsx
|   |-- new-deal-form.tsx
|   |-- outcome-form.tsx
|   |-- recommendation-badge.tsx
|   |-- site-nav.tsx
|   `-- ui/*
|-- lib/
|   |-- data.ts
|   |-- decision-engine.ts
|   |-- supabase/
|   |   |-- client.ts
|   |   |-- middleware.ts
|   |   `-- server.ts
|   `-- utils.ts
|-- supabase/
|   `-- schema.sql
|-- types/
|   `-- deal.ts
|-- middleware.ts
|-- .env.example
`-- README.md
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SLACK_WEBHOOK_URL` (optional)

## Supabase Setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. In Supabase Auth settings, enable Email + Password provider.
4. Disable email confirmation for faster local MVP testing (optional).

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment (Vercel)

1. Import repo to Vercel.
2. Add environment variables from `.env.example`.
3. Deploy.

## Future Modules

The architecture is intentionally modular for:

- Hiring Gate
- Budget Gate
- Vendor Gate
- Roadmap Gate
