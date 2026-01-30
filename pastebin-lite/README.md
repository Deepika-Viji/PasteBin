# Pastebin Lite

Pastebin Lite is a simple web application that allows users to create text pastes
with optional time-based expiration (TTL) and view-count limits, and share a link
to view the paste. Once a constraint is triggered, the paste becomes unavailable.

This project was built as part of a take-home assignment and is designed to be
tested automatically against its deployed API.

---

# Features

- Create a text paste with optional constraints:
  - Time-based expiry (TTL)
  - Maximum view count
- Receive a shareable URL for each paste
- View pastes via API or HTML page
- Pastes automatically become unavailable when constraints are exceeded
- Deterministic time support for automated testing
- Serverless-safe persistence

---

# Tech Stack

- Framework: Next.js (App Router)
- Backend Runtime: Node.js
- Persistence: Upstash Redis (KV store)
- Deployment: Vercel

---

# Running locally

# 1. Install dependencies

```bash
npm install
