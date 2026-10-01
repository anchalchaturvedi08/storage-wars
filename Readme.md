# Storage Wars

**Online auction and bidding platform — MERN stack**

A full stack marketplace where sellers list products, open timed auctions, and approve or reject individual bids. The highest **approved** bid wins; an admin converts that into an order, and the buyer pays through Razorpay with server-side signature verification.

Inspired by storage-unit auction shows, where bidders compete for lots whose contents they cannot fully inspect.

| | |
|---|---|
| REST endpoints | 55 across 12 route groups |
| MongoDB collections | 9 |
| Backend | ~4,600 lines · 11 controllers |
| Frontend | 53 React components |
| User roles | 3 |
| Integrations | Razorpay · Cloudinary · reCAPTCHA · Nodemailer · Gemini |

---

## Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 · Vite 6 · React Router 7 · Axios · Tailwind CSS |
| Backend | Node.js · Express 5 |
| Database | MongoDB · Mongoose 9 |
| Auth | JWT · bcryptjs |
| Payments | Razorpay (HMAC-SHA256 verification + webhook) |
| Images & files | Cloudinary · Multer (memory storage) |
| Bot defence | Google reCAPTCHA v2 |
| Email | Nodemailer |
| AI | Google Gemini |

---

## Roles

| Role | Can | Cannot |
|---|---|---|
| **Admin** | Manage users, categories, products, auctions · approve any bid · create orders · view reports | Create a product — products belong to sellers |
| **Seller** | Add products, open auctions, approve or reject bids **on their own** auctions | Bid on their own auction · touch another seller's listings |
| **Customer** | Browse, bid, watchlist, receive notifications, pay | Anything seller or admin |

**Registration can never create an admin.** The controller sanitises the role:

```js
role: role === "seller" ? "seller" : "customer"
```

The first admin is promoted by hand in the database. Deliberate — if registration could set any role, anyone could POST `{"role":"admin"}` and own the platform.

---

## Getting started

### Requirements

Node.js 18+ · MongoDB (local or Atlas) · Cloudinary, Razorpay and reCAPTCHA accounts · a Gmail App Password

### Backend

```bash
cd backend
npm install
cp .env.example .env     # then fill it in
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend on `5173`, backend on `5000`.

### Environment variables

```
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=              # include the database name BEFORE the ?
JWT_SECRET=             # node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
CRON_SECRET=            # a different random string

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RECAPTCHA_SECRET_KEY=
GEMINI_API_KEY=

EMAIL_USER=             # Gmail address
EMAIL_PASS=             # 16-character App Password, not the account password
```

**`MONGO_URI` needs the database name before the `?`:**

```
mongodb+srv://user:pass@cluster.mongodb.net/Storagewars?retryWrites=true&w=majority
                                            ^^^^^^^^^^^
```

Omit it and Mongoose silently uses a default database called `test`. Everything works, so the mistake stays invisible until you look in Atlas and find your data elsewhere.

A password containing `&`, `@`, `:`, `/` or `#` must be percent-encoded — `&` becomes `%26`.

### Frontend configuration

Two files, same name, opposite jobs:

| File | Role |
|---|---|
| `src/config.js` | **Reads** `window.__APP_CONFIG__`, falling back to Vite env vars. Compiled into the bundle |
| `public/config.js` | **Sets** that global. Served as a plain file, editable on the server without rebuilding |

`index.html` must load the second **before** the bundle:

```html
<script src="/config.js"></script>
<script type="module" src="/src/main.jsx"></script>
```

Omit that line and the app silently falls back to `localhost:5000` — which breaks a live deployment in a way that is hard to trace.

### First admin

Register normally, then in Compass or Atlas change that user's `role` from `customer` to `admin`, and sign in again.

### Seeding categories

`seedCategories.js` creates 8 categories and 33 subcategories. Safe to run repeatedly — it skips anything that already exists.

```bash
cd backend
node seedCategories.js
```

---

## How it works

```
SELLER lists a product
   → opens an auction with a start and end time
      → CUSTOMERS bid inside that window
         → SELLER approves or rejects each bid
            → highest APPROVED bid wins
               → ADMIN converts the win into an order
                  → BUYER pays via Razorpay
```

### Auction lifecycle

`upcoming` → `live` → `completed`

Nobody sets the status. Two `updateMany` calls compare the clock, triggered by an interval in development and by a cron-called endpoint in production — because Passenger idles the Node process on shared hosting, so `setInterval` cannot be relied on.

```bash
curl -H "x-cron-secret: SECRET" https://yourdomain.com/api/cron/update-statuses
```

### Scheduling an auction

The seller form does not take two raw datetime fields. It takes a mode and a duration:

