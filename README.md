# Daily Learning — Japanese 10 Words + Python 1 Problem

A mobile-first React + Supabase study app. Fixed daily assignments, per-item completion, synced history. No AI API required.

## 1. Install

```bash
npm install
cp .env.example .env
```

On Windows PowerShell use `Copy-Item .env.example .env` instead of `cp` if preferred.

## 2. Supabase

1. Create a Supabase project.
2. Open **SQL Editor**, run `supabase/schema.sql`.
3. Go to **Project Settings > API** / **Connect**, copy project URL and **publishable key** (or legacy anon key) into `.env`.
4. In **Authentication > Providers > Email**, enable email authentication / magic links.
5. In **Authentication > URL Configuration**, add the deployed Vercel URL as a Redirect URL. In development, add `http://localhost:5173/**` to Redirect URLs (or `http://localhost:5173`). Set Site URL to the deployed app URL once live.
6. Never put a Supabase service_role or secret key into a `VITE_` environment variable.

## 3. Launch

```bash
npm run dev
```

Open http://localhost:5173 and sign in with your email. Follow the emailed login link in the same browser. Run `npm run build` to verify before deployment.

## 4. Deploy

Push the folder to a new GitHub repository and import it into Vercel. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Vercel Environment Variables, then deploy. Add Vercel URL to Supabase Auth Redirect URLs. Use the same email on mobile and desktop to synchronize study history.

## How it works

- New day in Japan time zone = a new session with **10 words + 1 programming problem**.
- Daily assignments live in Supabase: refreshes do not reshuffle them.
- Daily completion progress and history are saved to Supabase.
- Older days are visible but read-only; you can study/review their content.
- Once the entire catalog has been used, content is recycled. This starter ships with **30 vocabulary cards** and **10 short original Python problems**, enough for a 3-day vocabulary trial and a 10-day programming trial. Expand `src/data/words.js` and `src/data/problems.js` before long-term use.
- Catalog content is bundled with the app. Avoid renaming existing item `id` fields after using the app, or past study sessions may not find them.
- This project does not run Python inline. Use your existing editor or AtCoder to solve problems.

## Security notes

- Supabase Row Level Security ensures logged-in users see and edit only their own `daily_sessions` rows.
- Public frontend keys are intended for browser usage; **never** use the secret/service role key in the frontend.
- Magic-link authentication may be subject to Supabase email quotas. Production use can configure a custom SMTP service if needed.
