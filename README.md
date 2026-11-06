# CrowdFix: Community Civic Issue Tracker

> Report local problems, rally the neighbours they affect, collect practical fixes and keep a public record until each one is actually resolved.

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![MUI](https://img.shields.io/badge/MUI-007FFF?style=flat-square&logo=mui&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socketdotio&logoColor=white)

**Live:** [crowd-source-platform-backend.vercel.app](https://crowd-source-platform-backend.vercel.app) · [crowd-source-platform.onrender.com](https://crowd-source-platform.onrender.com)

---

## Why

Broken streetlights, potholes, water cuts and overflowing bins get reported to helplines one person at a time, and then nobody knows what happened. CrowdFix turns those scattered complaints into one shared, visible queue:

- **Everyone sees the same list**, ranked by how many people are affected.
- **Fixes and contacts are crowdsourced**: helpline numbers, ticket IDs, what worked in the next ward.
- **Every issue has a public timeline** from Reported to Resolved, so problems do not quietly disappear.

## Features

| Area | What it does |
|---|---|
| Reporting | Title, details, category (roads, water, electricity, sanitation, safety, transport, environment, public spaces), urgency, city, area/landmark, photo link, tags |
| Prioritisation | "This affects me too" upvotes; sort by most supported, still open or newest |
| Fixes and updates | Anyone can post a proposed fix, progress update or helpful resource; others vote; the reporter accepts the best one |
| Status workflow | Reported, Acknowledged, In progress, Resolved, each with an optional note, shown as a timeline |
| City dashboard | Totals, resolution rate, average time to fix, pipeline by status, breakdown by category, most active cities |
| Leaderboard | Civic points for reports, fixes, upvotes received and accepted fixes |
| Real time | New issues, votes, replies and status changes stream live over Socket.IO |
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
git clone https://github.com/optimus-node-js/CrowdSourcePlatform.git
cd CrowdSourcePlatform
cp backend/.env.example backend/.env    # set MONGO_URI and JWT_SECRET
npm install                             # installs backend + frontend and builds the app
npm run dev                             # API on :5000, web on :3000 with proxy
```

Production: `npm install && npm start` serves the API and the built app from one Node process.

## Deploy

- **Render (single service):** build command `yarn` or `npm install`, start command `npm start`. Set `MONGO_URI` and `JWT_SECRET` in the service environment.
- **Vercel (full stack):** deploy from the repo root. `vercel.json` serves `frontend/build` and runs the API as a serverless function (`api/index.js`). Set `MONGO_URI` and `JWT_SECRET`. Live updates need the Render deploy, since serverless functions cannot hold WebSocket connections.

## History

v1 (2024) was a generic "post a problem, vote on solutions" board. v2 (2026) refocuses it on civic issues with a status workflow, city dashboard, leaderboard, live updates and a single-service deployment. Existing v1 accounts and posts still load.

---

## Author

**Rahul Vishwakarma**, Senior Full Stack Developer based in Ahmedabad, India

[![Portfolio](https://img.shields.io/badge/Portfolio-rahul--vishwakarma--portfolio.vercel.app-0A66C2?style=flat-square&logo=vercel&logoColor=white)](https://rahul-vishwakarma-portfolio.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Rahul%20Vishwakarma-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/rahul-vishwakarma-101346192)
[![Email](https://img.shields.io/badge/Email-karmarahul67%40gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:karmarahul67@gmail.com)
