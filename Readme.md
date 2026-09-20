# Storage Wars

A full-stack online auction platform built on the MERN stack, inspired by storage-unit auctions.

Sellers list products and open timed auctions on them. Customers bid while the auction is live. The seller (or an admin) approves or rejects each bid, the highest approved bid wins, and the winner pays through an integrated payment gateway.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Security](#security)
- [Roadmap](#roadmap)

---

## Overview

A traditional auction requires everyone in one room at one time. Storage Wars digitises the entire cycle — listing, bidding, approval, winner determination, payment and order fulfilment — so it works from any browser, with a permanent record of every bid.

**The auction lifecycle:**

```
Seller lists a Product
   → Seller opens an Auction (startTime / endTime)
   → Status auto-flips to "live" when startTime passes
   → Customers place Bids (must beat the current bid)
   → Seller or Admin approves / rejects each bid
   → Status auto-flips to "completed" when endTime passes
   → Highest APPROVED bid becomes the winner
   → Order created → Buyer pays via Razorpay → Order confirmed
```

The winner is the highest bid with `status: "approved"` — not simply the highest bid placed. A rejected bid can never win, regardless of amount. This gives sellers a manual quality gate over who they transact with.

---

## Features

### Admin
- Full CRUD across users, categories, products and auctions
- Block / unblock user accounts
- Approve or reject any bid on the platform
- Generate orders from completed auctions
- Sales and activity analytics via MongoDB aggregation

### Seller
- List products with image upload (Cloudinary)
- Create and manage timed auctions
- Review and approve / reject bids on their own auctions
- Track auction results and completed sales
- Ownership enforced server-side — a seller can only modify their own listings

### Customer
- Browse live auctions with a real-time countdown timer
- Place bids with server-side validation
- Watchlist for tracking auctions of interest
- Automatic notifications on bid approval or rejection
- Pay for won auctions through Razorpay
- Track bid history and orders

### Platform
- JWT authentication with role-based access control
- Email verification on registration
- Google reCAPTCHA v2 on login, registration and the contact form
- Automated auction status transitions
- AI assistant powered by Google Gemini
- Contact form with email delivery via Nodemailer

---

## Tech Stack

**Frontend**

| Technology | Purpose |
|---|---|
| React 18 | Component-based UI |
| Vite | Build tool and dev server |
| React Router | Client-side routing with role-guarded routes |
| Axios | HTTP client with a JWT request interceptor |
| Tailwind CSS | Utility-first styling |
| lucide-react | Icon set |
| react-google-recaptcha | reCAPTCHA v2 widget |

**Backend**

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API and middleware chain |
| MongoDB + Mongoose 9 | Database and schema modelling |
| jsonwebtoken | Stateless authentication |
| bcryptjs | Password hashing |
| multer + Cloudinary | Image upload and CDN hosting |
| Razorpay | Payment processing with signature verification |
| Nodemailer | Email verification and contact form delivery |
| @google/genai | Gemini-powered AI assistant |

---

## Architecture

```
React Client  →  Express API  →  MongoDB
                      ↓
        Cloudinary · Razorpay · Gemini · SMTP
```

Every protected request passes through a middleware chain before reaching any business logic:

```
Request
  → protect          (verifies the JWT, sets req.user)
  → authorizeRoles   (checks the role against the route's allow-list)
  → controller       (business logic + ownership checks)
  → Mongoose model   (schema validation)
  → MongoDB
```

Any link in that chain can stop the request, so the controller — and therefore the database — is never reached on an unauthorised call.

A background job in `server.js` runs every 60 seconds, updating auction statuses (`upcoming → live → completed`) based on the server clock. The same check runs on every auction list request, so statuses stay accurate between ticks.

---

## Project Structure

```
storage-wars/
├── backend/
│   ├── config/              # MongoDB, Cloudinary, Razorpay connections
│   ├── models/              # 9 Mongoose schemas
│   ├── middlewares/         # auth, role, file upload
│   ├── controllers/         # business logic
│   ├── routes/              # 12 route modules
│   ├── utils/               # reCAPTCHA verification
│   └── server.js            # entry point
│
└── frontend/
    ├── src/
    │   ├── api/             # shared Axios instance
    │   ├── component/       # reusable UI + ProtectedRoute
    │   ├── pages/           # public pages
    │   ├── dashboards/      # admin / seller / customer views
    │   └── utils/           # helpers
    └── index.html
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB (local instance or Atlas cluster)
- Accounts for: Cloudinary, Razorpay, Google reCAPTCHA v2, Google Gemini API

### Installation

```bash
git clone https://github.com/<your-username>/storage-wars.git
cd storage-wars
```

**Backend**

```bash
cd backend
npm install
cp .env.example .env     # then fill in your own values
npm run dev              # runs on port 5000
```

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env     # then fill in your own values
npm run dev              # runs on port 5173
```

Start MongoDB first, then the backend, then the frontend. The dashboards fetch data on mount, so the API needs to be reachable before the UI loads.

### reCAPTCHA setup

Register a site at [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin) using **reCAPTCHA v2 → "I'm not a robot" Checkbox**, and add `localhost` under Domains for local development. The site key and secret key must come from the same registration.

---

## Environment Variables

### `backend/.env`

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `GEMINI_API_KEY` | Google Gemini API key |
| `EMAIL_USER` | Gmail address for outgoing mail |
| `EMAIL_PASS` | Gmail App Password (not your account password) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay secret — used for signature verification |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v2 secret key |

### `frontend/.env`

| Variable | Description |
|---|---|
| `VITE_RAZORPAY_KEY_ID` | Razorpay **public** key ID |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA v2 **public** site key |

Only public keys are exposed to the browser. Secrets stay on the server and are never bundled into the frontend.

---

## API Reference

Base URL: `http://localhost:5000/api`
Protected routes require the header `Authorization: Bearer <token>`.

| Module | Endpoints | Purpose |
|---|---|---|
| `/auth` | 3 | Register, login, verify email |
| `/users` | 4 | Admin user management |
| `/categories` | 5 | Category CRUD |
| `/products` | 5 | Product CRUD with image upload |
| `/auctions` | 6 | Auction CRUD, winner lookup |
| `/bids` | 5 | Place, list, approve / reject |
| `/orders` | 9 | Order creation, Razorpay payment + verification |
| `/watchlist` | 3 | Add, list, remove |
| `/notifications` | 3 | List, create, mark read |
| `/reports` | 1 | Admin analytics |
| `/contact` | 1 | Public contact form |
| `/ai` | 1 | Gemini chat assistant |

**Status codes:** `200` OK · `201` Created · `400` Bad request · `401` Not authenticated · `403` Not permitted · `404` Not found · `500` Server error

---

## Data Models

| Model | Key Relationships |
|---|---|
| **User** | — |
| **Category** | — |
| **Product** | → Category, → User (seller) |
| **Auction** | → Product, → User (seller) |
| **Bid** | → Auction, → User (bidder) |
| **Order** | → Auction, → Product, → User (buyer & seller) |
| **Watchlist** | → User, → Auction |
| **Notification** | → User |
| **Contact** | — |

Relationships are stored as `ObjectId` references and resolved at read time with Mongoose's `.populate()`. Every schema uses `timestamps: true`.

---

## Security

- **Passwords** are hashed one-way with bcrypt (salt factor 10). Plain text is never stored, logged, or returned in any response.
- **Authentication** uses signed JWTs carrying only the user ID and role, with a 24-hour expiry. Tampering with the payload invalidates the signature.
- **Authorization** runs in two stages — identity (`protect`) is checked separately from permission (`authorizeRoles`) — plus resource-level ownership checks inside controllers.
- **Payments** are verified server-side by recomputing the Razorpay HMAC-SHA256 signature. An order can only reach `confirmed` after a genuine, completed transaction.
- **Bot protection** via Google reCAPTCHA v2, verified server-side against Google's API on login, registration and contact submissions.
- **Secrets** live in `.env`, excluded from version control. Only designated public keys reach the browser.

---

## Roadmap

- Atomic bid updates to remove the read-then-write race under concurrent bidding
- Real-time bid updates via WebSockets, replacing the 60-second polling cycle
- Rate limiting on authentication and bidding endpoints
- Pagination and database indexes on frequently queried fields
- Refund and cancellation flow for confirmed orders
- Production deployment with a locked-down CORS origin allow-list

---

*Built as a full-stack learning project covering authentication, role-based access control, payment integration and third-party API consumption end to end.*
