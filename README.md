# StillBroken

> Every reported problem stays public until it is fixed.

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![MUI](https://img.shields.io/badge/MUI-007FFF?style=flat-square&logo=mui&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

**Live:** [stillbroken.vercel.app](https://stillbroken.vercel.app)

---

## The problem

A streetlight goes dark. Ten people notice. A few call the helpline, each gets a different ticket number, and then nothing: no status, no timeline, no way to know whether anyone is working on it or whether the complaint was simply closed. Problems do not get ignored because nobody reported them. They get ignored because the reports disappear.

## What StillBroken does

StillBroken is a public, shared record for local problems that does not let them disappear:

- **One report, many voices.** Neighbours add "this affects me too" instead of filing duplicate complaints, so the real scale of each problem is visible.
- **A status everyone can see.** Reported, Acknowledged, In progress, Resolved, each change with a note and a date on a public timeline.
- **Shared know-how.** People post helpline numbers, ticket IDs, contacts and what worked in the next ward; the most useful answer gets accepted.
- **Pressure through visibility.** A city dashboard shows what is still open, how long fixes take and which categories and cities are lagging.

## Features

| Area | What it does |
|---|---|
| Reporting | Title, details, category (roads, water, electricity, sanitation, safety, transport, environment, public spaces), urgency, city, area/landmark, photo link, tags |
| Prioritisation | "This affects me too" upvotes; sort by most supported, still open or newest |
| Fixes and updates | Anyone can post a proposed fix, progress update or helpful resource; others vote; the reporter accepts the best one |
| Status workflow | Reported, Acknowledged, In progress, Resolved, each with an optional note, shown as a timeline |
| City dashboard | Totals, resolution rate, average time to fix, pipeline by status, breakdown by category, most active cities |
| Leaderboard | Civic points for reports, fixes, upvotes received and accepted fixes |
| Real time | When run as a long-lived Node server, new issues, votes, replies and status changes stream live over Socket.IO (disabled on Vercel's serverless runtime) |
| Accounts | JWT auth, profile with home city (used as the default for new reports), moderator role |
| Hardening | Input validation, regex-escaped search, rate-limited auth, ownership checks on every write |

## Architecture

```
frontend/  React 18 + Vite + MUI, React Router, Socket.IO client
backend/   Express API + Socket.IO, Mongoose models (User, Issue, Solution)
           serves frontend/build in production, so one service runs everything
```

| Method | Endpoint | Notes |
|---|---|---|
| `POST` | `/api/auth/register`, `/api/auth/login` | returns `{ user, token }` |
| `GET` / `PATCH` | `/api/auth/me` | current profile |
| `GET` | `/api/issues` | `q, category, status, severity, city, sort=top\|unresolved\|newest, page, limit, mine` |
| `POST` | `/api/issues` | create (auth) |
| `GET` / `DELETE` | `/api/issues/:id` | detail with solutions and timeline / delete (owner or moderator) |
| `POST` | `/api/issues/:id/upvote` | toggle |
| `PATCH` | `/api/issues/:id/status` | `{ status, note }` (owner or moderator) |
| `POST` | `/api/issues/:id/solutions` | `{ text, kind: fix\|update\|resource }` |
| `POST` | `/api/solutions/:id/vote` | `{ value: 1\|-1\|0 }` |
| `POST` | `/api/solutions/:id/accept` | owner or moderator |
| `GET` | `/api/stats`, `/api/leaderboard`, `/api/health` | public |

## Run locally

```bash
git clone https://github.com/optimus-node-js/StillBroken.git
cd StillBroken
cp backend/.env.example backend/.env    # set MONGO_URI and JWT_SECRET
npm install                             # installs backend + frontend and builds the app
npm run dev                             # API on :5000, web on :3000 with proxy
```

Production: `npm install && npm start` serves the API and the built app from one Node process.

## Deploy

- **Vercel (production):** one project from the repo root. `vercel.json` serves `frontend/build` and runs the Express API as a serverless function (`api/index.js`). Set `MONGO_URI` and `JWT_SECRET`.
- **Any Node host (optional):** `npm install && npm start` runs the API and the built app from one process, with Socket.IO live updates enabled.

## History

- **2024:** started as a generic "post a problem, vote on solutions" board (CrowdSourcePlatform).
- **2026:** rebuilt and renamed **StillBroken** around one goal, public accountability for local problems: status workflow and timeline, city dashboard, leaderboard, Vite frontend and a single-project Vercel deployment. Existing v1 accounts and posts still load.

---

## Author

**Rahul Vishwakarma**, Senior Full Stack Developer based in Ahmedabad, India

[![Portfolio](https://img.shields.io/badge/Portfolio-rahul--vishwakarma--portfolio.vercel.app-0A66C2?style=flat-square&logo=vercel&logoColor=white)](https://rahul-vishwakarma-portfolio.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Rahul%20Vishwakarma-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/rahul-vishwakarma-101346192)
[![Email](https://img.shields.io/badge/Email-karmarahul67%40gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:karmarahul67@gmail.com)