- **Start immediately** — backdates the start by a minute, so the auction is live on submit rather than waiting for the status job
- **Schedule for later** — a date picker plus separate hour, minute and **AM/PM buttons**

`datetime-local` renders as 12-hour or 24-hour depending on the browser's locale, which is how an auction ends up scheduled for 5:10 am instead of pm and arrives already completed. Explicit controls remove the ambiguity.

A live preview shows the resulting status and closing time before submitting, and `createAuction` rejects an end time that is invalid, before the start, or already past.

### Two bid fields, two jobs

| Field | Means | Used for |
|---|---|---|
| `currentBid` | Highest bid **placed** | The atomic race guard, and the minimum next bid |
| `highestApprovedBid` | Highest bid **approved** | Everything shown to users |

They are separate deliberately. The atomic guard filters on `currentBid < amount`, which is what stops two simultaneous bids of the same value both succeeding. If that field only moved on approval, the guard would have nothing to compare against — so a second field carries the display price.

`highestApprovedBid` is raised on approval and **recomputed on rejection**, so rejecting the top bid falls back to the next approved one rather than to zero.

---

## Security

### Access model

**Browsing requires an account.** Every endpoint except authentication, the contact form and the AI assistant sits behind `protect`, including the auction and category listings. A signed-out visitor sees empty pages — the catalogue is a member benefit rather than a shop window.

That is a deliberate choice, not an oversight. To open browsing to visitors, drop `protect` and `authorizeRoles` from the three `GET` routes in `auctionRoutes.js` and the list route in `categoryRoutes.js`. Bidding would still require an account, since `POST /api/bids` keeps its guards.

| Fully public | |
|---|---|
| `/api/auth/*` | register, login, verify, reset, confirm email change |
| `/api/contact` | the contact form |
| `/api/ai` | the assistant |
| `/api/orders/webhook` | Razorpay, authenticated by signature instead |

### Three authorisation layers

| Layer | Question | Code | Failure |
|---|---|---|---|
| 1 | Who are you? | `protect` — verifies the JWT, sets `req.user` | 401 |
| 2 | What may you do? | `authorizeRoles(...)` — a higher-order middleware | 403 |
| 3 | Is this **yours**? | Ownership checks inside controllers | 403 |

Layer 3 matters because being *a* seller does not make you *the* seller of a given product. Eleven such checks exist across the controllers.

**The React route guard is not security.** Edit `role` in localStorage and the admin dashboard renders — but every API call still carries the original signed token, so all of them return 403. The guard is user experience; the server is the security.

### Payments

The browser posts three values after checkout. Anyone can forge that request, so the server **ignores the signature that arrived and recomputes its own**:

```js
HMAC_SHA256(order_id + "|" + payment_id, RAZORPAY_KEY_SECRET)
```

Forging a match requires the secret, which only the server holds.

A **webhook** backs this up: if the buyer closes the browser before the callback fires, Razorpay calls the server directly and retries until it gets a 200. The callback is for user experience; the webhook is for truth.

An order can only reach `confirmed` through verified payment — the update route refuses that status outright.

### Token flows

Email verification, password reset and email change share one pattern:

- A random token is emailed; only its **SHA-256 hash** is stored
- Expiry lives **inside the query**, so an expired token simply matches nothing
- Fields are cleared on use, making every link single-use

**Email changes use an escrow.** The new address goes into `pendingEmail` and `user.email` is untouched. A confirmation goes to the new inbox and a warning to the old one. The swap happens only when the new mailbox confirms.

Without this, a stolen session could point the account at an attacker's inbox, then use Forgot Password to seize it permanently. With it, an attacker needs the session, the password **and** that mailbox — and the real owner is warned immediately.

### Other measures

- bcrypt with cost factor 10 — salted automatically, deliberately slow
- Login returns the **same** 401 for an unknown email and a wrong password, preventing user enumeration
- Blocked accounts are refused at login
- reCAPTCHA on register, login, forgot-password and contact
- Secrets live only in environment variables

---

## Categories

A self-referencing schema, capped at two levels.

```js
parent: { type: ObjectId, ref: "Category", default: null }
```

`null` means top level. Name uniqueness is **per parent**, via a compound index:

```js
categorySchema.index({ name: 1, parent: 1 }, { unique: true });
```

So "Watches" can exist under both Electronics and Collectibles.

**Four rules the controller enforces:**

1. Maximum two levels — nothing in a schema can express *"my parent must have a null parent"*
2. A category cannot be its own parent
3. A category with children cannot become a child
4. Deletes **refuse** rather than orphan, naming the count of subcategories or products still pointing at it

