# FullStack_Chatbot_Task_Vinit_Kumar


**DroneTV AI Support & Lead Assistant**: a full-stack MERN + TypeScript web app built for the IPAGE Group Full Stack Developer Intern assignment.

It has a drone-themed website, a rule-based chatbot (no external AI API), an enquiry form saved to MongoDB, and an admin dashboard to manage enquiries.

> This is an independent demo. All services and courses shown are **sample content** and not official DroneTV information. The design is original and does not copy dronetv.in.

**Live demo:** http://localhost:5173/


## Features
- Home, Services, Courses, Assistant (chatbot), Contact and Admin pages, responsive on mobile, tablet and desktop
- Rule-based chatbot: the 7 required questions, suggestion buttons, fallback reply, session history, Clear chat, and an in-chat enquiry form
- Enquiry form with validation on frontend **and** backend, clear success and error messages
- REST API with full CRUD, centralized error handling, proper status codes
- Admin dashboard: table, search (name/email), filter (user type, status), details view, status change, delete with confirmation, loading/empty/error states, pagination
- Security: Helmet, CORS allow-list, rate limiting, body size limit, input sanitization, ObjectId validation, secrets in `.env`, admin key for protected routes

## Technologies
| Layer | Tools |
|---|---|
| Frontend | React 19, Vite, TypeScript, React Router, Axios, plain CSS |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose (local) |
| Security | dotenv, helmet, cors, express-rate-limit, validator |

## Architecture
`React (client)  ->  Express REST API (server)  ->  Mongoose  ->  MongoDB`

In development the Vite dev server proxies `/api` to `http://localhost:5000`.

## Project structure
```
FullStack_Chatbot_Task_Vinit_Kumar/
├── client/
│   ├── src/
│   │   ├── components/   Navbar, Footer, ChatWindow, EnquiryForm, ConfirmDialog, ...
│   │   ├── pages/        Home, Services, Courses, Assistant, Contact, Admin
│   │   ├── services/     api.ts (Axios), chatbot.ts (rules), validation.ts
│   │   ├── data/         sample services and courses
│   │   └── types/        TypeScript types
│   ├── .env.example
│   └── vite.config.ts
├── server/
│   ├── config/db.js
│   ├── controllers/enquiryController.js
│   ├── middleware/       adminAuth, errorHandler, rateLimiters, validateObjectId
│   ├── models/Enquiry.js
│   ├── routes/enquiryRoutes.js
│   ├── utils/validation.js
│   ├── scripts/seed.js
│   ├── tests/smoke.test.js
│   ├── app.js
│   ├── server.js
│   └── .env.example
├── docs/                 API documentation, database setup, screenshots, submission guide
├── .gitignore
└── README.md
```

## Setup (Windows PowerShell)
Requirements: Node.js 20+, npm, MongoDB running locally.

```powershell
# 1. Backend
cd server
npm install
Copy-Item .env.example .env
# open .env in VS Code and set ADMIN_API_KEY to your own long random value
npm run dev

# 2. Frontend (new PowerShell window)
cd client
npm install
npm run dev
```
Open http://localhost:5173. The API runs at http://localhost:5000.

Optional: `cd server; npm run seed` adds 4 sample enquiries.

## Environment variables
`server/.env` (never commit this file):

| Variable | Example | Purpose |
|---|---|---|
| `PORT` | `5000` | API port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/dronetv_assistant` | MongoDB connection |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed frontend origin (CORS) |
| `ADMIN_API_KEY` | long random string (12+ chars) | Key needed for admin API routes |

`client/.env` is optional (`VITE_API_URL`), see `client/.env.example`.

## Database setup
See [docs/database/DATABASE_SETUP.md](docs/database/DATABASE_SETUP.md).

## API endpoints
Full details and examples: [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/enquiries` | admin | List (search, filter, pagination) |
| GET | `/api/enquiries/:id` | admin | Get one |
| POST | `/api/enquiries` | public | Create |
| PUT / PATCH | `/api/enquiries/:id` | admin | Update |
| DELETE | `/api/enquiries/:id` | admin | Delete |

## Admin access note
The dashboard asks for the `ADMIN_API_KEY` from `server/.env`. The key is sent in the `x-admin-key` header and checked on the server. This is a simple key-based protection suitable for a demo / local use. It is **not** a full user-account login system (no user accounts, roles or password reset). For production, replace it with proper authentication (for example JWT with hashed passwords).

## Screenshots
| Page | Screenshot |
|---|---|
| Home | ![Home](docs/screenshots/home.png) |
| Services | ![Services](docs/screenshots/services.png) |
| Courses | ![Courses](docs/screenshots/courses.png) |
| Chatbot | ![Chatbot](docs/screenshots/chatbot.png) |
| Chatbot enquiry form | ![Chatbot enquiry](docs/screenshots/chatbot-enquiry.png) |
| Form validation errors | ![Errors](docs/screenshots/enquiry-form-errors.png) |
| Enquiry success | ![Success](docs/screenshots/enquiry-success.png) |
| Admin sign in | ![Admin login](docs/screenshots/admin-login.png) |
| Admin dashboard | ![Admin](docs/screenshots/admin-dashboard.png) |
| Enquiry details | ![Details](docs/screenshots/admin-details.png) |
| Delete confirmation | ![Delete](docs/screenshots/delete-confirm.png) |
| MongoDB Compass | ![Compass](docs/screenshots/mongodb-compass.png) |
| Mobile view | ![Mobile](docs/screenshots/mobile-view.png) |
| Mobile menu | ![Mobile menu](docs/screenshots/mobile-menu.png) |
| Mobile chatbot | ![Mobile chatbot](docs/screenshots/mobile-chatbot.png) |
| Mobile enquiry form | ![Mobile form](docs/screenshots/mobile-enquiry-form.png) |
| Mobile enquiry form (bottom) | ![Mobile form 2](docs/screenshots/mobile-enquiry-form-2.png) |

## Tests
```powershell
cd server
npm test
```
Runs a smoke test of validation, admin auth, invalid IDs, CORS and error responses (no database needed).

## Security summary
Input validated and sanitized on both sides (HTML tags stripped, lengths limited), secrets only in `.env`, Helmet headers, CORS allow-list, rate limits (global and stricter on enquiry creation), 10 KB body limit, safe error messages (details only in the server log), React escapes all user text on render.