> **Migration:** Mongoose creates the compound index but does **not** drop an older global unique index on `name`. Delete `name_1` in Compass or Atlas, or duplicate subcategory names are still rejected.

---

## Products

| Field | |
|---|---|
| `images` | Up to 5, normalised by Cloudinary to 4:3 at 1200×900 with content-aware cropping |
| `documents` | PDF or Word, stored as Cloudinary `raw`. **Public** — a bidder needs the paperwork before bidding, not after winning |
| `condition` | `new` · `like-new` · `good` · `fair` · `for-parts` |
| `brand`, `model` | Optional text |
| `specifications` | Free-form `{ label, value }` pairs, so a motorcycle lists engine capacity and a laptop lists RAM without separate schemas |
| `collectionDetails` | Pickup or shipping terms |

All optional except name, description, category and starting price.

> **The optional fields are hidden in the seller form.** Condition, brand, model, specifications, collection details and document upload sit behind `SHOW_OPTIONAL_FIELDS` in `AddProduct.jsx`, currently `false`, to keep listing quick. They remain in the model, are still accepted by the controller, and still render on the auction detail page for any product that has them. Set the constant to `true` to bring the inputs back — nothing else needs changing.

---

## Project structure

```
backend/
├── server.js              entry: middleware, routes, static, SPA fallback, cron
├── client/                the compiled React build (production only)
├── config/                db · cloudinary · razorpay
├── middlewares/           protect · authorizeRoles · upload
├── models/                9 Mongoose schemas
├── controllers/           11 controllers — all business logic
├── routes/                12 route files — paths and permissions only
└── utils/                 recaptcha

frontend/
├── index.html             loads config.js BEFORE the bundle
├── vite.config.js
├── public/config.js       sets window.__APP_CONFIG__
└── src/
    ├── config.js          reads it
    ├── api/axios.js       request interceptor attaches the JWT
    ├── App.jsx            route table with layout-route guards
    ├── component/         shared UI
    ├── pages/             public pages
    └── dashboards/        admin · seller · customer
```

Routes declare *what is allowed*. Controllers decide *what happens*. Models define *what the data is*.

---

## Deployment

Single origin: one Express process serves the API at `/api/*` and the React build as static files, with an SPA fallback for everything else. **CORS never applies.**

```bash
cd frontend && npm run build     # produces dist/
# upload the CONTENTS of dist/ into backend/client/
```

Then set the environment variables, run `npm install` on the server, and restart.

### Two things that catch people out

**`app.get("*")` throws on Express 5.** The path parser changed and a bare `*` is invalid:

```
Missing parameter name at index 1: *
```

The SPA fallback uses middleware form instead.

**Passenger idles the process**, so the in-app scheduler does not fire in production. Auction statuses are driven by a cron job hitting a secret-protected endpoint.

---

## Known limitations

Volunteered rather than hidden.

| Area | |
|---|---|
| **Indexes** | None beyond `_id`, `users.email` and the category compound index. `bids.auction`, `bids.bidder`, `products.seller`, `auctions.seller` and `auctions.status` are all on hot paths and unindexed |
| **Tests** | None |
| **Starting price** | `placeBid` compares against `currentBid` only, so a bid below `startingPrice` is accepted while no bids exist |
| **Admin orders** | `getOrders` is a two-way ternary, so an admin matches neither branch and sees nothing |
| **Cascades** | Deleting an auction, product or user orphans its references. Only categories refuse |
| **Pagination** | None — every list fetches the whole collection |
| **Error handling** | The same try/catch is repeated in ~45 controllers; no global handler |
| **401 handling** | No Axios response interceptor, so an expired token shows an alert rather than redirecting |
| **AI assistant** | Not database-aware — it can explain how bidding works, but will invent an answer about what is live now |
| **Completed auctions are editable** | `updateAuction` has an ownership check but no status guard, so a seller can set a finished auction back to `live` |
| **Deletes orphan their references** | Removing an auction, product or user leaves bids and orders pointing at a missing document. Only the category controller refuses |
| **Bids can be re-decided** | An approved bid can be rejected after an admin has created the order, leaving the two records contradicting each other |
| **`cancelled` status** | Present in the auction enum; nothing implements it |
| **Discounts page** | UI only, no backend |

---

## Roadmap

Correctness before features.

1. The five missing indexes
2. `startingPrice` validation in the atomic filter
3. Immutability guards — refuse edits and deletes once an auction completes or an order exists
4. Admin order visibility
5. Tests — Jest and Supertest over the auth middleware and the bid pipeline
6. Global error-handling middleware
7. Socket.IO for real-time bidding
8. Refresh tokens plus a 401 response interceptor
9. Rate limiting on auth and AI routes
10. Pagination
11. A database-aware AI assistant