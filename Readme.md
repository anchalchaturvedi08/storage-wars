# Storage Wars

> **A full-stack online auction platform built on the MERN stack.**
> Complete project documentation and interview preparation guide.

**Project name:** Storage Wars
**Project type:** Full-stack online auction platform (MERN)
**Roles:** Admin · Seller · Customer (Buyer)
**Source analysed:** `bidvault-fullstack.zip` — complete backend and frontend source

| | |
|---|---|
| **Frontend** | React 18 · React Router 7 · Axios · Tailwind CSS 3 · Vite 6 · lucide-react |
| **Backend** | Node.js · Express 5 · Mongoose 9 · JWT · bcryptjs · Nodemailer · @google/genai |
| **Database** | MongoDB — `mongodb://localhost:27017/Storagewars` |
| **Collections** | 9 |
| **Route modules** | 12 |
| **Controllers** | 11 |
| **React components** | ~40 |
| **Dashboard pages** | 20 (8 admin · 6 seller · 6 customer) |

---

## Quick Start

```bash
# 1. Ensure MongoDB is running locally

# 2. Backend
cd backend
npm install
npm run dev          # nodemon server.js  →  port 5000

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev          # vite  →  port 5173
```

**Startup order matters.** If the backend is not running first, every dashboard page shows a "Failed to fetch..." alert, because each one calls the API inside `useEffect` on mount.

### Required `backend/.env`

```
PORT = 5000
MONGO_URI = mongodb://localhost:27017/Storagewars
JWT_SECRET = <a long random string>
GEMINI_API_KEY = <key>
EMAIL_USER = <gmail address>
EMAIL_PASS = <16-character Gmail App Password>
```

---

## Table of Contents

**Orientation**
- [Important note on the project name](#important-note-on-the-project-name)
- [How this document was produced](#how-this-document-was-produced)
- [Verified project structure](#verified-project-structure)

**Part 1–4 — Introduction and setup**
- [Part 1 — Project introduction](#part-1--project-introduction)
- [Part 2 — Project architecture](#part-2--project-architecture)
- [Part 3 — Technology stack](#part-3--technology-stack)
- [Part 4 — Project setup from scratch](#part-4--project-setup-from-scratch)

**Part 5–11 — Frontend**
- [Part 5 — Frontend folder structure](#part-5--frontend-folder-structure)
- [Part 6 — React fundamentals used in this project](#part-6--react-fundamentals-used-in-this-project)
- [Part 7 — React intermediate concepts](#part-7--react-intermediate-concepts)
- [Part 8 — React Router](#part-8--react-router)
- [Part 9 — Authentication](#part-9--authentication)
- [Part 10 — Axios interceptor](#part-10--axios-interceptor)
- [Part 11 — Authorization](#part-11--authorization)

**Part 12–13 — Backend and database**
- [Part 12 — Backend architecture](#part-12--backend-architecture)
- [Part 13 — MongoDB + Mongoose](#part-13--mongodb--mongoose)

**Part 14–25 — Module by module**
- [Part 14 — User module](#part-14--user-module)
- [Part 15 — Category module](#part-15--category-module)
- [Part 16 — Product module](#part-16--product-module)
- [Part 17 — Auction module](#part-17--auction-module)
- [Part 18 — Bid module](#part-18--bid-module)
- [Part 19 — Order module](#part-19--order-module)
- [Part 20 — Watchlist](#part-20--watchlist)
- [Part 21 — Notifications](#part-21--notifications)
- [Part 22 — Reports](#part-22--reports)
- [Part 23 — Dashboards](#part-23--dashboards)
- [Part 24 — Contact Us](#part-24--contact-us)
- [Part 25 — Gemini AI chatbot](#part-25--gemini-ai-chatbot)

**Part 26–32 — Reference and testing**
- [Part 26 — Complete API documentation](#part-26--complete-api-documentation)
- [Part 27 — Complete request lifecycle — seven worked examples](#part-27--complete-request-lifecycle--seven-worked-examples)
- [Part 28 — Multi-user architecture](#part-28--multi-user-architecture)
- [Part 29 — Security](#part-29--security)
- [Part 30 — Error handling](#part-30--error-handling)
- [Part 31 — Postman testing](#part-31--postman-testing)
- [Part 32 — MongoDB Compass testing](#part-32--mongodb-compass-testing)

**Part 33–37 — Development history and code detail**
- [Part 33 — Real development problems](#part-33--real-development-problems)
- [Part 34 — Design decisions](#part-34--design-decisions)
- [Part 35 — Complete database relationships](#part-35--complete-database-relationships)
- [Part 36 — File-by-file explanation](#part-36--file-by-file-explanation)
- [Part 37 — Line-level concept explanation](#part-37--line-level-concept-explanation)

**Part 38–42 — Interview and presentation**
- [Part 38 — Interview question bank](#part-38--interview-question-bank)
- [Part 39 — "Why did you use...?"](#part-39--why-did-you-use)
- [Part 40 — Cross questions](#part-40--cross-questions)
- [Part 41 — Presentation script](#part-41--presentation-script)
- [Part 42 — Live demonstration script](#part-42--live-demonstration-script)

**Part 43–50 — Limitations and revision**
- [Part 43 — Project limitations](#part-43--project-limitations)
- [Part 44 — Future scope](#part-44--future-scope)
- [Part 45 — Final cheat sheet](#part-45--final-cheat-sheet)
- [Part 46 — One-line definitions](#part-46--one-line-definitions)
- [Part 47 — Interview simulation](#part-47--interview-simulation)
- [Part 48 — Presentation and delivery notes](#part-48--presentation-and-delivery-notes)
- [Part 49 — Document coverage summary](#part-49--document-coverage-summary)
- [Part 50 — Closing note](#part-50--closing-note)

---

## Important note on the project name

The zip folder, some CSS class names and a few legacy comment lines contain the word **bidvault**. That is only the old folder name. The actual project name used everywhere in the running application is **Storage Wars**:

| Where | What the code actually says |
|---|---|
| `backend/server.js` root route | `res.send("Storage Wars Backend is running...")` |
| `backend/.env` | `MONGO_URI = mongodb://localhost:27017/Storagewars` |
| `backend/.env` | `JWT_SECRET = storage_wars_secret_key` |
| `backend/controllers/contactController.js` | subject: `Storage Wars Contact Message from ${name}` |
| `backend/routes/aiRoutes.js` | prompt: `You are StorageWars AI, an assistant for a storage auction website` |
| `frontend/index.html` | `<title>Storage Wars</title>` |
| `frontend/package.json` | `"name": "StorageWars-ui-complete"` |
| `Navbar.jsx`, `Footer.jsx`, `About.jsx` | brand text `StorageWars` |

Throughout this document the project is called **Storage Wars**.

---

## How this document was produced

Every statement below was verified against the actual files in the uploaded project. Where something is **not** implemented, this document says so directly. Where the implementation has an unusual or limiting behaviour, that behaviour is explained rather than hidden — because an interviewer who reads your code will find it, and explaining it yourself is far stronger than being caught by it.

Two labels are used consistently:

- **Possible improvement — not part of the current implementation.** Suggestions only. Never claim these in a viva.
- **Not implemented in the current project.** Features you should not claim.

---

## Verified project structure

### Backend (actual)

```
backend/
├── .env                     (git-ignored)
├── .gitignore               (node_modules/, .env)
├── note.txt                 (your own study notes)
├── package.json
├── server.js
├── config/
│   └── db.js
├── controllers/
│   ├── auctionController.js
│   ├── authController.js
│   ├── bidController.js
│   ├── categoryController.js
│   ├── contactController.js
│   ├── notificationController.js
│   ├── orderController.js
│   ├── productController.js
│   ├── reportController.js
│   ├── userController.js
│   └── watchlistController.js
├── middlewares/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/
│   ├── Auction.model.js
│   ├── Bid.model.js
│   ├── Category.model.js
│   ├── Contact.model.js
│   ├── Notification.model.js
│   ├── Order.model.js
│   ├── Product.model.js
│   ├── User.model.js
│   └── Watchlist.model.js
└── routes/
    ├── aiRoutes.js
    ├── auctionRoutes.js
    ├── authRoutes.js
    ├── bidRoutes.js
    ├── categoryRoutes.js
    ├── contactRoutes.js
    ├── notificationRoutes.js
    ├── orderRoutes.js
    ├── productRoutes.js
    ├── reportRoutes.js
    ├── userRoutes.js
    └── watchlistRoutes.js
```

**Two corrections to the structure you assumed:**

1. There is **no `aiController.js`**. The entire Gemini logic lives inside `routes/aiRoutes.js`. This is the only route file that contains business logic instead of delegating to a controller.
2. `watchlistRoutes.js` exists (it was missing from your assumed list), and `contactRoutes.js` / `contactController.js` / `Contact.model.js` all exist exactly as you described.

### Frontend (actual)

```
frontend/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── .gitignore              (node_modules/ only)
├── ProjectDetails.txt      (your original UI-phase requirement document)
├── notes.txt               (your own study notes)
├── public/
│   ├── hero.jpg
│   └── warehouse.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data.js                    ← static demo data, still used by Home/Hero/Categories
    ├── navigation.js              ← sidebar menu definitions for all 3 roles
    ├── api/
    │   └── axios.js               ← Axios instance + request interceptor
    ├── component/
    │   ├── auctioncard/AuctionCard.jsx + .css
    │   ├── backtotop/BackToTop.jsx + .css
    │   ├── buyercard/BuyerCard.jsx + .css
    │   ├── categorycard/CategoryCard.jsx + .css
    │   ├── chatbox/ChatBot.jsx + .css
    │   ├── dashboard/
    │   │   ├── DashboardLayout.jsx + .css
    │   │   ├── SellerLayout.jsx + .css
    │   │   ├── BuyerLayout.jsx + .css
    │   │   ├── StatGrid.jsx + .css
    │   │   └── DataTable.jsx + .css
    │   ├── footer/Footer.jsx + .css
    │   ├── hero/Hero.jsx + .css
    │   ├── layout/Layout.jsx + .css
    │   ├── navbar/Navbar.jsx + .css
    │   ├── protectedroute/ProtectedRoute.jsx
    │   └── timer/Timer.jsx + .css
    ├── dashboards/
    │   ├── admin/     AdminDashboard, AuctionListings, BidApprovals, Users,
    │   │              Products, Categories, Discounts, Reports
    │   ├── bidder/    BidderDashboard, AddProduct, MyProducts, MyAuctions,
    │   │              BidsReceived, AuctionResults
    │   └── customer/  CustomerDashboard, MyBids, Watchlist, WonAuctions,
    │                  Orders, Notifications
    ├── data/
    │   └── demoData.js.txt        ← empty file (0 bytes), not imported anywhere
    ├── pages/
    │   ├── about/About.jsx
    │   ├── auctions/Auctions.jsx
    │   ├── categories/Categories.jsx
    │   ├── contact/Contact.jsx
    │   ├── detail/AuctionDetail.jsx
    │   ├── home/Home.jsx
    │   ├── login/Login.jsx
    │   ├── notfound/NotFound.jsx
    │   └── register/Register.jsx
    └── utils/
        └── formatters.js
```

Note: the seller dashboard folder is named **`bidder/`**, not `seller/`. The route prefix is `/seller`, the role string in the database is `"seller"`, but the folder and the dashboard component are called `bidder`. This comes from your original requirement document, which called the seller a "Bidder". If an interviewer asks, say exactly that — it is a naming legacy, not a separate role.

---

# PART 1 — PROJECT INTRODUCTION

## 1.1 What is Storage Wars?

Storage Wars is a full-stack online auction platform where sellers list products for auction, customers place competitive bids within a fixed time window, the seller (or admin) approves or rejects each bid, and the highest approved bid becomes the winning bid, which is then converted into an order.

The concept is inspired by storage-unit auctions. The application itself is a general-purpose auction marketplace built with React on the frontend and Node.js, Express and MongoDB on the backend.

## 1.2 What problem does it solve?

A traditional auction requires everyone to be physically present at the same place at the same time. That limits the number of bidders, limits the seller's reach, and makes record-keeping manual.

Storage Wars solves this by:

- Letting a seller list a product and define an auction window (`startTime` to `endTime`) from anywhere.
- Letting any registered customer see live auctions and place a bid from anywhere.
- Storing every bid as a permanent database document with the bidder's identity, amount and timestamp, so nothing is disputed later.
- Giving the seller an approval step, so a seller is never forced to accept a suspicious or unserious bid.
- Automatically moving auctions from `upcoming` to `live` to `completed` based on the clock, without any manual intervention.
- Producing an auditable trail: user → product → auction → bid → order.

## 1.3 Why an online auction platform is useful

| Traditional auction | Storage Wars |
|---|---|
| Fixed physical location | Accessible from any browser |
| Limited bidders | Unlimited registered customers |
| Manual bid records | Every bid stored as a MongoDB document |
| No verification of participants | JWT-authenticated accounts with roles |
| Seller has no control after the hammer falls | Seller approves or rejects each bid |
| Results are announced verbally | Winner determined by a query on the highest approved bid |

## 1.4 Main objective

To build a working, role-based, database-driven auction system that demonstrates the complete flow of a full-stack application: React UI → Axios HTTP request → Express route → middleware → controller → Mongoose model → MongoDB → response → React state → re-render.

## 1.5 Who are the users?

Three roles, defined by the `role` field in `User.model.js` with `enum: ["admin", "seller", "customer"]` and `default: "customer"`.

## 1.6 What can each role do? (verified against actual routes)

### Admin
- View, update and delete any user; block/unblock a user by changing `status` (`/api/users`, admin only)
- Full CRUD on categories (`/api/categories`) — **only the admin can create a category**
- View all products and change any product's fields (`GET /api/products`, `PATCH /api/products/:id`)
- Create, view, update and delete auctions (`/api/auctions`)
- View **all** bids in the system and approve or reject any of them (`GET /api/bids`, `PATCH /api/bids/:bidId/status`)
- Generate an order from a completed auction (`POST /api/orders/from-auction/:auctionId`) — **only the admin can do this**
- Delete an order (`DELETE /api/orders/:id`) — admin only
- Create a notification for any user (`POST /api/notifications`) — admin only
- View platform reports (`GET /api/reports`) — admin only

**Admin cannot create a product.** `POST /api/products` is restricted to `authorizeRoles("seller")`. This is a real detail of your implementation and worth stating confidently.

### Seller
- Create products (`POST /api/products`)
- Update or delete **only their own** products — enforced in `productController.js` by comparing `String(product.seller) !== String(req.user.id)`
- Create auctions, and update or delete **only their own** auctions
- See only the bids placed on their own auctions (`GET /api/bids` returns a filtered list for sellers)
- Approve or reject bids on their own auctions only
- View orders where they are the seller (`GET /api/orders`)

**A seller cannot place a bid.** `POST /api/bids` is restricted to `authorizeRoles("customer")`, and `bidController.placeBid` additionally rejects a seller bidding on their own auction.

### Customer (Buyer)
- Register and log in
- Browse auctions and auction detail pages
- Place bids (`POST /api/bids`)
- See only their own bids (`GET /api/bids/my`)
- Add, view and remove watchlist items (`/api/watchlist` — customer only)
- View won auctions (`GET /api/orders/won`) and their orders (`GET /api/orders`)
- Update their own order status (`PATCH /api/orders/:id`)
- View and mark their notifications as read

## 1.7 What makes this a full-stack project?

| Layer | Technology | Evidence in this project |
|---|---|---|
| Presentation | React 18 + React Router 7 + Tailwind | `src/pages`, `src/dashboards`, `src/component` |
| Client-side networking | Axios with a request interceptor | `src/api/axios.js` |
| Web server | Express 5 | `server.js` |
| Application logic | Controllers + middleware | `controllers/`, `middlewares/` |
| Data modelling | Mongoose 9 schemas | `models/` |
| Database | MongoDB (local) | `mongodb://localhost:27017/Storagewars` |
| External services | Gmail SMTP via Nodemailer, Google Gemini | `contactController.js`, `aiRoutes.js` |
| Security | JWT + bcryptjs + role middleware | `authController.js`, `authMiddleware.js`, `roleMiddleware.js` |

## 1.8 Major modules

1. Authentication (register + login + JWT)
2. Users (admin management, block/unblock)
3. Categories (admin CRUD)
4. Products (seller CRUD with ownership enforcement)
5. Auctions (creation, automatic status lifecycle, winner lookup)
6. Bids (placement, validation, approval workflow)
7. Orders (created from a completed auction's highest approved bid)
8. Watchlist (customer-only saved auctions)
9. Notifications (generated automatically on bid approval/rejection)
10. Reports (admin analytics via MongoDB aggregation)
11. Contact Us (public form + database record + email via Gmail SMTP)
12. AI Assistant (Gemini-powered chatbot widget)

## 1.9 Complete business workflow (as actually implemented)

```
Admin creates Categories
        ↓
Seller registers  →  logs in  →  receives JWT
        ↓
Seller creates a Product      (POST /api/products, seller: req.user.id)
        ↓
Seller creates an Auction     (POST /api/auctions, status: "upcoming")
        ↓
Clock reaches startTime  →  status becomes "live"
   (updateAuctionStatuses() runs every 60s in server.js
    and again on every GET /api/auctions)
        ↓
Customer opens the auction, sees currentBid + countdown Timer
        ↓
Customer places a Bid         (POST /api/bids, status: "pending")
   Backend validates: auction exists, not own auction,
   auction is live, not expired, amount > currentBid
        ↓
Auction.currentBid is updated to the new amount immediately
        ↓
Seller (or Admin) approves or rejects the bid
   (PATCH /api/bids/:bidId/status)
        ↓
A Notification document is created for the bidder
        ↓
Clock reaches endTime  →  auction status becomes "completed"
        ↓
Winner = highest bid on that auction with status "approved"
   (GET /api/auctions/:id/winner)
        ↓
Admin converts the completed auction into an Order
   (POST /api/orders/from-auction/:auctionId)
        ↓
Customer sees it under Won Auctions and can mark it "confirmed"
```

---

## 1.10 Spoken introductions

### A) 30-second introduction

> "I have developed a full-stack online auction platform called Storage Wars. It has three roles — admin, seller and customer. A seller lists a product and creates an auction with a start and end time, customers bid on it while it's live, and the seller approves the winning bid, which then becomes an order. I built the frontend in React with React Router and Axios, and the backend in Node.js and Express with MongoDB and Mongoose. Authentication is JWT-based with bcrypt password hashing and role-based route protection on both the frontend and the backend."

### B) 1-minute introduction

> "I have developed a full-stack online auction platform called Storage Wars, inspired by storage-unit auctions.
>
> There are three roles. A seller creates a product, then creates an auction on that product with a starting price, a start time and an end time. Customers browse live auctions, see the current bid and a live countdown timer, and place their own bid. Every bid is stored with a status of pending. The seller — or the admin — then approves or rejects it, and the system automatically creates a notification for that bidder. When the auction ends, the highest approved bid is the winner, and the admin converts that auction into an order.
>
> On the frontend I used React with React Router for routing and Axios for API calls, with a request interceptor that attaches the JWT to every protected request automatically. On the backend I used Express with a routes-controllers-models structure, Mongoose for schema modelling, JWT for authentication and bcryptjs for password hashing. I also added a Contact Us form that stores the message in MongoDB and sends an email through Gmail SMTP using Nodemailer, and an AI assistant widget using the Gemini API."

### C) 2-minute introduction

> "I have developed a full-stack online auction platform called Storage Wars. The idea came from storage-unit auctions — the excitement of bidding on something whose value isn't fully known.
>
> The application has three roles stored in the user document as an enum: admin, seller and customer.
>
> The seller side works like this. A seller registers and logs in and receives a JWT. From the seller dashboard they add a product — name, description, category, starting price. The backend automatically attaches `seller: req.user.id` from the decoded token, so a seller can never create a product on someone else's behalf. Then they create an auction on that product with a start time and end time. The auction starts as 'upcoming'.
>
> On the customer side, a customer sees all auctions with their status and a live countdown timer, opens an auction detail page and places a bid. The backend validates five things before accepting: the auction exists, the bidder isn't the seller of that auction, the auction status is 'live', the end time hasn't passed, and the amount is strictly greater than the current bid. If all pass, a bid document is created with status 'pending' and the auction's currentBid is updated.
>
> The seller then sees that bid under 'Bids Received' and approves or rejects it. That triggers a notification document for the bidder, which they see in their notifications page.
>
> When the end time passes, a scheduled function that runs every minute in server.js moves the auction to 'completed'. The winner endpoint then finds the highest bid on that auction with status 'approved'. The admin converts the completed auction into an order, which stores the auction, product, buyer, seller and amount.
>
> Technically: React 18, React Router 7, Axios with an interceptor, Tailwind for styling, Lucide React for icons. Backend is Express 5 with Mongoose 9 on MongoDB. Authentication uses jsonwebtoken and bcryptjs, authorization uses a custom `authorizeRoles` middleware, and the admin analytics page uses MongoDB aggregation pipelines. I also integrated Nodemailer with Gmail SMTP for the Contact Us form and the Google Gemini API for a help chatbot."

### D) 5-minute detailed explanation

Use this structure and speak it in your own words:

**1. The problem and the idea (30 s)**
Physical auctions limit who can participate and leave no reliable record. Storage Wars makes the whole cycle — listing, bidding, approval, winner determination and order creation — digital and auditable.

**2. Architecture (45 s)**
"It's a three-tier architecture. React runs in the browser and holds all UI state. Axios sends HTTP requests to an Express server on port 5000. Express matches the URL to a route file, runs the `protect` middleware which verifies the JWT, then `authorizeRoles` which checks the role, then the controller, which uses a Mongoose model to talk to MongoDB. The response comes back as JSON, I store it in React state with `setState`, and React re-renders."

**3. Authentication (45 s)**
"Registration sends the form to `POST /api/auth/register`. The controller checks whether the email already exists, hashes the password with bcrypt using 10 salt rounds, and creates the user. I never store the plain password. Login finds the user by email, compares the entered password with `bcrypt.compare`, and if it matches, signs a JWT containing the user's id and role with a one-day expiry. The frontend stores the token and the user object in localStorage and redirects to the correct dashboard based on role."

**4. Authorization (45 s)**
"There are two layers. On the frontend, a `ProtectedRoute` component reads the token and user from localStorage and either renders an `Outlet` or redirects. That's for user experience only. The real enforcement is on the backend: `protect` verifies the token signature and puts the decoded payload on `req.user`, then `authorizeRoles('seller')` checks `req.user.role`. Beyond role checks, controllers also do ownership checks — for example, updating a product compares `product.seller` with `req.user.id` and returns 403 if they don't match."

**5. Data model (45 s)**
"Nine collections. User, Category, Product, Auction, Bid, Order, Watchlist, Notification and Contact. Relationships are stored as ObjectId references with `ref`, and I use `populate()` to expand them — for example, when fetching auctions I populate the product name and images and the seller's name and email, so the frontend gets a ready-to-render object in one request."

**6. The bidding logic (60 s)**
Explain the five validations, the pending status, the currentBid update, and the seller approval step. Then be honest: "One thing I'd change in a production version is that I update `currentBid` as soon as a bid is placed, before approval. So `currentBid` currently reflects the latest bid, not the latest approved bid. The winner is still computed correctly, because the winner endpoint queries only approved bids and sorts by amount descending."

**7. Extra integrations and honesty about scope (45 s)**
"I added a Contact Us form that saves to MongoDB and sends an email through Gmail SMTP with Nodemailer using an app password stored in the .env file, and a Gemini-powered chatbot that answers general questions about how the site works. The chatbot is not connected to the database — it doesn't know live auction data, and I state that clearly rather than overselling it. Payment gateway, image upload and real-time WebSocket bidding are future scope, not implemented."

---

# PART 2 — PROJECT ARCHITECTURE

## 2.1 The complete request path

```
USER (browser)
   ↓  clicks a button / submits a form
REACT COMPONENT           e.g. AddProduct.jsx
   ↓  event handler runs, reads useState values
REACT ROUTER              already decided WHICH component is on screen
   ↓
AXIOS INSTANCE            src/api/axios.js  (baseURL http://localhost:5000/api)
   ↓
REQUEST INTERCEPTOR       reads localStorage token, sets Authorization header
   ↓
HTTP REQUEST              POST /api/products  { name, description, ... }
   ↓  crosses network boundary
EXPRESS SERVER            server.js listening on PORT 5000
   ↓  app.use(cors())      → allows the cross-origin request
   ↓  app.use(express.json()) → parses the JSON body into req.body
   ↓  app.use("/api/products", productRoutes)
ROUTE FILE                routes/productRoutes.js matches POST "/"
   ↓
MIDDLEWARE 1: protect     verifies JWT → sets req.user = { id, role }
   ↓  next()
MIDDLEWARE 2: authorizeRoles("seller")  → checks req.user.role
   ↓  next()
CONTROLLER                controllers/productController.js → createProduct
   ↓
MONGOOSE MODEL            models/Product.model.js → Product.create({...})
   ↓  validates against the schema, casts types
MONGODB                   writes the document into the "products" collection
   ↓  returns the saved document
CONTROLLER                res.status(201).json({ success, message, product })
   ↓
HTTP RESPONSE
   ↓
AXIOS resolves the promise
   ↓
REACT                     setSaved(true) / setProducts(...)
   ↓
RE-RENDER                 the UI updates
```

## 2.2 What happens at each layer

### In the browser
The browser loads `index.html`, which loads `/src/main.jsx` as an ES module (Vite serves it). `main.jsx` mounts React into `<div id="root">` and wraps `<App />` in `<BrowserRouter>`, which is what makes client-side URL routing possible.

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

### In React
`App.jsx` contains only the route table. React Router looks at `window.location.pathname` and renders the matching component. No page reload happens on navigation — React swaps the component tree.

### When Axios sends a request
`api.post("/products", {...})` resolves to `http://localhost:5000/api/products` because of the configured `baseURL`. Before the request leaves, the interceptor runs and attaches `Authorization: Bearer <token>`. Axios then serialises the JavaScript object to JSON and sets `Content-Type: application/json`.

### What Express does
`app.use(cors())` adds the `Access-Control-Allow-Origin` header so the browser permits the response from port 5000 to reach a page served from port 5173. `app.use(express.json())` reads the request body stream and parses it into `req.body`. Then Express walks its mounted routers in order until a path matches.

### What middleware does
Middleware is a function with the signature `(req, res, next)`. It sits between the request and the controller and can either pass control forward with `next()` or end the request with a response. In this project:

- `protect` answers **"who is this?"** — it verifies the JWT and attaches `req.user`.
- `authorizeRoles(...)` answers **"is this person allowed here?"** — it checks `req.user.role`.

### What the controller does
The controller holds business logic: reading `req.body` and `req.params`, validating, calling the model, and shaping the JSON response. Every controller in this project follows the same shape — a `try` block with the logic and a `catch` block that returns a 500 with `error.message`.

### What Mongoose does
Mongoose sits between your JavaScript and MongoDB. It gives you a schema (structure and rules), casting (a string `"5000"` becomes the Number `5000`), validation (`required`, `min`, `enum`), and query helpers (`find`, `findById`, `findOneAndUpdate`, `populate`, `aggregate`).

### What MongoDB does
MongoDB stores each record as a BSON document inside a collection. Each document gets an automatic `_id` of type ObjectId. Because `timestamps: true` is set on every schema in this project, each document also gets `createdAt` and `updatedAt`.

### How the response returns
The controller calls `res.status(...).json(...)`. Express serialises the object and writes it to the socket. Axios resolves the promise with `response.data`. Your component calls a state setter, React marks the component dirty, computes the new virtual DOM, diffs it against the previous one, and applies only the changed nodes to the real DOM.

## 2.3 Architecture with multiple simultaneous users

Node.js is single-threaded but non-blocking. Every incoming request is handled on the same event loop; when a controller awaits a database call, Node does not sit idle — it processes other requests and comes back when MongoDB responds.

There is exactly **one** frontend build, **one** Express server and **one** MongoDB database. What separates users is not separate code but separate **tokens**:

```
Seller A's browser     localStorage.token = JWT(A)  → req.user = { id: A, role: "seller" }
Customer B's browser   localStorage.token = JWT(B)  → req.user = { id: B, role: "customer" }
Customer C's browser   localStorage.token = JWT(C)  → req.user = { id: C, role: "customer" }
Admin D's browser      localStorage.token = JWT(D)  → req.user = { id: D, role: "admin" }
```

Every protected controller derives its data scope from `req.user`, not from anything the client sends:

| Controller | Scoping expression |
|---|---|
| `productController.createProduct` | `seller: req.user.id` |
| `bidController.getMyBids` | `Bid.find({ bidder: req.user.id })` |
| `watchlistController.getWatchlist` | `Watchlist.find({ user: req.user.id })` |
| `notificationController.getNotifications` | `Notification.find({ user: req.user.id })` |
| `orderController.getOrders` | `role === "seller" ? { seller: id } : { buyer: id }` |
| `bidController.getAllBids` | sellers filtered to bids on their own auctions |

Because `req.user` comes from a cryptographically signed token that the server verifies with `JWT_SECRET`, a user cannot fake being someone else without the secret.

**Interview question:** "If all users hit the same server, how does the server know whose data to return?"
**Answer:** "Every protected request carries a JWT in the Authorization header. The `protect` middleware verifies it and decodes the payload into `req.user`, which contains the user's MongoDB `_id` and role. Controllers then query using `req.user.id` rather than trusting any id sent from the client. So the identity is derived from the signed token, not from the request body."

---

# PART 3 — TECHNOLOGY STACK

Exact versions from `package.json`:

**Backend**
```json
"@google/genai": "^2.21.0",  "bcryptjs": "^3.0.3",  "cors": "^2.8.6",
"dotenv": "^17.4.2",  "express": "^5.2.1",  "jsonwebtoken": "^9.0.3",
"mongoose": "^9.9.4",  "nodemailer": "^10.0.1"
devDependencies: "nodemon": "^3.1.14"
```

**Frontend**
```json
"@vitejs/plugin-react": "^4.3.4",  "axios": "^1.20.0",  "lucide-react": "^0.468.0",
"react": "^18.3.1",  "react-dom": "^18.3.1",  "react-router-dom": "^7.18.3",
"vite": "^6.0.5"
devDependencies: "autoprefixer", "postcss", "tailwindcss": "^3.4.17"
```

---

## 3.1 React

**What it is.** A JavaScript library for building user interfaces out of reusable components, using a virtual DOM to update only what changed.

**Why used here.** Storage Wars has many screens that share the same pieces — an auction card appears on Home, on the Auctions listing and inside the Watchlist; a countdown timer appears on the auction card, on the detail page and in the customer's bidding card. Writing those once as components and reusing them is the entire reason for choosing React.

**Where used.** Every file under `src/`. Roughly 40 components.

**Problem it solves.** Without React you would manually query DOM nodes and rewrite `innerHTML` every time a bid changes. With React you change a state variable and the UI follows.

**Without it.** You would need hundreds of lines of imperative DOM manipulation and manual event wiring for the same result, and keeping the auction list, the bid form and the timer in sync would be error-prone.

**Likely interview questions.**
- Why React and not plain JavaScript? → Component reuse, declarative UI, virtual DOM diffing.
- What is the virtual DOM? → An in-memory representation of the UI; React diffs the new tree against the old one and patches only the differences.
- Class components or functional? → Entirely functional components with hooks in this project.

---

## 3.2 React Router (react-router-dom v7)

**What it is.** A client-side routing library that maps URLs to components without full page reloads.

**Why used here.** The project has public pages, plus three separate role-based dashboard areas with six to eight pages each. It also needs a dynamic URL for a single auction.

**Where used.**
- `main.jsx` — `<BrowserRouter>` wrapper
- `App.jsx` — the entire route table
- `ProtectedRoute.jsx` — `Navigate` and `Outlet`
- `Navbar.jsx`, `Footer.jsx`, `AuctionCard.jsx`, `CategoryCard.jsx`, `NotFound.jsx` — `Link`
- `Login.jsx`, `Register.jsx`, `DashboardLayout.jsx` — `useNavigate`
- `AuctionDetail.jsx` — `useParams` to read `:id`
- `DashboardLayout.jsx` — `useLocation` to highlight the active sidebar item

**Problem it solves.** Multi-page behaviour inside a single-page application, plus a single place to declare which routes are protected and for which role.

**Without it.** You would need conditional rendering driven by state for every screen, and the browser URL would never change, so bookmarking or sharing an auction link would be impossible.

---

## 3.3 Axios

**What it is.** A promise-based HTTP client with interceptors, automatic JSON handling and a configurable instance API.

**Why used here.** Two reasons that `fetch` does not give for free:
1. `axios.create({ baseURL })` means the API host is written in one place.
2. `interceptors.request.use()` means the JWT is attached automatically to every request, instead of being repeated in ~25 files.

**Where used.** Defined in `src/api/axios.js`, imported as `api` in every component that talks to the backend.

**Problem it solves.** Repeated boilerplate and a hardcoded server URL scattered across the codebase.

**Without it.** Every call would need `fetch(url, { method, headers: { "Content-Type": ..., Authorization: ... }, body: JSON.stringify(...) })` and a manual `res.json()` step, and changing the API host would mean editing dozens of files.

---

## 3.4 Node.js

**What it is.** A JavaScript runtime built on Chrome's V8 engine that runs JavaScript outside the browser, with a non-blocking event-driven I/O model.

**Why used here.** It lets the same language be used on both sides of the application, and its non-blocking model suits an API server that spends most of its time waiting on the database.

**Where used.** The entire `backend/` folder. Started with `node server.js` (`npm start`) or `nodemon server.js` (`npm run dev`).

---

## 3.5 Express.js (v5)

**What it is.** A minimal web framework for Node that provides routing, middleware and request/response helpers.

**Why used here.** Storage Wars has twelve route groups and a middleware chain per route. Express's `Router` and `app.use()` model maps directly onto that.

**Where used.** `server.js`, all twelve files in `routes/`.

**Problem it solves.** Without Express you would parse the raw `http` module's URL and method by hand, write your own body parser, and build your own middleware chain.

---

## 3.6 MongoDB

**What it is.** A document database that stores JSON-like BSON documents in collections, with no fixed table schema at the database level.

**Why used here.** Auction data is naturally document-shaped. A product has an array of image URLs; MongoDB stores an array natively without a join table. New fields could be added without a migration.

**Where used.** Nine collections: `users`, `categories`, `products`, `auctions`, `bids`, `orders`, `watchlists`, `notifications`, `contacts`. Connected locally at `mongodb://localhost:27017/Storagewars`.

**Note on collection names:** Mongoose pluralises and lowercases the model name automatically. `mongoose.model("Watchlist", ...)` produces the collection `watchlists`; `mongoose.model("Category", ...)` produces `categories`.

---

## 3.7 Mongoose

**What it is.** An ODM (Object Data Modelling) library that adds schemas, validation, type casting, middleware and population on top of the MongoDB driver.

**Why used here.** MongoDB by itself would accept a bid with `amount: "hello"`. Mongoose rejects it because `Bid.model.js` declares `amount: { type: Number, required: true, min: 0 }`.

**Where used.** All nine model files, `config/db.js`, and every controller.

**Key features actually used in this project:**
- `required` with custom messages: `required: [true, "Bid amount is required"]`
- `enum` for status fields
- `unique` on `User.email` and `Category.name`
- `lowercase` and `trim` string setters
- `min: 0` on all money fields
- `timestamps: true` on every schema
- `ObjectId` + `ref` relationships
- `.populate()` including nested population
- `.aggregate()` in `reportController.js`

---

## 3.8 JWT (jsonwebtoken)

**What it is.** JSON Web Token — a signed, self-contained token in three dot-separated Base64URL parts: header, payload, signature.

**Why used here.** The API is stateless. The server does not keep a session store; it can verify who a user is purely from the token they present.

**Where used.**
- Created in `authController.loginUser`:
```js
const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
);
```
- Verified in `middlewares/authMiddleware.js`: `jwt.verify(token, process.env.JWT_SECRET)`

**What it contains in this project.** Exactly two custom claims — `id` and `role` — plus the automatic `iat` (issued at) and `exp` (expiry) claims. **The password is never in the token.**

---

## 3.9 bcryptjs

**What it is.** A pure-JavaScript implementation of the bcrypt password-hashing function. Hashing is one-way: you cannot reverse a hash into the original password.

**Why used here.** If the database is ever exposed, plain-text passwords would compromise every user. Bcrypt also applies a salt automatically, so two users with the same password get different hashes, and it is deliberately slow, which makes brute-force attacks expensive.

**Where used.** `authController.js` only:
```js
const hashedPassword = await bcrypt.hash(password, 10);       // register
const isPasswordCorrect = await bcrypt.compare(password, user.password);  // login
```

`10` is the number of salt rounds — the cost factor.

---

## 3.10 Nodemailer + Gmail SMTP

**What it is.** Nodemailer is a Node library for sending email. SMTP is the protocol; Gmail is the SMTP provider here.

**Why used here.** So a Contact Us submission is not only stored in the database but actually reaches an inbox.

**Where used.** `controllers/contactController.js`:
```js
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});
```

**Important:** `EMAIL_PASS` is a Gmail **App Password**, not the account password. Google blocks plain-password SMTP sign-in for third-party apps; an App Password is a 16-character credential generated specifically for one application and revocable independently.

---

## 3.11 Gemini AI (@google/genai)

**What it is.** Google's official JavaScript SDK for the Gemini family of generative models.

**Why used here.** To provide a help assistant that can answer general questions about auctions and bidding in natural language, without you writing a rules engine.

**Where used.** `routes/aiRoutes.js` — the only route file containing business logic:
```js
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: `You are StorageWars AI, ... User question: ${message}`
});
res.status(200).json({ success: true, reply: response.text });
```

**Correction to a common assumption:** the code uses `ai.models.generateContent(...)` and reads `response.text`. It does **not** use `interactions.create` or `output_text`. Use the actual method names in your viva.

---

## 3.12 Tailwind CSS + per-component CSS

**What it is.** A utility-first CSS framework. Instead of writing `.card { border-radius: 1rem; }`, you write `className="rounded-2xl"` directly in JSX.

**Why used here.** Speed and consistency across ~40 components without inventing a class-naming system.

**Where used.** Configured in `tailwind.config.js` with a custom theme:
```js
colors: { ink: "#101114", gold: "#d6a84f", cream: "#f7f5ef", muted: "#73757b" },
boxShadow: { soft: "0 18px 50px rgba(16,17,20,.08)" }
```
Those four names appear throughout the JSX as `bg-ink`, `text-gold`, `bg-cream`, `text-muted`, `shadow-soft`.

Plain CSS is used for the small set of things Tailwind utilities do not cover, in `src/index.css`:
- `.container-x` — the page width container: `width: min(1180px, calc(100% - 32px)); margin: auto;`
- `.hero` — the layered radial + linear gradient behind the hero section
- base resets and `button:disabled` styling

Each component also has a matching `.css` file that is imported but in most cases is empty or minimal — the styling is almost entirely Tailwind.

**PostCSS + autoprefixer** (`postcss.config.js`) is the build pipeline that processes Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) into real CSS and adds vendor prefixes.

---

## 3.13 Vite

**What it is.** The frontend build tool and dev server. Scripts: `npm run dev`, `npm run build`, `npm run preview`.

**Why it matters for your viva.** The frontend does **not** use Create React App. Vite serves ES modules natively in development, which is why there is no `webpack.config.js` and why `index.html` sits at the project root rather than in `public/`.

---

## 3.14 lucide-react

An SVG icon library. Icons are imported as React components: `import { Gavel, Users } from "lucide-react"` and rendered as `<Gavel size={18} />`. Used in the navbar, sidebar (`navigation.js` stores the icon component itself as the third element of each menu tuple), stat cards and action buttons.

---

## 3.15 npm, dotenv, cors, nodemon

| Package | Role in Storage Wars |
|---|---|
| **npm** | Installs dependencies, runs `npm run dev` / `npm start` scripts |
| **dotenv** | `require("dotenv").config()` on line 3 of `server.js` loads `.env` into `process.env` so `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `EMAIL_USER`, `EMAIL_PASS` and `PORT` are available |
| **cors** | `app.use(cors())` — without it the browser blocks the Vite dev server (port 5173) from reading responses from the API (port 5000) because of the same-origin policy |
| **nodemon** | Dev-only. Watches backend files and restarts the server on save, so you do not stop and start Node manually |

**Interview question:** "Why is `cors` needed if both are on localhost?"
**Answer:** "The same-origin policy compares scheme, host **and port**. `localhost:5173` and `localhost:5000` are different origins, so the browser blocks the response unless the server sends `Access-Control-Allow-Origin`. `app.use(cors())` adds that header."

---

# PART 4 — PROJECT SETUP FROM SCRATCH

## 4.1 Backend setup

```bash
mkdir backend && cd backend
npm init -y

npm install express mongoose dotenv cors
npm install bcryptjs jsonwebtoken
npm install nodemailer
npm install @google/genai
npm install --save-dev nodemon
```

Then in `package.json`:
```json
"scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
}
```

The project also sets `"type": "commonjs"`, which is why the backend uses `require(...)` and `module.exports` rather than `import`/`export`.

### Why each dependency

| Package | Purpose in this project |
|---|---|
| `express` | HTTP server, routing, middleware chain |
| `mongoose` | Schemas, validation, `populate()`, `aggregate()` |
| `dotenv` | Reads `.env` into `process.env` so secrets never appear in code |
| `cors` | Lets the browser accept API responses from a different port |
| `bcryptjs` | One-way password hashing and comparison |
| `jsonwebtoken` | Signing and verifying the auth token |
| `nodemailer` | Sending the Contact Us email through Gmail SMTP |
| `@google/genai` | Calling the Gemini model for the chatbot |
| `nodemon` (dev) | Auto-restart during development only — not needed in production, which is why it is a devDependency |

### `.env`

```
PORT = 5000
MONGO_URI = mongodb://localhost:27017/Storagewars
JWT_SECRET = storage_wars_secret_key
GEMINI_API_KEY = <key>
EMAIL_USER = <gmail address>
EMAIL_PASS = <16-character Gmail App Password>
```

### `.gitignore` (backend)

```
node_modules/
.env
```

`node_modules/` is excluded because it can be regenerated from `package.json` with `npm install` and is very large. `.env` is excluded because it contains live credentials.

## 4.2 Frontend setup

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom axios lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

`tailwind.config.js` then gets the content paths and custom theme, and `src/index.css` gets the three Tailwind directives.

Run with `npm run dev` (Vite default port 5173).

## 4.3 Startup order

1. Ensure MongoDB is running locally (Windows service, or `mongod`).
2. `cd backend && npm run dev` → console prints `MongoDB connected successfully` and `Server running on port 5000`.
3. `cd frontend && npm run dev` → Vite prints the local URL.
4. Open the frontend URL in the browser.

If the backend is not running first, every dashboard page will show a "Failed to fetch..." alert, because each one calls the API inside `useEffect` on mount.

## 4.4 Database connection

`config/db.js`:
```js
const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed:", error.message);
    }
};
module.exports = connectDB;
```

Called from `server.js` as `connectDB();` after the middleware registration.

**Observation worth mentioning honestly:** the catch block logs the failure but does not call `process.exit(1)`. So if MongoDB is unreachable, the Express server still starts and accepts requests — those requests then fail at the database layer instead of the server refusing to start.
*Possible improvement — not part of the current implementation:* call `process.exit(1)` in the catch block so a misconfigured database fails loudly at startup.

**Frontend `.gitignore`** contains only `node_modules/`. There is no frontend `.env`; the API base URL is hardcoded in `src/api/axios.js` as `http://localhost:5000/api`.
*Possible improvement — not part of the current implementation:* move it to `import.meta.env.VITE_API_URL` for deployment.

---

# PART 5 — FRONTEND FOLDER STRUCTURE

## 5.1 Folder responsibilities

| Folder | Responsibility |
|---|---|
| `src/api/` | The single configured Axios instance with the auth interceptor |
| `src/component/` | Reusable UI pieces used across multiple pages |
| `src/component/dashboard/` | Shared dashboard chrome: layout, sidebar, stat grid, data table |
| `src/dashboards/` | Role-specific screens, one folder per role |
| `src/pages/` | Public pages, one folder per page |
| `src/utils/` | Small reusable helpers (currency formatting) |
| `src/data.js` | Static demo data left over from the UI-only phase |
| `src/navigation.js` | Sidebar menu definitions as data, not as JSX |

The separation between `navigation.js` and `DashboardLayout.jsx` is a good design point to raise in an interview: **`navigation.js` says what to show, `DashboardLayout.jsx` says how to show it.** Adding a new sidebar item requires editing one array, not the layout component.

## 5.2 Key file reference

### `src/api/axios.js`
- **Responsibility:** create one Axios instance and attach the JWT automatically.
- **Imported by:** every component that calls the API (~25 files).
- **Exports:** the configured instance as the default export, imported as `api`.
- **State:** none.

### `src/App.jsx`
- **Responsibility:** the complete route table, nothing else.
- **Imported by:** `main.jsx`.
- **Renders:** `<Routes>` with 8 public routes, 8 admin routes, 6 seller routes, 6 customer routes and one catch-all.
- **State:** none.

### `src/component/layout/Layout.jsx`
- **Responsibility:** the public page shell.
- **Renders:** `<Navbar />`, `{children}`, `<BackToTop />`, `<ChatBot />`, `<Footer />`.
- **Used by:** every public page and, indirectly, every dashboard page (because `DashboardLayout` itself wraps its content in `Layout`). This is why the chatbot and footer appear inside dashboards too.

### `src/component/dashboard/DashboardLayout.jsx`
- **Responsibility:** sidebar + page heading + logout, shared by all three roles.
- **Props:** `role` (`"admin"` | `"seller"` | `"buyer"`), `title`, `children`.
- **Reads:** `demoNav[role]` from `navigation.js`; `useLocation()` to highlight the active link.
- **Logout:** removes `token` and `user` from localStorage and navigates to `/login`. There is no logout API call — logout is purely client-side, which is normal for stateless JWT.

### `src/component/dashboard/SellerLayout.jsx` and `BuyerLayout.jsx`
Thin wrappers that call `DashboardLayout` with `role="seller"` and `role="buyer"` respectively, so seller and customer pages do not repeat the role string. Note that `BuyerLayout` passes `role="buyer"` — matching the `buyer` key in `demoNav` — even though the database role string is `"customer"`.

### `src/component/dashboard/StatGrid.jsx`
- **Props:** `items` — an array of `[label, value, IconComponent]` tuples.
- **Renders:** a four-column responsive grid of stat cards.
- **Used by:** `AdminDashboard`, `BidderDashboard`, `CustomerDashboard`, `Reports`.

### `src/component/dashboard/DataTable.jsx`
- **Props:** `headers` (array of strings), `rows` (array of arrays), `actions` (a render function `(row, index) => JSX`).
- The `actions` prop is a **render prop** — the table does not know what the buttons do, the page does. This is why the same table renders Block/Unblock on the Users page, Approve/Reject on Bid Approvals, and Edit/Delete on My Products.
- **Used by:** `Users`, `Products`, `AuctionListings`, `BidApprovals`, `Discounts`, `MyProducts`, `MyAuctions`, `BidsReceived`, `MyBids`, `Orders`.

### `src/component/timer/Timer.jsx`
- **Props:** `end` (a date or ISO string).
- **State:** `t` — the formatted countdown string.
- **Behaviour:** `setInterval` ticks every second inside `useEffect`; the cleanup function calls `clearInterval`. Displays `Auction ended` when the remaining seconds reach zero.
- **Note:** the component `return t` — it returns a plain string rather than JSX. This is valid in React 18.

### `src/component/auctioncard/AuctionCard.jsx`
- **Props:** `a` — one auction object from the API.
- **Reads:** `a.product?.name`, `a.product?.category?.name`, `a.product?.images?.[0]`, `a.status`, `a.currentBid`, `a._id`.
- **Renders:** a link to `/auction/<id>` with image, status badge, category, name and last bid.
- **Used by:** `Home` (with demo data), `Auctions` (with API data), `Watchlist` (with API data).

### `src/component/buyercard/BuyerCard.jsx`
- **Props:** `a` — one live auction.
- **State:** `cur` (locally tracked current bid), `v` (input value), `loading`.
- **Behaviour:** places a bid directly from the customer dashboard via `POST /bids`, then optimistically sets `cur` locally.
- **Used by:** `CustomerDashboard` only.

### `src/component/chatbox/ChatBot.jsx`
- **State:** `chat` (open/closed), `message`, `reply`, `loading`.
- **Behaviour:** `POST /ai` with `{ message }`, stores `response.data.reply` in state.
- **Note:** it holds only the **latest** reply in a single string. There is no conversation history array, so previous turns are replaced, not appended. This is a real characteristic of the implementation, and it means the AI has no memory of earlier messages.

### `src/pages/detail/AuctionDetail.jsx`
- **Reads route param:** `const { id } = useParams()`.
- **State:** `auction`, `winner`, `bidAmount`, `loading`, `placingBid`, `addingToWatchlist`.
- **Calls:** `GET /auctions/:id`, then conditionally `GET /auctions/:id/winner` when `status === "completed"`; `POST /bids`; `POST /watchlist`.
- **Minimum bid rule shown in the UI:** `Math.max(auction.startingPrice, auction.currentBid) + 1`.

---

# PART 6 — REACT FUNDAMENTALS USED IN THIS PROJECT

## 6.1 Components

**Meaning.** A function that returns JSX describing a piece of UI.

**In Storage Wars.** Every `.jsx` file exports exactly one component as its default export. All are function components; there is not a single class component in the project.

```jsx
function AuctionCard({ a }) {
  ...
  return ( ... );
}
export default AuctionCard;
```

**Why needed.** The auction card design appears in three places. Writing it once and importing it three times means one fix updates all three.

**Interview Q:** "Function components or class components?"
**Answer:** "Entirely function components with hooks. I never needed lifecycle methods because `useEffect` covers mounting and cleanup, which is all this project requires."

---

## 6.2 JSX

**Meaning.** Syntax that looks like HTML but compiles to `React.createElement` calls. Attributes use JavaScript names — `className` instead of `class`, `onChange` instead of `onchange`.

**In Storage Wars.** Every render block. A representative example from `AuctionCard.jsx` showing an expression, a conditional and template concatenation inside JSX:

```jsx
<span className={
  "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold " +
  (a.status === "live" ? "bg-red-500 text-white" : "bg-white")
}>
  {a.status === "live" ? "Live" : a.status}
</span>
```

**Interview Q:** "Why `className` and not `class`?"
**Answer:** "`class` is a reserved word in JavaScript, and JSX compiles to JavaScript, so React uses `className`."

---

## 6.3 Props

**Meaning.** Read-only data passed from a parent component to a child.

**In Storage Wars.**

| Component | Props received | Passed from |
|---|---|---|
| `AuctionCard` | `a` | `Auctions.jsx`, `Home.jsx`, `Watchlist.jsx` |
| `Timer` | `end` | `AuctionCard`, `AuctionDetail`, `BuyerCard` |
| `DashboardLayout` | `role`, `title`, `children` | all dashboard pages |
| `StatGrid` | `items` | four dashboard pages |
| `DataTable` | `headers`, `rows`, `actions` | ten pages |
| `ProtectedRoute` | `allowedRoles` | `App.jsx` |
| `CategoryCard` | `category` | `Home.jsx` |
| `BuyerCard` | `a` | `CustomerDashboard.jsx` |

`children` is a special prop — everything written between the opening and closing tags of a component. `SellerLayout` uses it to wrap arbitrary page content.

**Interview Q:** "Can a child modify a prop?"
**Answer:** "No. Props are read-only. If a child needs to change something, the parent owns that state and passes down a setter function."

---

## 6.4 State and `useState`

**Meaning.** Data owned by a component that, when changed through its setter, causes React to re-render.

**In Storage Wars — actual examples:**

```jsx
// Login.jsx — two separate primitive states
const [e, setE] = useState("");   // email
const [p, setP] = useState("");   // password

// Register.jsx — one object holding the whole form
const [form, setForm] = useState({
  name: "", email: "", password: "", mobile: "",
  address: "", city: "", gender: "", role: "customer",
});

// Auctions.jsx — API data plus two filter states
const [auctions, setAuctions] = useState([]);
const [q, setQ] = useState("");
const [st, setSt] = useState("ALL");

// AdminDashboard.jsx — an object of computed statistics
const [stats, setStats] = useState({
  users: 0, liveAuctions: 0, pendingBids: 0, revenue: null
});
```

**Two patterns worth naming in an interview.** `Login.jsx` uses one state variable per field; `Register.jsx` uses a single object with a generic handler:

```jsx
const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};
```

The object pattern scales better — `Register` has eight fields, and a single handler serves all of them because `[e.target.name]` is a computed property key matching the input's `name` attribute.

**Interview Q:** "Why not just use a normal variable?"
**Answer:** "A normal variable changes but React doesn't know about it, so nothing re-renders. `useState` gives React a setter it can hook into to schedule a re-render."

**Follow-up:** "Why the spread `...form`?"
**Answer:** "State must be replaced, not mutated. Spreading copies the existing fields, then the computed key overwrites just the one that changed."

---

## 6.5 `useEffect`

**Meaning.** Runs a side effect after render. The dependency array controls when it runs again.

**In Storage Wars — three distinct dependency patterns actually used:**

**a) Empty array `[]` — run once on mount.** Used in every dashboard page and in `Auctions.jsx`:
```jsx
useEffect(() => {
  const fetchAuctions = async () => { ... };
  fetchAuctions();
}, []);
```

**b) With a dependency — re-run when it changes.** `AuctionDetail.jsx`:
```jsx
useEffect(() => { ...fetch by id... }, [id]);
```
`id` comes from `useParams()`. If the user navigates from one auction to another, `id` changes and the effect re-runs, fetching the new auction.

**c) With a cleanup function.** `Timer.jsx` and `Hero.jsx`:
```jsx
useEffect(() => {
  const timer = setInterval(updateTimer, 1000);
  return () => clearInterval(timer);
}, [end]);
```

**Interview Q:** "What happens if you leave out the dependency array?"
**Answer:** "The effect runs after every render. In `Auctions.jsx` that would mean: fetch → setState → re-render → fetch → infinite loop. That's exactly why the array is `[]` there."

**Interview Q:** "Why is the cleanup function important in `Timer`?"
**Answer:** "When an auction card unmounts, the interval would keep running and keep calling `setT` on an unmounted component. Returning `clearInterval` stops the interval when the component unmounts or when `end` changes."

---

## 6.6 Events

**In Storage Wars.**

| Event | Where |
|---|---|
| `onSubmit` | `Login`, `Register`, `Contact`, `AddProduct`, `MyProducts` edit form, `AuctionListings` create/edit forms |
| `onChange` | every controlled input |
| `onClick` | logout, place bid, approve/reject, block/unblock, add/delete category, modal open/close, filter buttons |
| `onKeyDown` | `ChatBot.jsx` — `if (e.key === "Enter") sendMessage();` |

`e.preventDefault()` is called first in every form submit handler, otherwise the browser would reload the page and destroy all React state.

---

## 6.7 Forms and controlled inputs

**Meaning.** A controlled input's `value` comes from state and its `onChange` writes back to state. React is the single source of truth.

**In Storage Wars — `Register.jsx`:**
```jsx
<input
  required
  name="email"
  value={form.email}
  onChange={handleChange}
  type="email"
  className="w-full rounded-xl border p-3"
  placeholder="Email"
/>
```

Every text input, `select` and `textarea` in the project follows this pattern.

**`required` attribute.** Note that the project relies on HTML5 `required` for basic client-side validation rather than writing custom validation functions. The real validation happens on the backend through Mongoose schema rules.

**Interview Q:** "Controlled vs uncontrolled?"
**Answer:** "In a controlled input React holds the value in state; in an uncontrolled one the DOM holds it and you read it with a ref. Everything in this project is controlled, which is why I can clear a form after submit just by resetting state — `setFormData({ name: '', email: '', message: '' })` in `Contact.jsx`."

---

## 6.8 Conditional rendering

Three techniques are used in the project:

**Ternary — choose between two outputs.** `AdminDashboard.jsx`:
```jsx
stats.revenue === null ? "—" : money(stats.revenue)
```

**Logical AND — render or nothing.** `AuctionDetail.jsx`:
```jsx
{auction.status === "live" && (
    <div className="mt-4 flex gap-2"> ...bid form... </div>
)}
```
The bid form only exists in the DOM when the auction is live.

**Early return — a whole alternative screen.** `AuctionDetail.jsx`:
```jsx
if (loading) return <Layout><main><p>Loading auction...</p></main></Layout>;
if (!auction) return <Layout><main><p className="font-bold">Auction not found.</p></main></Layout>;
```

**Interview Q:** "How do you stop a customer from seeing the bid form on a completed auction?"
**Answer:** "The bid form is wrapped in `{auction.status === 'live' && ...}`, so it isn't rendered at all. And even if someone bypassed the UI, `placeBid` in the backend rejects any auction whose status isn't 'live'."

---

## 6.9 Lists, `map()` and keys

**In Storage Wars.** Every table, grid and card list.

```jsx
// Auctions.jsx
{list.map((auction) => (
  <AuctionCard a={auction} key={auction._id} />
))}

// AddProduct.jsx — category dropdown
{categories.map((category) => (
  <option key={category._id} value={category._id}>{category.name}</option>
))}

// DashboardLayout.jsx — sidebar from navigation.js
{links.map(([x, to, I]) => (
  <Link to={to} key={x}> <I size={17} /> {x} </Link>
))}
```

**Keys used in this project:** `auction._id`, `product._id`, `category._id`, `notification._id`, `order._id`, `item._id` — MongoDB ObjectIds, which are guaranteed unique. `DataTable` falls back to the array index (`key={i}`) because a generic row array has no id.

**Interview Q:** "Why does React need a key?"
**Answer:** "React uses keys to match elements between renders. Without a stable key it can't tell whether an item moved, was inserted or was removed, so it re-creates DOM nodes unnecessarily and can misplace component state. I use the MongoDB `_id` because it's stable and unique."

**Follow-up:** "Why is the array index a weaker key?"
**Answer:** "If an item is deleted from the middle, every following item's index shifts, so React thinks their content changed. It's acceptable in `DataTable` because the rows there are plain data with no internal state."

---

## 6.10 Reusable components and composition

**Composition in this project runs three layers deep:**

```
BuyerLayout(title, children)
   └── DashboardLayout(role="buyer", title, children)
          └── Layout(children)
                 ├── Navbar
                 ├── (sidebar + heading + page content)
                 ├── BackToTop
                 ├── ChatBot
                 └── Footer
```

So `MyBids.jsx` writes only:
```jsx
<BuyerLayout title="My Bids">
  <DataTable headers={...} rows={...} actions={...} />
</BuyerLayout>
```
and gets the navbar, sidebar, heading, logout button, chatbot and footer for free.

**Interview Q:** "Give an example of component reuse in your project."
**Answer:** "`DataTable` is used on ten different pages — admin Users, admin Products, admin Auction Listings, admin Bid Approvals, admin Discounts, seller My Products, seller My Auctions, seller Bids Received, customer My Bids and customer Orders. It takes `headers`, `rows` and an `actions` render function, so each page decides its own buttons while the table structure is written once."

---

# PART 7 — REACT INTERMEDIATE CONCEPTS

## 7.1 Why API calls live inside `useEffect`

A component function must be pure — it must not perform side effects during render. Calling the API directly in the component body would fire a request on every render and would cause an infinite loop as soon as the response set state. `useEffect` runs *after* the render is committed, and with `[]` it runs only once.

The pattern used consistently across the project:

```jsx
useEffect(() => {
  const fetchX = async () => {
    try {
      const response = await api.get("/x");
      setX(response.data.x || []);
    } catch (error) {
      console.error("X ERROR:", error);
      alert(error.response?.data?.message || "Failed to fetch X");
    }
  };
  fetchX();
}, []);
```

Note the async function is **defined inside** the effect and then called. `useEffect` cannot itself be `async`, because an async function returns a Promise and React expects the return value to be a cleanup function.

**Interview Q:** "Why can't you write `useEffect(async () => {...}, [])`?"
**Answer:** "Because an async function returns a Promise, and React treats the return value of an effect as its cleanup function. So React would try to call a Promise as a function. The standard fix is to declare an inner async function and invoke it immediately, which is what I do in every page."

## 7.2 Parallel API calls with `Promise.all`

Three dashboards fetch several endpoints at once instead of awaiting them one after another.

**`AdminDashboard.jsx`** — three calls:
```jsx
const [usersRes, auctionsRes, bidsRes] = await Promise.all([
    api.get("/users"),
    api.get("/auctions"),
    api.get("/bids")
]);
```

**`BidderDashboard.jsx`** — four calls: `/products`, `/auctions`, `/bids`, `/orders`.

**`CustomerDashboard.jsx`** — five calls: `/bids/my`, `/watchlist`, `/orders/won`, `/orders`, `/auctions`.

`Notifications.jsx` also uses `Promise.all` for writes — marking every unread notification as read concurrently:
```jsx
await Promise.all(
  unreadNotifications.map((notification) =>
    api.patch(`/notifications/${notification._id}/read`, {}, { headers: {...} })
  )
);
```

**Interview Q:** "Why `Promise.all` instead of three separate awaits?"
**Answer:** "Sequential awaits would take the sum of the three response times. `Promise.all` fires all three immediately and waits for the slowest one, so the dashboard loads in roughly the time of the longest single request."

**Follow-up:** "What if one fails?"
**Answer:** "`Promise.all` rejects as soon as any one rejects, so the whole `try` block jumps to `catch` and the dashboard shows nothing. `Promise.allSettled` would let the successful ones still render — *possible improvement, not part of the current implementation.*"

## 7.3 Loading states

Loading state is implemented on some pages, not all. Where it exists:

| File | State | UI |
|---|---|---|
| `AuctionDetail.jsx` | `loading` | `<p>Loading auction...</p>` before data arrives |
| `AuctionDetail.jsx` | `placingBid` | button text becomes `"Bidding..."` and is disabled |
| `AuctionDetail.jsx` | `addingToWatchlist` | button text becomes `"Adding..."` |
| `Reports.jsx` | `loading` | `<p>Loading reports...</p>` |
| `AuctionResults.jsx` | `loading` | `<p>Loading results...</p>` |
| `AddProduct.jsx` | `loading` | button becomes `"Creating Auction..."`, disabled |
| `MyProducts.jsx`, `AuctionListings.jsx` | `loading` | modal submit button becomes `"Saving..."` / `"Creating..."` |
| `ChatBot.jsx` | `loading` | send button disabled |
| `BuyerCard.jsx` | `loading` | button shows `"..."`, input disabled |

Pages **without** a loading state (they render an empty table and then fill it): `Users`, `Products`, `Categories`, `BidApprovals`, `MyBids`, `Orders`, `Watchlist`, `WonAuctions`, `Notifications`, `MyAuctions`, `BidsReceived`, `AdminDashboard`, `BidderDashboard`, `CustomerDashboard`.

Being able to state that distinction precisely is worth more in an interview than claiming loading states everywhere.

## 7.4 Error states

Error handling on the frontend is consistent and uses two mechanisms:

**1. `alert()` with a fallback message** — the dominant pattern:
```jsx
alert(error.response?.data?.message || "Failed to fetch users");
```
The optional chaining matters: if the server is completely down there is no `error.response` at all, so `error.response?.data?.message` is `undefined` and the fallback string is shown instead of the app crashing.

**2. Inline status text** — only in `Contact.jsx`:
```jsx
const [status, setStatus] = useState("");
...
setStatus("Message submitted successfully!");
...
{status && <p className="mt-4 font-bold">{status}</p>}
```

**3. `console.error` / `console.log`** — used everywhere alongside the alert, with a consistent uppercase label so the source is obvious in DevTools: `"PLACE BID ERROR:"`, `"WATCHLIST ERROR:"`, `"CONTACT ERROR:"`, `"UPDATE AUCTION ERROR:"`.

Some pages log extra diagnostic detail — `MyBids.jsx` and `BidApprovals.jsx` log `error.response?.status` and `error.response?.data` separately. That is debugging code left in place from working through 401/403 responses.

*Possible improvement — not part of the current implementation:* replace `alert()` with a toast component, and add an Axios **response** interceptor that redirects to `/login` on any 401.

## 7.5 localStorage

Two keys are stored, both written in `Login.jsx`:

```jsx
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user));
```

`user` is the object the login endpoint returns: `{ id, name, email, role }`. Note the key is **`id`**, not `_id`, because `authController` builds it explicitly.

| Read in | Used for |
|---|---|
| `api/axios.js` | attaching the Bearer token |
| `ProtectedRoute.jsx` | deciding whether to render or redirect |
| `MyProducts.jsx`, `MyAuctions.jsx`, `BidsReceived.jsx`, `BidderDashboard.jsx`, `AuctionResults.jsx` | filtering "my" records by comparing ids |
| `DashboardLayout.jsx` | removed on logout |

Several files defensively write `String(user?._id || user?.id)` — covering both possible shapes of the stored object. That fallback exists because the API returns `id` while MongoDB documents carry `_id`.

**Interview Q:** "Why localStorage and not a cookie?"
**Answer:** "localStorage is simple to read from JavaScript, which is what the Axios interceptor needs, and it survives a page refresh and browser restart. The trade-off is that it is readable by any JavaScript on the page, so it is vulnerable to XSS. An httpOnly cookie would be more secure — *that is future scope, not what I built.*"

## 7.6 Component communication

Three mechanisms are used:

1. **Parent → child via props.** `Auctions.jsx` passes each auction to `AuctionCard`.
2. **Child → parent via a callback prop.** `DataTable` receives `actions` as a function; the page defines what happens when a button is clicked, and the table just calls it.
3. **Shared external state via localStorage.** `Login.jsx` writes the token; `axios.js` and `ProtectedRoute.jsx` read it. They never talk to each other directly.

There is **no** Context API, Redux, Zustand or any global state library in this project. State is either local to a component or read from localStorage.

**Interview Q:** "How do distant components share the logged-in user?"
**Answer:** "Through localStorage. Login writes it, and any component that needs it reads it directly. I didn't add Context or Redux because the only globally-needed values are the token and the user object, and localStorage already persists them across refreshes. In a larger app I would move it to a Context so a change would trigger a re-render, which localStorage doesn't do."

## 7.7 API-driven UI

Three patterns appear:

**a) Fetch then filter locally.** `Auctions.jsx` fetches all auctions once, then derives the displayed list from two state values without another API call:
```jsx
const list = auctions.filter((auction) => {
  const productName = auction.product?.name || "Auction Item";
  const matchesSearch = productName.toLowerCase().includes(q.toLowerCase());
  const matchesStatus = st === "ALL" || auction.status?.toUpperCase() === st;
  return matchesSearch && matchesStatus;
});
```
Search and status filtering are instant because no network round-trip is involved.

**b) Fetch then re-fetch after a write.** `AuctionListings.jsx` and `BidApprovals.jsx` call `fetchAuctions()` / `fetchBids()` again after a successful create or update, so the table always reflects the server.

**c) Optimistic local update.** `BidsReceived.jsx` updates the row in state immediately after a successful PATCH instead of re-fetching:
```jsx
setBids((prevBids) => prevBids.map((bid) =>
    bid._id === bidId ? { ...bid, status: newStatus } : bid
));
```
`Users.jsx` and `Products.jsx` do the same but substitute the **server's returned object** (`response.data.user`), which is the safer version of the two.

**Interview Q:** "After approving a bid, how does the table update?"
**Answer:** "Two different approaches in two places. On the admin Bid Approvals page I re-fetch the whole list, which guarantees the table matches the database. On the seller Bids Received page I update just that row in state, which is faster but relies on my local update matching what the server did. Both are deliberate; the re-fetch is the safer of the two."

## 7.8 Dynamic UI driven by data

`navigation.js` is the clearest example. The sidebar is generated by mapping over an array of tuples:

```js
export const demoNav = {
    admin:  [["Dashboard", "/admin", LayoutDashboard], ...8 items],
    seller: [["Dashboard", "/seller", LayoutDashboard], ...6 items],
    buyer:  [["Dashboard", "/buyer", LayoutDashboard], ...6 items],
};
```

`DashboardLayout` then does `const links = demoNav[role];` and maps over it. Adding a menu item means adding one line to this file; the layout component never changes.

---

# PART 8 — REACT ROUTER

## 8.1 The actual route table (`App.jsx`)

```jsx
<Routes>
  {/* Public */}
  <Route path="/"           element={<Home />} />
  <Route path="/auctions"   element={<Auctions />} />
  <Route path="/auction/:id" element={<AuctionDetail />} />
  <Route path="/categories" element={<Categories />} />
  <Route path="/about"      element={<About />} />
  <Route path="/contact"    element={<Contact />} />
  <Route path="/login"      element={<Login />} />
  <Route path="/register"   element={<Register />} />

  {/* Admin */}
  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
    <Route path="/admin"            element={<AdminDashboard />} />
    <Route path="/admin/auctions"   element={<AuctionListings />} />
    <Route path="/admin/bids"       element={<BidApprovals />} />
    <Route path="/admin/users"      element={<Users />} />
    <Route path="/admin/products"   element={<Products />} />
    <Route path="/admin/categories" element={<AdminCategories />} />
    <Route path="/admin/discounts"  element={<Discounts />} />
    <Route path="/admin/reports"    element={<Reports />} />
  </Route>

  {/* Seller */}
  <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
    <Route path="/seller"             element={<BidderDashboard />} />
    <Route path="/seller/add-product" element={<AddProduct />} />
    <Route path="/seller/products"    element={<MyProducts />} />
    <Route path="/seller/auctions"    element={<MyAuctions />} />
    <Route path="/seller/bids"        element={<BidsReceived />} />
    <Route path="/seller/results"     element={<AuctionResults />} />
  </Route>

  {/* Customer */}
  <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
    <Route path="/buyer"               element={<CustomerDashboard />} />
    <Route path="/buyer/bids"          element={<MyBids />} />
    <Route path="/buyer/watchlist"     element={<Watchlist />} />
    <Route path="/buyer/won"           element={<WonAuctions />} />
    <Route path="/buyer/orders"        element={<Orders />} />
    <Route path="/buyer/notifications" element={<Notifications />} />
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>
```

## 8.2 Each Router API used

| API | Where used | What it does here |
|---|---|---|
| `BrowserRouter` | `main.jsx` | Enables history-based routing for the whole app |
| `Routes` / `Route` | `App.jsx` | Declares the URL → component mapping |
| `Link` | Navbar, Footer, AuctionCard, CategoryCard, NotFound, DashboardLayout, dashboards | Client-side navigation without a page reload |
| `Navigate` | `ProtectedRoute.jsx` | Declarative redirect during render |
| `Outlet` | `ProtectedRoute.jsx` | Renders whichever child route matched |
| `useNavigate` | Login, Register, DashboardLayout | Programmatic redirect after an event |
| `useParams` | `AuctionDetail.jsx` | Reads `:id` from the URL |
| `useLocation` | `DashboardLayout.jsx` | Highlights the active sidebar link |

## 8.3 The layout-route pattern

This is the most important routing concept in the project:

```jsx
<Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
  <Route path="/admin" element={<AdminDashboard />} />
  ...
</Route>
```

The outer `<Route>` has **no `path`** — only an `element`. It is a *layout route*. React Router renders `ProtectedRoute` first; if `ProtectedRoute` returns `<Outlet />`, the matched child route renders inside it. If it returns `<Navigate />`, the child never renders at all.

This means the guard is written **once per role**, not once per page. Eight admin pages are protected by a single wrapper.

**Interview Q:** "How are all eight admin pages protected without repeating code?"
**Answer:** "I use a layout route. One parent `<Route>` with no path wraps all eight admin routes and renders `ProtectedRoute`. `ProtectedRoute` either returns `<Outlet />`, which renders the matched child, or `<Navigate />`, which redirects. So the check happens once."

## 8.4 `ProtectedRoute` in full

```jsx
function ProtectedRoute({ allowedRoles }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === "admin")  return <Navigate to="/admin"  replace />;
        if (user.role === "seller") return <Navigate to="/seller" replace />;
        return <Navigate to="/buyer" replace />;
    }

    return <Outlet />;
}
```

Two distinct checks:

1. **Authentication check** — is there a token and a user? If not → `/login`.
2. **Authorization check** — is this user's role in `allowedRoles`? If not, they are *not* sent to login (they are logged in, after all); they are sent to **their own** dashboard.

That second behaviour is a deliberate UX decision worth stating: a customer typing `/admin` in the address bar lands on `/buyer`, not on a login screen, because sending an already-authenticated user to a login page would be confusing.

`replace` prevents the blocked URL from entering the browser history, so the back button does not bounce the user into a redirect loop.

## 8.5 Authentication vs Authorization

| | Authentication | Authorization |
|---|---|---|
| Question | "Who are you?" | "What are you allowed to do?" |
| Frontend | `if (!token \|\| !user)` in ProtectedRoute | `allowedRoles.includes(user.role)` |
| Backend | `protect` in `authMiddleware.js` | `authorizeRoles(...)` in `roleMiddleware.js` |
| Failure code | **401 Unauthorized** | **403 Forbidden** |
| Meaning of failure | You have not proved your identity | You proved your identity, but you still can't do this |

## 8.6 Why `/random` does not go through ProtectedRoute

React Router matches routes by path. `/random` matches none of the declared paths, so it falls to the catch-all:

```jsx
<Route path="*" element={<NotFound />} />
```

`ProtectedRoute` only wraps the specific `/admin/*`, `/seller/*` and `/buyer/*` paths listed above. An unknown URL never enters those branches, so the guard is never invoked.

**Why 404 rather than a redirect to login?** Because "this page does not exist" and "you are not allowed here" are different facts. Redirecting an unknown URL to `/login` would tell a visitor that a protected page exists at that address, and it would confuse an already-logged-in admin who simply mistyped a URL. Showing a 404 is both more honest and more useful.

**Interview Q:** "What happens if I manually type `/admin` in the address bar as a customer?"
**Answer:** "React Router matches `/admin`, which sits inside the admin layout route, so `ProtectedRoute` runs. It finds a token and a user, so authentication passes, but `allowedRoles` is `['admin']` and my role is `'customer'`, so it returns `<Navigate to='/buyer' replace />`. And even if I disabled that check in DevTools, every admin API call would still be rejected by `authorizeRoles('admin')` on the backend with a 403."

**Interview Q:** "Is the frontend guard security?"
**Answer:** "No. It is user experience. Anyone can edit localStorage in DevTools and set `role` to `admin`, and the React UI would render the admin dashboard. But every request that dashboard makes carries the original JWT, whose signed payload still says `customer`, so the backend rejects each one with 403. The security is entirely on the backend."

---

# PART 9 — AUTHENTICATION

## 9.1 Registration — complete flow

```
Register.jsx  (8 controlled inputs + role dropdown)
      ↓  handleSubmit → e.preventDefault()
api.post("/auth/register", form)
      ↓  interceptor runs, finds no token (user not logged in), sends without header
POST http://localhost:5000/api/auth/register
      ↓
server.js → app.use("/api/auth", authRoutes)
      ↓
routes/authRoutes.js → router.post("/register", registerUser)     ← NO middleware
      ↓
controllers/authController.js → registerUser
      ↓  User.findOne({ email })   → duplicate check
      ↓  bcrypt.hash(password, 10) → hashed password
      ↓  User.create({...})        → Mongoose validates against schema
MongoDB "users" collection
      ↓
res.status(201).json({ success, message, user: { id, name, email, role } })
      ↓
alert("Account created successfully!")  →  nav("/login")
```

### The controller, line by line

```js
const { name, email, password, mobile, address, city, gender, role } = req.body;

const existingUser = await User.findOne({ email });
if (existingUser) {
    return res.status(400).json({ success: false, message: "Email already registered" });
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
    name, email, password: hashedPassword, mobile, address, city, gender,
    role: role === "seller" ? "seller" : "customer"
});

res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
});
```

### Validation — where it actually happens

| Level | What it checks | Where |
|---|---|---|
| Browser | `required` on every input; `type="email"` format | `Register.jsx` |
| Controller | Email not already registered → 400 | `authController.registerUser` |
| Controller | Role sanitisation (see below) | `authController.registerUser` |
| Mongoose | All eight fields `required` with custom messages | `User.model.js` |
| Mongoose | `unique: true` on email — a duplicate that slips past the explicit check still fails at the index |
| Mongoose | `enum` on `role` and `status` |

There is **no** custom password-strength validation, no minimum length and no confirm-password field. That is not implemented in the current project.

### Why admin registration is restricted

This is one of the strongest security details in your project, and the mechanism is a single ternary:

```js
role: role === "seller" ? "seller" : "customer"
```

Whatever the client sends, only two outcomes are possible. Send `role: "admin"` in Postman and you still get `"customer"`. The `enum` in the schema allows `"admin"` as a valid value, but **no route in the application can create one**. The admin account has to be created directly in MongoDB Compass, or by inserting the document and setting `role: "admin"` manually.

**Interview Q:** "Can someone register themselves as an admin?"
**Answer:** "No. The register controller doesn't trust the role from the request body. It runs `role === 'seller' ? 'seller' : 'customer'`, so any other value — including 'admin' — collapses to 'customer'. I created the admin account manually in MongoDB Compass. It's a deliberate choice: an admin should be provisioned, not self-registered."

### The stored document

```json
{
  "_id": ObjectId("68b1..."),
  "name": "Rohan Mehta",
  "email": "rohan@example.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMy...",
  "mobile": "9876543210",
  "address": "12 MG Road",
  "city": "Indore",
  "gender": "male",
  "role": "seller",
  "status": "active",
  "createdAt": ISODate("2026-09-02T06:20:11.412Z"),
  "updatedAt": ISODate("2026-09-02T06:20:11.412Z"),
  "__v": 0
}
```

The `$2a$10$` prefix is the bcrypt format: algorithm version `2a`, cost factor `10`, then the 22-character salt followed by the hash.

## 9.2 Login — complete flow

```
Login.jsx  (email + password)
      ↓  onSubmit → e.preventDefault()
api.post("/auth/login", { email: e, password: p })
      ↓
POST /api/auth/login                     ← public route, no middleware
      ↓
authController.loginUser
      ↓  User.findOne({ email })
      │     ↳ not found → 404 "User not found"
      ↓  bcrypt.compare(password, user.password)
      │     ↳ false → 401 "Invalid email or password"
      ↓  jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1d" })
      ↓
res.status(200).json({ success, message, token, user: { id, name, email, role } })
      ↓
localStorage.setItem("token", token)
localStorage.setItem("user", JSON.stringify(user))
      ↓
role === "admin"  → nav("/admin")
role === "seller" → nav("/seller")
else              → nav("/buyer")
```

### An honest observation about the status codes

`loginUser` returns **404 "User not found"** when the email doesn't exist and **401 "Invalid email or password"** when the password is wrong. That means the two cases are distinguishable, which lets an attacker enumerate which email addresses are registered.

*Possible improvement — not part of the current implementation:* return the same 401 "Invalid email or password" for both cases.

Mentioning this yourself in an interview is a strong move. It shows you understand the difference between code that works and code that is secure.

### A second honest observation — `status` is not checked at login

`User.model.js` has `status: { enum: ["active", "blocked"] }`, and the admin Users page can flip it. But `loginUser` never reads `user.status`. A blocked user can still log in and receive a valid token.

Blocking currently only changes a database field; it does not prevent access.

*Possible improvement — not part of the current implementation:*
```js
if (user.status === "blocked") {
    return res.status(403).json({ success: false, message: "Account is blocked" });
}
```

**Interview Q:** "What does the Block button on the admin Users page actually do?"
**Answer:** "It sends `PATCH /api/users/:id` with `status: 'blocked'`, and the user document is updated. Being fully honest — the login controller doesn't currently check that field, so a blocked user can still log in. Adding a status check in `loginUser`, and ideally in the `protect` middleware as well, is the first thing I'd fix."

## 9.3 JWT explained through this project

**What it is.** Three Base64URL-encoded parts joined by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   . eyJpZCI6IjY4YjEuLi4iLCJyb2xlIjoic2VsbGVyIiwiaWF0IjoxNzU2ODAwMDAwLCJleHAiOjE3NTY4ODY0MDB9 . 4f3c2a...
        HEADER (alg, typ)                                      PAYLOAD (id, role, iat, exp)                                    SIGNATURE
```

**What is inside it in this project.** Exactly:
```json
{ "id": "<user._id>", "role": "admin | seller | customer", "iat": ..., "exp": ... }
```

Nothing else. No name, no email, and definitely no password.

**Why so little?** The payload is only Base64-encoded, not encrypted — anyone can decode it on jwt.io. So it carries only what the server needs to authorise a request, and nothing sensitive. Anything else the server needs, it fetches from the database using the id.

**Why it is used.** The API is stateless. There is no session store, no session id, and no server memory of who is logged in. The signature is what makes the token trustworthy: if a single character of the payload is changed, the signature no longer matches when `jwt.verify` recomputes it with `JWT_SECRET`, and verification throws.

**Expiration.** `expiresIn: "1d"`. After 24 hours `jwt.verify` throws `TokenExpiredError`, the catch block in `protect` returns 401 "Invalid or expired token", and the user must log in again.

There is **no refresh token** in this project, and no automatic redirect to login when a token expires — the user sees a failed request and has to log in again manually.

**Why the frontend stores it.** HTTP is stateless; each request is independent. Without storing the token, the user would have to log in again for every single request. localStorage persists it across page refreshes and browser restarts, and the Axios interceptor reads it from there.

**Why it must be sent on protected requests.** The token *is* the proof of identity. `protect` reads it from the `Authorization` header; without it, `req.user` would never be set and the server would have no idea whose products or bids to return.

**Interview Q:** "What if I edit the payload of my token to say `role: admin`?"
**Answer:** "The token would be rejected. The signature is an HMAC over the header and payload using `JWT_SECRET`. If I change the payload, `jwt.verify` recomputes the signature and it no longer matches, so it throws and `protect` returns 401. You cannot forge a valid signature without knowing the secret, which is stored in the server's `.env` and never sent to the browser."

**Interview Q:** "Why JWT instead of sessions?"
**Answer:** "With sessions, the server stores session state in memory or a store and the client only holds a session id — so the server has to look it up on every request, and it doesn't scale horizontally without a shared store. A JWT is self-contained: verification is a signature check with no database or store lookup. The trade-off is that you cannot revoke a JWT before it expires. For this project, with a one-day expiry, that trade-off was acceptable."

---

# PART 10 — AXIOS INTERCEPTOR

## 10.1 The complete file (`src/api/axios.js`)

```js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api"
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
```

Fifteen lines that remove roughly a hundred lines of repetition across the project.

## 10.2 Line by line

**`axios.create({ baseURL })`** creates a configured instance rather than using the global `axios`. Every call written as `api.get("/auctions")` becomes `http://localhost:5000/api/auctions`. If the backend moves to a deployed URL, exactly one line changes.

**`api.interceptors.request.use(onFulfilled, onRejected)`** registers a function that runs on **every** request made through this instance, after your code calls `api.get(...)` but before the request goes out.

**`localStorage.getItem("token")`** reads the token that `Login.jsx` stored.

**`if (token)`** — the guard matters. Register, login, contact and the AI endpoint are public. Without this check, a logged-out visitor would send `Authorization: Bearer null`, and `authMiddleware` would try `jwt.verify("null")`, which throws.

**`config.headers.Authorization = \`Bearer ${token}\``** — `Bearer` is the HTTP authentication scheme name defined in RFC 6750. It tells the server the credential that follows is a bearer token: whoever holds it is treated as the owner. The space after `Bearer` is required — `authMiddleware` splits on it with `authHeader.split(" ")[1]`.

**`return config`** — mandatory. The interceptor must return the config object, otherwise Axios has nothing to send.

**The second argument** handles errors that occur while building the request (before it is sent) and re-rejects them so the caller's `catch` still fires.

## 10.3 The flow

```
Component:  await api.get("/bids/my")
      ↓
Axios instance merges baseURL + path  →  http://localhost:5000/api/bids/my
      ↓
REQUEST INTERCEPTOR runs
      ↓  const token = localStorage.getItem("token")
      ↓  token exists?
      ↓  config.headers.Authorization = "Bearer eyJhbGciOi..."
      ↓  return config
      ↓
HTTP request leaves the browser
      ↓
Express → protect → authHeader.startsWith("Bearer ")  ✓
      ↓            → authHeader.split(" ")[1]         → the raw token
      ↓            → jwt.verify(token, JWT_SECRET)    → { id, role, iat, exp }
      ↓            → req.user = decoded
      ↓            → next()
authorizeRoles("customer") → req.user.role === "customer" ✓ → next()
      ↓
bidController.getMyBids → Bid.find({ bidder: req.user.id })
```

## 10.4 Why this beats repeating the token everywhere

Without the interceptor, every one of roughly 40 API calls would need:
```js
const token = localStorage.getItem("token");
await axios.get("http://localhost:5000/api/bids/my", {
  headers: { Authorization: `Bearer ${token}` }
});
```

That is three problems: the URL is duplicated 40 times, the token-reading logic is duplicated 40 times, and if you forget it once you get a silent 401 that is hard to trace.

## 10.5 The redundant headers in this project — worth explaining honestly

Several files still pass the header manually **in addition** to the interceptor:

```jsx
// MyBids.jsx
const token = localStorage.getItem("token");
const response = await api.get("/bids/my", {
  headers: { Authorization: `Bearer ${token}` },
});
```

Files that do this: `MyBids.jsx`, `Watchlist.jsx`, `WonAuctions.jsx`, `Orders.jsx`, `Notifications.jsx`, `CustomerDashboard.jsx`, `MyAuctions.jsx`, `BidsReceived.jsx`, `Users.jsx`, `Categories.jsx` (admin), `BuyerCard.jsx`.

Files that correctly rely on the interceptor alone: `Login.jsx`, `Register.jsx`, `Contact.jsx`, `ChatBot.jsx`, `Auctions.jsx`, `AuctionDetail.jsx`, `AddProduct.jsx`, `MyProducts.jsx`, `AuctionListings.jsx`, `BidApprovals.jsx`, `Products.jsx`, `Reports.jsx`, `AdminDashboard.jsx`, `BidderDashboard.jsx`, `AuctionResults.jsx`.

It is harmless — the per-request config sets the same header the interceptor would set. But it is redundant, and knowing precisely why it is redundant is a good answer:

**Interview Q:** "I see you pass the Authorization header manually in some files even though you have an interceptor. Why?"
**Answer:** "Those are left over from before I added the interceptor — I wrote several pages first with the header inline, then centralised it in `axios.js` and didn't go back to clean up all of them. Functionally it's harmless because the manual config sets the same header, but it's duplicated code and the correct version is the pages that just call `api.get('/bids/my')` with no options object."

That answer is far better than pretending it was intentional.

---

# PART 11 — AUTHORIZATION

## 11.1 `middlewares/authMiddleware.js` — the `protect` middleware

```js
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports = protect;
```

**Three failure paths, all returning 401:**
1. No `Authorization` header at all → "Authentication required"
2. Header present but not starting with `Bearer ` → "Authentication required"
3. `jwt.verify` throws — bad signature, malformed token, or expired → "Invalid or expired token"

**The success path:** `req.user = decoded` — this single line is the foundation of the entire authorization system. After it runs, `req.user.id` and `req.user.role` are available to every downstream middleware and controller.

**Note:** `req.headers.authorization` is lowercase because Node normalises all incoming header names to lowercase.

## 11.2 `middlewares/roleMiddleware.js` — `authorizeRoles`

```js
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        next();
    };
};

module.exports = authorizeRoles;
```

This is a **higher-order function** — a function that returns a function. That is why routes call it with parentheses:

```js
router.post("/", protect, authorizeRoles("seller"), createProduct);
//                        ^^^^^^^^^^^^^^^^^^^^^^^
//                        called immediately → returns the actual middleware
```

`protect` is passed as a reference (no parentheses) because Express calls it. `authorizeRoles("seller")` is invoked immediately, and *its return value* — a middleware function that has captured `allowedRoles` in a closure — is what Express calls.

`...allowedRoles` is a **rest parameter**, which is why one middleware handles every combination in the project: `authorizeRoles("admin")`, `authorizeRoles("seller", "admin")`, `authorizeRoles("admin", "seller", "customer")`.

**Dependency note:** `authorizeRoles` reads `req.user.role`, which only exists because `protect` ran first. Order in the route definition is not cosmetic — reversing it would crash with "Cannot read properties of undefined".

## 11.3 The two examples side by side

### Seller: `POST /api/products` → **201 Created**

```
Authorization: Bearer <seller token>
      ↓
protect                     → jwt.verify ✓ → req.user = { id: "68b1...", role: "seller" }
      ↓ next()
authorizeRoles("seller")    → ["seller"].includes("seller") → true
      ↓ next()
createProduct               → Product.create({ ..., seller: req.user.id })
      ↓
201 { success: true, message: "Product created successfully", product: {...} }
```

### Customer: `POST /api/products` → **403 Forbidden**

```
Authorization: Bearer <customer token>
      ↓
protect                     → jwt.verify ✓ → req.user = { id: "68c4...", role: "customer" }
      ↓ next()
authorizeRoles("seller")    → ["seller"].includes("customer") → false
      ↓  STOPS HERE
403 { success: false, message: "Access denied" }
```

The controller never runs. `createProduct` is never called, `Product.create` is never reached, and nothing touches the database.

Notice what is identical in both cases: the token was valid, `jwt.verify` succeeded, and `protect` called `next()`. **Authentication passed in both.** Only authorization differed.

## 11.4 401 vs 403 — the distinction, with project examples

| | 401 Unauthorized | 403 Forbidden |
|---|---|---|
| Plain meaning | "I don't know who you are" | "I know who you are, and no" |
| Cause in this project | Missing header, malformed header, invalid signature, expired token | Wrong role, or right role but not the owner of the resource |
| Returned by | `authMiddleware.protect`, and `loginUser` on a wrong password | `roleMiddleware.authorizeRoles`, and ownership checks in controllers |
| Can the user fix it? | Yes — log in again | No — they need a different account |

**Every 403 in the codebase:**

| Location | Condition |
|---|---|
| `roleMiddleware.js` | role not in the allowed list → "Access denied" |
| `productController.updateProduct` | seller editing another seller's product |
| `productController.deleteProduct` | seller deleting another seller's product |
| `auctionController.updateAuction` | seller editing another seller's auction |
| `auctionController.deleteAuction` | seller deleting another seller's auction |
| `bidController.placeBid` | seller bidding on their own auction |
| `bidController.updateBidStatus` | seller acting on a bid for someone else's auction |
| `orderController.getOrderById` | seller or customer viewing an order that isn't theirs |
| `orderController.updateOrder` | seller or customer updating an order that isn't theirs |

## 11.5 The third layer — ownership checks

Role checks are not enough. `authorizeRoles("seller", "admin")` lets **any** seller through to `PATCH /api/products/:id`. Without a further check, Seller A could edit Seller B's product.

That is why the controller does this:

```js
if (req.user.role === "seller" &&
    String(product.seller) !== String(req.user.id)) {
    return res.status(403).json({
        success: false,
        message: "You can only update your own products"
    });
}
```

**Why `String()` on both sides?** `product.seller` is a Mongoose `ObjectId` object; `req.user.id` is a plain string from the JWT payload. Comparing them with `!==` would always be true because they are different types and different object references. `String(...)` converts both to their 24-character hex representation so the comparison is meaningful.

**Why `req.user.role === "seller" &&`?** So the ownership rule applies only to sellers. An admin passes the condition (it short-circuits to false) and can therefore edit any product — which is the intended admin capability.

**Interview Q:** "Isn't the role check enough?"
**Answer:** "No, and this is the difference between role-based and resource-based authorization. `authorizeRoles('seller')` only proves the caller is *a* seller. It doesn't prove they're *the* seller who owns this specific product. So after the role check, the controller loads the document and compares `product.seller` with `req.user.id`. Both are converted with `String()` first, because one is an ObjectId and one is a string."

## 11.6 Frontend authorization vs backend authorization

| | Frontend (`ProtectedRoute`) | Backend (`protect` + `authorizeRoles` + ownership) |
|---|---|---|
| Reads from | `localStorage` | The signed JWT in the Authorization header |
| Can the user tamper with the source? | **Yes** — DevTools → Application → Local Storage → edit | **No** — requires `JWT_SECRET` to forge a valid signature |
| Purpose | Don't show a customer an admin sidebar | Don't let a customer read or change admin data |
| If bypassed | The UI renders, but every API call fails | Data would actually be exposed |
| Category | User experience | Security |

## 11.7 Why frontend protection alone is not enough — demonstrate it

This is one of the highest-value things you can say in an interview, because you can demonstrate it live:

1. Log in as a customer. You land on `/buyer`.
2. Open DevTools → Application → Local Storage → edit the `user` value, changing `"role":"customer"` to `"role":"admin"`.
3. Navigate to `/admin`. **The admin dashboard renders.** `ProtectedRoute` read the tampered localStorage and allowed it.
4. But the page is empty and shows "Access denied" alerts. `AdminDashboard` fires `GET /users`, `GET /auctions` and `GET /bids`, and each request carries the **original, untampered token** — whose signed payload still says `customer`. `authorizeRoles("admin")` returns 403 on `/users`.

Bear in mind the React app is JavaScript running on the user's machine. The user controls it entirely. They can edit its memory, its storage and its code. The only thing they cannot control is the server.

**The rule to state:** *never trust the client.* Every security decision must be re-made on the server, using data the server derives itself (`req.user` from a verified token) rather than data the client sent (`req.body.seller`, `req.body.role`).

**Interview Q:** "You already check the role in `ProtectedRoute`. Why check it again on the server?"
**Answer:** "Because the frontend check protects the interface, not the data. A user can change localStorage in DevTools and force the admin UI to render, and they can also call my API directly from Postman or curl, skipping React entirely. Neither of those touches the server-side check, which reads the role from a cryptographically signed token. The frontend check exists so users don't see options they can't use; the backend check is what actually enforces the rule."

---

# PART 12 — BACKEND ARCHITECTURE

## 12.1 `server.js` — walked through in order

```js
const express = require("express");
const cors = require("cors");
require("dotenv").config();          // ← must run before anything reads process.env
```

`dotenv.config()` is called at line 3 so that `process.env.MONGO_URI` is populated before `connectDB()` uses it.

```js
const connectDB = require("./config/db");
const Auction = require("./models/Auction.model");   // needed for updateAuctionStatuses
```

Twelve route imports, then:

```js
const protect = require("./middlewares/authMiddleware");
const authorizeRoles = require("./middlewares/roleMiddleware");
```

These two are imported into `server.js` only for the two test routes below.

```js
const app = express();

app.use(cors());            // 1. allow cross-origin requests
app.use(express.json());    // 2. parse JSON bodies into req.body

connectDB();                // 3. connect to MongoDB
```

**Order matters.** `express.json()` must be registered before the routes, otherwise `req.body` would be `undefined` inside every controller.

```js
app.get("/", (req, res) => {
    res.send("Storage Wars Backend is running...");
});
```
A health-check route. Opening `http://localhost:5000` in a browser confirms the server is alive.

```js
app.use("/api/auth", authRoutes);

app.get("/api/test-protected", protect, (req, res) => {
    res.json({ success: true, message: "Protected route accessed successfully", user: req.user });
});

app.get("/api/admin-test", protect, authorizeRoles("admin"), (req, res) => {
    res.json({ success: true, message: "Admin route accessed successfully" });
});
```

These two test routes are development artefacts, and they are genuinely useful to demo. `/api/test-protected` echoes back `req.user`, which proves the JWT decoded correctly. `/api/admin-test` proves the role middleware works. You can open both in Postman during your viva as a two-second demonstration of authentication and authorization.

### Route mounting — the actual API prefixes

```js
app.use("/api/categories",    categoryRoutes);
app.use("/api/products",      productRoutes);
app.use("/api/auctions",      auctionRoutes);
app.use("/api/bids",          bidRoutes);
app.use("/api/orders",        orderRoutes);
app.use("/api/watchlist",     watchlistRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/reports",       reportRoutes);
app.use("/api/ai",            aiRoutes);
app.use("/api/contact",       contactRoutes);
```

`app.use(prefix, router)` means the router's internal paths are **relative** to the prefix. Inside `productRoutes.js`, `router.post("/")` becomes `POST /api/products`, and `router.patch("/:id")` becomes `PATCH /api/products/:id`.

Note `/api/watchlist` is singular while the others are plural. That is the actual prefix — do not say `/api/watchlists` in your viva.

### The automatic auction status updater

```js
const updateAuctionStatuses = async () => {
    const now = new Date();

    // Upcoming → Live
    await Auction.updateMany(
        { status: "upcoming", startTime: { $lte: now }, endTime: { $gt: now } },
        { $set: { status: "live" } }
    );

    // Live → Completed
    await Auction.updateMany(
        { status: "live", endTime: { $lte: now } },
        { $set: { status: "completed" } }
    );

    console.log("Auction statuses updated:", now.toLocaleString());
};

updateAuctionStatuses();                    // run once at startup
setInterval(updateAuctionStatuses, 60 * 1000);   // then every 60 seconds
```

`updateMany` is a bulk operation — one database round trip updates every qualifying auction, rather than fetching them all and saving each one.

`$lte` ("less than or equal") and `$gt` ("greater than") are MongoDB query operators. `$set` is an update operator that changes only the named field and leaves the rest of the document untouched.

```js
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

`|| 5000` is a fallback for when `PORT` is missing from `.env`.

**Important detail to be honest about:** there are **two** copies of this status-update logic — one in `server.js` (on a timer) and one in `auctionController.js` (called at the start of `getAuctions`). They are not identical:

| | `server.js` version | `auctionController.js` version |
|---|---|---|
| Upcoming → Live | `status: "upcoming"` and within window | same |
| → Completed | only `status: "live"` past endTime | **any** status except `"completed"` past endTime |

So the controller version is broader — it will also mark an expired `"upcoming"` or `"cancelled"` auction as `"completed"`. Duplicated logic that has drifted apart is a genuine code-quality issue.
*Possible improvement — not part of the current implementation:* export one function from `auctionController.js` and have `server.js` import that same function for its timer.

## 12.2 Separation of concerns

```
routes/       →  "which URL and method, and which guards"
controllers/  →  "what should happen"
models/       →  "what the data looks like and what rules it must obey"
middlewares/  →  "what must be true before the controller runs"
config/       →  "how to connect to infrastructure"
```

**Why routes do not contain business logic.** A route file should be readable as a table of contents for the API. Opening `productRoutes.js` should tell you, in ten seconds, which endpoints exist and who can call them. If the logic lived there, the file would be 300 lines and you would have to read all of it to answer that question.

Concretely, the benefits in this project:
- `createProduct` is called from one route today, but could be reused elsewhere without duplication.
- Logic can be unit-tested independently of Express.
- Changing a URL never touches the logic; changing the logic never touches the URL.

**The one exception:** `aiRoutes.js` puts the Gemini logic directly in the route. It works, but it breaks the pattern the other eleven route files follow. If an interviewer notices, the honest answer is: "That's inconsistent with the rest of the project. Every other route delegates to a controller; the AI route doesn't, because it was the last feature I added and it's a single handler. It should be moved into an `aiController.js`."

## 12.3 Middleware execution order

```
Request
   ↓
app.use(cors())                  ← global, runs for every request
   ↓
app.use(express.json())          ← global, parses the body
   ↓
app.use("/api/products", ...)    ← path matched, enter the router
   ↓
router.post("/", ...)            ← method + path matched
   ↓
protect                          ← route-level, must call next()
   ↓
authorizeRoles("seller")         ← route-level, must call next()
   ↓
createProduct                    ← final handler, sends the response
```

Any middleware that sends a response instead of calling `next()` ends the chain immediately. That is exactly what `protect` does on a 401 and what `authorizeRoles` does on a 403.

**No global error-handling middleware exists in this project.** There is no `app.use((err, req, res, next) => {...})`. Instead every controller has its own `try/catch` that returns a 500. That works, but it means the same nine-line catch block is repeated across roughly 35 controller functions.
*Possible improvement — not part of the current implementation:* add a central error handler and an `asyncHandler` wrapper.

---

# PART 13 — MONGODB + MONGOOSE

## 13.1 Core vocabulary, anchored to this project

| Term | Meaning | In Storage Wars |
|---|---|---|
| **Database** | A container of collections | `Storagewars` |
| **Collection** | A group of documents (like a table) | `users`, `auctions`, `bids`, ... |
| **Document** | One record (like a row) | One auction |
| **Field** | One key/value pair (like a column) | `currentBid: 6800` |
| **ObjectId** | MongoDB's 12-byte unique identifier, shown as 24 hex characters | `_id`, and every `ref` field |
| **Schema** | Mongoose's definition of a document's shape and rules | `auctionSchema` |
| **Model** | The class built from a schema that runs queries | `const Auction = mongoose.model("Auction", auctionSchema)` |

## 13.2 The nine collections

Mongoose derives the collection name by lowercasing and pluralising the model name:

| Model | Collection | File |
|---|---|---|
| `User` | `users` | `User.model.js` |
| `Category` | `categories` | `Category.model.js` |
| `Product` | `products` | `Product.model.js` |
| `Auction` | `auctions` | `Auction.model.js` |
| `Bid` | `bids` | `Bid.model.js` |
| `Order` | `orders` | `Order.model.js` |
| `Watchlist` | `watchlists` | `Watchlist.model.js` |
| `Notification` | `notifications` | `Notification.model.js` |
| `Contact` | `contacts` | `Contact.model.js` |

## 13.3 Which document stores which reference

| Collection | Reference field | Points to | Required |
|---|---|---|---|
| `products` | `category` | `Category` | yes |
| `products` | `seller` | `User` | yes |
| `auctions` | `product` | `Product` | yes |
| `auctions` | `seller` | `User` | yes |
| `bids` | `auction` | `Auction` | yes |
| `bids` | `bidder` | `User` | yes |
| `orders` | `auction` | `Auction` | yes |
| `orders` | `product` | `Product` | yes |
| `orders` | `buyer` | `User` | yes |
| `orders` | `seller` | `User` | yes |
| `watchlists` | `user` | `User` | yes |
| `watchlists` | `auction` | `Auction` | yes |
| `notifications` | `user` | `User` | yes |
| `users` | — | — | no references out |
| `categories` | — | — | no references out |
| `contacts` | — | — | no references out |

Every relationship in this project is **referenced**, not embedded. Nothing stores a copy of another document.

**Interview Q:** "Why reference instead of embed?"
**Answer:** "If I embedded the seller's details inside every product and auction, then a seller changing their email would leave stale copies everywhere. Referencing means the user lives in one place and everything points at it by `_id`. The trade-off is that reading requires a `populate()`, which is an extra lookup — but correctness matters more here than saving one lookup."

## 13.4 `ref` and `populate()`

The `ref` string in the schema tells Mongoose which **model** an ObjectId points to:

```js
category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"]
}
```

Without `populate()`, a product document comes back as:
```json
{ "_id": "68b5...", "name": "Vintage Motorcycle", "category": "68a1...", "seller": "68b1..." }
```
Two opaque ids the frontend cannot display.

With `populate()` in `productController.getProducts`:
```js
const products = await Product.find()
    .populate("category", "name")
    .populate("seller", "name email");
```
you get:
```json
{
  "_id": "68b5...",
  "name": "Vintage Motorcycle",
  "category": { "_id": "68a1...", "name": "Vehicles" },
  "seller":   { "_id": "68b1...", "name": "Rohan Mehta", "email": "rohan@example.com" }
}
```

The second argument is a **projection** — a space-separated list of fields to include. `"name email"` returns only those two fields plus `_id`. That matters here: without the projection, populating `seller` would return the whole user document **including the hashed password**. The projection is doing security work, not just saving bandwidth.

### Nested populate — the deepest example in the project

`watchlistController.getWatchlist` populates three levels: watchlist → auction → product → category.

```js
const watchlist = await Watchlist.find({ user: req.user.id })
    .populate({
        path: "auction",
        populate: [{
            path: "product",
            select: "name images description category",
            populate: { path: "category", select: "name" }
        }]
    })
    .sort({ createdAt: -1 });
```

`bidController.getAllBids` populates bid → auction → (product, seller) and bid → bidder in one query:
```js
const bids = await Bid.find()
    .populate({
        path: "auction",
        populate: [
            { path: "product", select: "name" },
            { path: "seller",  select: "name email" }
        ]
    })
    .populate("bidder", "name email")
    .sort({ createdAt: -1 });
```

**How `populate` actually works.** It is not a SQL JOIN. Mongoose runs the main query, collects the ObjectIds from the ref fields, then issues a second query (`$in`) against the referenced collection and stitches the results together in application memory.

**Interview Q:** "Is `populate` a join?"
**Answer:** "Not at the database level. Mongoose runs the first query, gathers the referenced ObjectIds, then runs a second query on the other collection with `$in` and merges the results in Node. MongoDB does have a real server-side join with `$lookup` in the aggregation pipeline, but for this project's data volume `populate` is simpler and clearer."

## 13.5 Every populate call in the project

| Controller | Populates |
|---|---|
| `productController.getProducts` / `getProductById` | `category` (name), `seller` (name email) |
| `auctionController.getAuctions` / `getAuctionById` | `product` (name images description category), `seller` (name email) |
| `auctionController.getAuctionWinner` | `product` (name); winning bid's `bidder` (name email) |
| `bidController.getBids` | `bidder` (name email) |
| `bidController.getAllBids` | `auction` → product (name) + seller (name email); `bidder` (name email) |
| `bidController.getMyBids` | `auction` → product (name) |
| `bidController.updateBidStatus` | `auction` → seller (name email) |
| `orderController.getOrders` | `product` (name), `auction`, `seller` (name email) |
| `orderController.getMyWonAuctions` | `product` (name images startingPrice), `auction`, `seller` (name email) |
| `orderController.getOrderById` | `product`, `auction`, `seller`, `buyer` |
| `watchlistController.getWatchlist` | `auction` → product → category |

## 13.6 A subtle populate detail worth knowing

In `auctionController.getAuctions`, `product` is populated with the projection `"name images description category"`. Note that `category` here is included as a **raw ObjectId**, not populated into an object. But `AuctionCard.jsx` reads:

```jsx
const category = product?.category?.name || "Auction";
```

Since `product.category` is a plain ObjectId string, `.name` is `undefined`, so the card falls back to the literal text `"Auction"` for every card on the `/auctions` page.

The Watchlist page does not have this issue, because `watchlistController` nests one level deeper and populates `category` with `select: "name"`.

*Possible improvement — not part of the current implementation:* add the nested populate in `getAuctions` so the real category name shows on auction cards.

## 13.7 CRUD operations used in this project

| Operation | Mongoose methods actually used | Example |
|---|---|---|
| **Create** | `Model.create()` | `Product.create({...})`, `Bid.create({...})` |
| **Read** | `find()`, `findOne()`, `findById()`, `countDocuments()`, `aggregate()` | `Bid.find({ bidder: req.user.id })` |
| **Update** | `findByIdAndUpdate()`, `findOneAndUpdate()`, and load-modify-`save()` | see below |
| **Delete** | `findByIdAndDelete()`, `findOneAndDelete()`, `document.deleteOne()` | see below |

**Two different update styles are deliberately used:**

*Style A — one-shot update* (`userController`, `categoryController`, `notificationController`):
```js
const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, mobile, address, city, gender, status },
    { new: true, runValidators: true }
).select("-password");
```
- `new: true` returns the **updated** document; without it Mongoose returns the pre-update version.
- `runValidators: true` re-runs schema validation on the update, which Mongoose does **not** do by default.
- `.select("-password")` excludes the password field from the result.

*Style B — load, check ownership, modify, save* (`productController`, `auctionController`, `bidController`, `orderController`):
```js
const product = await Product.findById(req.params.id);
if (!product) return res.status(404)...
if (ownership fails) return res.status(403)...
Object.assign(product, req.body);
await product.save();
```
Style B is required wherever an ownership check is needed, because you must read the document to know who owns it before deciding whether the update is allowed.

**A security note on `Object.assign(product, req.body)` in `updateProduct`:** this copies *every* key from the request body onto the document. If a request included `{ "seller": "<another user id>" }`, the product's ownership would be reassigned. This is called **mass assignment**.
*Possible improvement — not part of the current implementation:* destructure only the fields that should be updatable, as `updateAuction` and `updateUser` do.

**Two delete styles are also used:**
- `findByIdAndDelete(id)` — one call, used where no ownership check is needed (`deleteUser`, `deleteCategory`, `deleteOrder`)
- `findById(id)` → ownership check → `document.deleteOne()` — used in `deleteProduct` and `deleteAuction`
- `findOneAndDelete({ _id: req.params.id, user: req.user.id })` — used in `removeFromWatchlist`, which folds the ownership check **into the query itself**. This is the most elegant of the three: if the watchlist item does not belong to this user, the query simply finds nothing and returns 404.

## 13.8 Aggregation — `reportController.js`

The only place in the project that uses the aggregation pipeline:

```js
const totalSalesResult = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
]);
const totalSales = totalSalesResult[0]?.total || 0;
```

- `$match` filters documents — like `WHERE`.
- `$group` groups and computes — like `GROUP BY` with `SUM()`.
- `_id: null` means "put everything in one group", producing a single total.
- `$ne` means "not equal".
- `totalSalesResult[0]?.total || 0` handles the empty-database case, where `aggregate` returns `[]` and `[0]` would be `undefined`.

And the monthly breakdown:
```js
const monthlyPerformance = await Order.aggregate([
    { $match: { createdAt: { $gte: startOfYear }, status: { $ne: "cancelled" } } },
    { $group: { _id: { month: { $month: "$createdAt" } }, sales: { $sum: "$amount" } } },
    { $sort: { "_id.month": 1 } }
]);
```
`$month` extracts the month number (1–12) from a date. `$sort: 1` is ascending.

**Interview Q:** "Why aggregation instead of fetching all orders and summing in JavaScript?"
**Answer:** "The aggregation runs inside MongoDB, so only the final number crosses the network. Fetching every order into Node to sum them would transfer the whole collection and use application memory. With a few hundred orders you wouldn't notice; with a hundred thousand it would matter."

---

# PART 14 — USER MODULE

## 14.1 `models/User.model.js` — every field

```js
const userSchema = new mongoose.Schema({
    name:     { type: String, required: [true, "Name is required"], trim: true },
    email:    { type: String, required: [true, "Email is required"],
                unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "Password is required"] },
    mobile:   { type: String, required: [true, "Mobile is required"], trim: true },
    address:  { type: String, required: [true, "Address is required"], trim: true },
    city:     { type: String, required: [true, "City is required"], trim: true },
    gender:   { type: String, required: [true, "Gender is required"] },
    role:     { type: String, enum: ["admin", "seller", "customer"], default: "customer" },
    status:   { type: String, enum: ["active", "blocked"], default: "active" }
}, { timestamps: true });
```

| Field | Type | Rules | Purpose |
|---|---|---|---|
| `name` | String | required, trim | Displayed in dashboards, populated into products/auctions/bids |
| `email` | String | required, unique, lowercase, trim | Login identifier |
| `password` | String | required | Stores the **bcrypt hash**, never the plain password |
| `mobile` | String | required, trim | Contact detail. **String, not Number** — see below |
| `address` | String | required, trim | Delivery context |
| `city` | String | required, trim | Location |
| `gender` | String | required, **no enum** | Free text at the schema level; the frontend `select` restricts it to male/female/other |
| `role` | String | enum of 3, default "customer" | Drives every authorization decision |
| `status` | String | enum of 2, default "active" | Admin block/unblock flag |
| `createdAt` / `updatedAt` | Date | automatic via `timestamps: true` | Used by `reportController` to count new users this month |

**Why `mobile` is a String, not a Number.** A Number would drop a leading zero, cannot hold a `+91` prefix or spaces, and you never do arithmetic on a phone number. Storing it as a String is correct.

**Why `gender` has no enum but `role` does.** `role` controls access, so an invalid value would be a security problem — the enum is a hard guarantee. `gender` is descriptive data only, so the schema stays permissive and the UI does the constraining. This is an honest design difference worth being able to explain.

## 14.2 `unique: true` on email

`unique` is **not a validator** — it is an instruction to MongoDB to build a unique index on that field. The consequences:

- The error it produces is not a Mongoose ValidationError but a MongoDB duplicate-key error, code `E11000`.
- In this project that would be caught by the controller's `catch` and returned as a **500**, not a 400.
- That is why `registerUser` also does an explicit `User.findOne({ email })` check first, so the normal duplicate case returns a clean **400 "Email already registered"**. The index is the backstop for the race condition where two identical registrations arrive at the same instant.

## 14.3 `lowercase` and `trim`

- `trim: true` removes leading and trailing whitespace, so `"  Rohan  "` is stored as `"Rohan"`. Applied to `name`, `email`, `mobile`, `address`, `city`.
- `lowercase: true` on email means `"Rohan@Gmail.com"` is stored as `"rohan@gmail.com"`. Without it, the same person registering twice with different capitalisation would create two accounts, because the unique index is case-sensitive.

These are **setters**, applied when the value is assigned. In current Mongoose versions they are also applied to query filters, which keeps email matching at login consistent with how the value was stored.

## 14.4 Why the password is stored as a hash

Hashing is one-way — you cannot compute the original password from `$2a$10$N9qo8uLOickgx2ZMRZoMy...`. So:

- If the database leaks, the passwords are not directly usable.
- Even you, as the developer, cannot read a user's password.
- Verification works without ever storing the plain text: `bcrypt.compare(entered, storedHash)` re-hashes the entered password with the salt embedded in the stored hash and compares the results.

Bcrypt adds two things beyond a plain hash like SHA-256:
1. **A salt** — random data mixed in, so two users with the password `"password123"` get completely different hashes. This defeats rainbow tables.
2. **A cost factor** — `10` here, meaning 2¹⁰ = 1024 key-expansion rounds. It makes each hash deliberately slow, which is irrelevant for one login but crippling for an attacker trying millions of guesses.

**Note:** the salt does not need a separate database column. Bcrypt embeds it inside the hash string, which is why `bcrypt.compare` needs only the entered password and the stored hash.

## 14.5 `userController.js` — the four admin operations

All four routes are `authorizeRoles("admin")`.

| Function | Route | Notes |
|---|---|---|
| `getUsers` | `GET /api/users` | `User.find().select("-password")` — the minus sign **excludes** the field |
| `getUserById` | `GET /api/users/:id` | Same exclusion; 404 if not found |
| `updateUser` | `PATCH /api/users/:id` | Destructures only `name, mobile, address, city, gender, status` — deliberately **not** `email`, `password` or `role`, so those cannot be changed through this endpoint |
| `deleteUser` | `DELETE /api/users/:id` | `findByIdAndDelete`; 404 if not found |

**The `.select("-password")` pattern is important to point out.** Every read of a user excludes the hash. Without it, the admin Users page would receive every user's bcrypt hash in the browser's network tab.

**An honest gap:** `deleteUser` removes the user document but leaves their products, auctions, bids and orders in place, all pointing at an ObjectId that no longer exists. Those `populate()` calls would then return `null` for `seller` or `bidder`. There are no cascade rules and no soft delete.
*Possible improvement — not part of the current implementation:* either block deletion of users with existing records, or set `status: "blocked"` instead of deleting.

## 14.6 Where the frontend uses this module

`dashboards/admin/Users.jsx`:
- `useEffect` → `GET /users` → `setUsers(response.data.users)`
- Renders through `DataTable` with headers `["Name", "Email", "Role", "Status"]`
- The action button calls `toggleUserStatus(user)`, which flips `active` ↔ `blocked` and sends `PATCH /users/:id` with the new status
- On success it replaces that user in state with `response.data.user`, the server's version — the safe way to do an optimistic-looking update

`AdminDashboard.jsx` also calls `GET /users` purely to count them for the "Users" stat card.

---

# PART 15 — CATEGORY MODULE

## 15.1 The model

```js
const categorySchema = new mongoose.Schema({
    name:        { type: String, required: [true, "Category name is required"],
                   unique: true, trim: true },
    description: { type: String, trim: true },
    status:      { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });
```

Only `name` is required. `description` is optional, and `status` defaults to `"active"`.

## 15.2 Routes and authorization

| Method | Endpoint | Roles allowed | Controller |
|---|---|---|---|
| POST | `/api/categories` | **admin only** | `createCategory` |
| GET | `/api/categories` | admin, seller, customer | `getCategories` |
| GET | `/api/categories/:id` | **admin only** | `getCategoryById` |
| PATCH | `/api/categories/:id` | **admin only** | `updateCategory` |
| DELETE | `/api/categories/:id` | **admin only** | `deleteCategory` |

The asymmetry is deliberate and easy to justify: sellers need to *read* the category list to populate the dropdown when adding a product, but only the admin decides what categories exist. If any seller could create categories, the taxonomy would fragment within a week ("Electronics", "electronic", "Electronics & Gadgets").

**Note that even `GET /api/categories` requires a token.** There is no public category endpoint.

## 15.3 How categories connect to products

`Product.model.js` stores `category` as an ObjectId with `ref: "Category"`. The chain in the UI:

```
Admin creates a category                    POST /api/categories
      ↓
Seller opens Add Product                    GET /api/categories  (in useEffect)
      ↓
Dropdown renders <option value={category._id}>{category.name}</option>
      ↓
Seller selects one; formData.category = the ObjectId string
      ↓
POST /api/products with category: "<ObjectId>"
      ↓
Mongoose casts the string to an ObjectId and validates it against the schema
      ↓
Later reads use .populate("category", "name") to turn the id back into a name
```

The key detail to explain in an interview: **the dropdown's `value` is the ObjectId, not the name.** That is what makes the reference work.

## 15.4 The admin Categories page

`dashboards/admin/Categories.jsx` has only two of the four operations wired to the UI:

| Backend capability | Frontend UI |
|---|---|
| Create | ✅ text input + Add button → `POST /categories` |
| Read | ✅ `useEffect` → `GET /categories` |
| Update | ❌ **no edit UI** — `PATCH /api/categories/:id` exists on the backend but is not called anywhere in the frontend |
| Delete | ✅ trash icon → `DELETE /categories/:id` |

Also note that the Add form sends only `{ name: name.trim() }` — the `description` field exists in the model but there is no input for it, so every category created through the UI has no description.

Be precise about this in a viva: "Update category is implemented in the API and I can demonstrate it in Postman, but I did not build an edit form for it in the admin UI."

There is a **separate, unrelated** `pages/categories/Categories.jsx` for the public site. That one imports the hardcoded `categories` array from `src/data.js` and does not call the API at all.

## 15.5 A deletion gap worth naming

`deleteCategory` removes the category document with no check for products referencing it. Any product whose `category` pointed at it now holds a dangling ObjectId, and `populate("category", "name")` will return `null` for it. `AdminProducts.jsx` handles this gracefully in the UI with `product.category?.name || "No Category"`, but the data is inconsistent.

*Possible improvement — not part of the current implementation:* before deleting, run `Product.countDocuments({ category: req.params.id })` and refuse if it is greater than zero.

---

# PART 16 — PRODUCT MODULE

## 16.1 `Product.model.js` — every field

```js
const productSchema = new mongoose.Schema({
    name:          { type: String, required: [true, "Product name is required"], trim: true },
    description:   { type: String, required: [true, "Product description is required"], trim: true },
    category:      { type: mongoose.Schema.Types.ObjectId, ref: "Category",
                     required: [true, "Category is required"] },
    images:        { type: [String], default: [] },
    startingPrice: { type: Number, required: [true, "Starting price is required"], min: 0 },
    seller:        { type: mongoose.Schema.Types.ObjectId, ref: "User",
                     required: [true, "Seller is required"] },
    status:        { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });
```

| Field | Notes |
|---|---|
| `name` | Product title shown on cards and tables |
| `description` | Required — the seller must describe the item |
| `category` | ObjectId → Category. Enables filtering and display |
| `images` | **An array of Strings, defaulting to `[]`** — URLs, not files. There is no upload endpoint |
| `startingPrice` | `min: 0` prevents a negative price. Copied into the auction when one is created |
| `seller` | ObjectId → User. Set by the server, never by the client |
| `status` | `active` / `inactive` — the admin's product visibility toggle |
| `timestamps` | `createdAt`, `updatedAt` |

**About `images`.** The type `[String]` means an array of strings. The frontend `AddProduct.jsx` always sends `images: []` — an empty array — and the form shows an explicit placeholder:

> "Image upload will be added later. Current backend does not have image upload API."

So **image upload is not implemented in the current project.** Products can hold image URLs if inserted directly into MongoDB, and `AuctionCard` and `AuctionDetail` will render `product.images[0]` when present, falling back to a "No image available" block when absent. Say this plainly rather than claiming an image feature.

## 16.2 Seller ownership — why it matters and how it is enforced

Ownership is set at creation and never trusted from the client:

```js
const product = await Product.create({
    name, description, category, images, startingPrice,
    seller: req.user.id            // ← from the verified JWT, not from req.body
});
```

Note what is **absent** from the destructuring at the top of `createProduct`:
```js
const { name, description, category, images, startingPrice } = req.body;
```
`seller` and `status` are not read from the body at all. A malicious request that includes `"seller": "<someone else's id>"` has no effect, because that key is simply never used.

**Why a seller must only edit their own products.** Without the check, any seller could raise or lower a competitor's starting price, change their description, or delete their listing entirely — and the audit trail would show the product was modified with no indication of by whom.

## 16.3 The ownership check, explained

```js
if (req.user.role === "seller" &&
    String(product.seller) !== String(req.user.id)) {
    return res.status(403).json({
        success: false,
        message: "You can only update your own products"
    });
}
```

**`req.user.id`** — a string, from the decoded JWT payload. It is the user's MongoDB `_id` as a 24-character hex string.

**`product.seller`** — a Mongoose `ObjectId` instance, because the document was loaded with `findById` and not populated.

**`String(...)` on both sides** — `ObjectId` has a `toString()` that returns the hex string. Without the conversion, `product.seller !== req.user.id` compares an object with a string, which is always unequal, so **every** seller would get a 403, including the real owner. This one detail is a classic interview follow-up.

**The `req.user.role === "seller" &&` prefix** — makes the rule seller-specific. An admin short-circuits past it and can edit any product, which is the intended admin power.

## 16.4 Complete product creation flow

```
Seller opens /seller/add-product          (AddProduct.jsx)
      ↓
useEffect → GET /categories → populate the dropdown
      ↓
Seller fills name, category, startingPrice, startTime, endTime, description
      ↓
handleSubmit → e.preventDefault() → setLoading(true)
      ↓
STEP 1: api.post("/products", { name, description, category, images: [], startingPrice })
      ↓
Axios interceptor attaches Bearer token
      ↓
POST /api/products
      ↓
protect                     → req.user = { id, role: "seller" }
authorizeRoles("seller")    → passes
createProduct               → Product.create({ ..., seller: req.user.id })
      ↓
Mongoose validates: name/description/category/startingPrice required, price >= 0
      ↓
MongoDB inserts into "products"
      ↓
201 { success, message, product }
      ↓
STEP 2: api.post("/auctions", { product: product._id, startingPrice, startTime, endTime })
      ↓
201 → setSaved(true) → form cleared → green success message
```

**Important honest observation on this two-step flow.** `AddProduct.jsx` makes two sequential API calls with **no transaction and no rollback**. If the product is created successfully but the auction creation fails — for example, an invalid date — the product remains in the database with no auction attached. The user sees only the auction error.

*Possible improvement — not part of the current implementation:* either create both in a single backend endpoint wrapped in a MongoDB transaction, or delete the orphaned product in the frontend's catch block.

## 16.5 The other operations

### `GET /api/products` — `getProducts`
```js
const products = await Product.find()
    .populate("category", "name")
    .populate("seller", "name email");
```

Returns **all** products in the system with no filtering. There is no `?seller=` query parameter and no server-side filter for "my products".

That is why `MyProducts.jsx` and `BidderDashboard.jsx` filter on the client:
```js
const myProducts = allProducts.filter((product) =>
    String(product.seller?._id || product.seller) === String(user?._id || user?.id)
);
```

Be honest about this in your viva: the seller's own-products view is a **frontend filter over a full server response**, not a server-side query. It works, but a seller's browser receives every other seller's products in the network response.

*Possible improvement — not part of the current implementation:* in `getProducts`, add
```js
const filter = req.user.role === "seller" ? { seller: req.user.id } : {};
const products = await Product.find(filter)...
```

### `GET /api/products/:id` — `getProductById`
Same populates, 404 if not found. Note it is **not** currently called anywhere in the frontend — the admin Products page opens its detail modal from data already in state.

### `PATCH /api/products/:id` — `updateProduct`
Load → 404 check → ownership check → `Object.assign(product, req.body)` → `save()`.

Because `save()` is used (not `findByIdAndUpdate`), schema validators run automatically — unlike Style A updates, which need `runValidators: true`.

Called by two frontend pages with different intents:
- `MyProducts.jsx` — full edit modal (name, category, startingPrice, description, status)
- `AdminProducts.jsx` — sends only `{ status: newStatus }` to toggle active/inactive

### `DELETE /api/products/:id` — `deleteProduct`
Load → 404 check → ownership check → `product.deleteOne()`.

**Another honest gap:** deleting a product does not delete auctions that reference it. Those auctions keep a `product` ObjectId that no longer resolves, and `populate` returns `null`. The frontend handles it defensively (`auction.product?.name || "Auction Item"`), so nothing crashes, but the data is orphaned.

---

# PART 17 — AUCTION MODULE

## 17.1 `Auction.model.js` — every field

```js
const auctionSchema = new mongoose.Schema({
    product:       { type: ObjectId, ref: "Product", required: [true, "Product is required"] },
    seller:        { type: ObjectId, ref: "User",    required: [true, "Seller is required"] },
    startingPrice: { type: Number, required: [true, "Starting price is required"], min: 0 },
    startTime:     { type: Date, required: [true, "Auction start time is required"] },
    endTime:       { type: Date, required: [true, "Auction end time is required"] },
    currentBid:    { type: Number, default: 0, min: 0 },
    status:        { type: String, enum: ["upcoming","live","completed","cancelled"], default: "upcoming" }
}, { timestamps: true });
```

| Field | Meaning |
|---|---|
| `product` | Which product is being auctioned |
| `seller` | Who owns it — set server-side from `req.user.id` |
| `startingPrice` | The floor. Duplicated from the product deliberately, so changing the product's price later does not alter a running auction |
| `startTime` | When bidding opens; drives `upcoming → live` |
| `endTime` | When bidding closes; drives `→ completed`; also feeds the countdown `Timer` |
| `currentBid` | The highest bid amount placed so far. **Defaults to 0** |
| `status` | The lifecycle state |

**Why `currentBid` defaults to 0 and not `startingPrice`.** Because 0 means "no bids yet". The frontend computes the actual minimum with `Math.max(auction.startingPrice, auction.currentBid) + 1`, which handles the zero case correctly.

## 17.2 The four statuses

| Status | Meaning | Set by |
|---|---|---|
| `upcoming` | Created, `startTime` not reached | `createAuction` (hardcoded) |
| `live` | Between `startTime` and `endTime`; bidding is open | `updateAuctionStatuses` |
| `completed` | `endTime` has passed | `updateAuctionStatuses` |
| `cancelled` | Manually cancelled | Only via the admin edit form. **Nothing in the backend logic ever sets it automatically, and no controller treats it specially** |

`cancelled` is in the enum and selectable in the admin's Edit Auction dropdown, but it has no behavioural consequence anywhere in the codebase. Being able to say that precisely is better than implying it does something.

## 17.3 How status changes — the two mechanisms

**Mechanism 1 — the timer in `server.js`.** Runs immediately on startup, then every 60 seconds.

**Mechanism 2 — `updateAuctionStatuses()` in `auctionController.js`.** Called at the top of `getAuctions`, so every time anyone loads the auctions list, statuses are refreshed before the query runs:

```js
const getAuctions = async (req, res) => {
    await updateAuctionStatuses();          // ← refresh first
    const auctions = await Auction.find()
        .populate("product", "name images description category")
        .populate("seller", "name email");
    ...
};
```

**Why two mechanisms?** The timer guarantees statuses become correct within 60 seconds even with nobody using the app. The on-read call guarantees a user never sees a stale status — without it, an auction whose `startTime` passed 30 seconds ago would still display as "upcoming" until the next tick.

**The drift between them** (documented in Part 12.1): the controller version marks *any* non-completed expired auction as completed; the server version only converts `live` ones.

**Interview Q:** "How does an auction go live automatically?"
**Answer:** "Two ways. `server.js` runs `updateAuctionStatuses` every 60 seconds with `setInterval`, which uses `Auction.updateMany` with `$lte` and `$gt` on the current time to flip upcoming auctions to live and expired ones to completed. And because a 60-second gap would be visible to a user, `getAuctions` also calls the same logic before every read, so the list is always current when someone loads it."

**Follow-up:** "Why not a cron job library?"
**Answer:** "`setInterval` was enough for a single-process application. In production with multiple server instances, every instance would run its own timer and duplicate the work, so I'd use a dedicated scheduler or a single worker process. That's future scope."

## 17.4 Auction creation

```js
const { product, startingPrice, startTime, endTime } = req.body;

const auction = await Auction.create({
    product,
    seller: req.user.id,       // ← server-derived
    startingPrice,
    startTime,
    endTime,
    currentBid: 0,             // ← hardcoded
    status: "upcoming"         // ← hardcoded
});
```

`currentBid` and `status` are hardcoded rather than taken from the body — a client cannot create an auction that is already `live` with a pre-set current bid.

Route: `POST /api/auctions`, `authorizeRoles("seller", "admin")`.

**A behaviour worth flagging honestly:** because `seller` is set from `req.user.id`, when an **admin** creates an auction on a seller's product, the auction's `seller` becomes the **admin's** id, not the product's owner. The product and the auction would then have different sellers. `AdminAuctions.jsx` does allow this — the create form lists every product in the system.

**No validation that the product exists or belongs to the caller.** `createAuction` does not check that `product` is a real ObjectId of an existing product, nor that the caller owns it. Mongoose will cast an invalid id and fail, but a valid ObjectId of another seller's product would be accepted.

**No `endTime > startTime` check on create.** That check exists in `updateAuction` but not in `createAuction`. The frontend does check it (`AuctionListings.jsx` and implicitly via the form), but a direct Postman call could create an auction ending before it starts.

*Possible improvements — not part of the current implementation:* verify the product exists, verify the caller owns it (for sellers), and validate `endTime > startTime` on create.

## 17.5 Auction editing

```js
const { product, startingPrice, startTime, endTime, status } = req.body;

const auction = await Auction.findById(req.params.id);
if (!auction) return 404;

if (req.user.role === "seller" && String(auction.seller) !== String(req.user.id))
    return 403 "You can only update your own auctions";

if (new Date(endTime) <= new Date(startTime))
    return 400 "End time must be after start time";

auction.product = product;
auction.startingPrice = startingPrice;
auction.startTime = startTime;
auction.endTime = endTime;
auction.status = status;

await auction.save();
```

**Important characteristic:** although the HTTP verb is PATCH (partial update), the controller assigns **all five fields unconditionally**. Sending only `{ status: "cancelled" }` would set `product`, `startingPrice`, `startTime` and `endTime` to `undefined`, and `save()` would then fail schema validation with a required-field error.

So in practice this endpoint behaves like a **PUT** — the client must send the complete object. `AuctionListings.jsx` does exactly that: its edit modal always sends all five fields. **There is no seller-facing edit UI for auctions** — `MyAuctions.jsx` has only a read-only "Manage" modal.

That mismatch between the verb and the behaviour is a legitimate thing to raise yourself: "It's declared as PATCH but implemented like PUT. The admin edit form always sends every field so it works, but strictly the method should be PUT, or the controller should only assign fields that are present."

## 17.6 Auction deletion

Load → 404 → seller ownership check → `auction.deleteOne()`.
Route: `DELETE /api/auctions/:id`, seller or admin.

Same orphaning caveat as products: bids, watchlist entries and orders that reference the deleted auction are left with dangling references.

## 17.7 The winner API

```js
const getAuctionWinner = async (req, res) => {
    const auction = await Auction.findById(req.params.id).populate("product", "name");
    if (!auction) return 404 "Auction not found";

    const winningBid = await Bid.findOne({
        auction: req.params.id,
        status: "approved"
    })
    .sort({ amount: -1 })
    .populate("bidder", "name email");

    if (!winningBid) return 404 "No approved bids found";

    res.status(200).json({
        success: true,
        message: "Auction winner found",
        winner: {
            bidder: winningBid.bidder,
            amount: winningBid.amount,
            auction: auction.product
        }
    });
};
```

**This is the single most important query in the business logic.** Read it carefully:

- `findOne` + `.sort({ amount: -1 })` = "the highest one". MongoDB sorts the matching documents descending by amount and returns the first.
- `status: "approved"` is the crucial filter. Pending and rejected bids can never win, no matter how high.
- `.populate("bidder", "name email")` gives the frontend the winner's name to display.
- If there are no approved bids, it returns **404 "No approved bids found"** — not a 200 with a null winner.

**Note the response shape quirk:** the key `winner.auction` actually contains the **product** object (`auction.product`), not the auction. That is what the controller assigns. The frontend does not use that key, so it is harmless, but it is a misleading name.

**A design consequence to state clearly:** if a seller never approves any bid, an auction ends with **no winner at all**, even if ten people bid on it. That is deliberate — approval is the seller's consent — but it means an unapproved auction produces nothing.

**Interview Q:** "How do you determine the winner?"
**Answer:** "`GET /api/auctions/:id/winner` runs `Bid.findOne({ auction: id, status: 'approved' }).sort({ amount: -1 })`. So it's the single highest bid among approved bids only. The bidder is populated so the frontend can display their name. If the seller never approved anything, the endpoint returns 404 with 'No approved bids found', and the UI shows 'No approved winner'."

**Follow-up:** "Why not just use `auction.currentBid`?"
**Answer:** "Because `currentBid` is updated as soon as a bid is placed, before approval. So it could be a pending or even a later-rejected bid. The winner has to come from a query over approved bids specifically. That's exactly why the two values can differ — and I'd flag that as something worth changing: `currentBid` should arguably only reflect approved bids."

Where the winner endpoint is used in the frontend:
- `AuctionDetail.jsx` — called only when `auction.status === "completed"`, to show the winner banner
- `AuctionResults.jsx` (seller) — called once per completed auction inside `Promise.all`, with a `try/catch` per call so a 404 on one auction does not break the whole page

---

# PART 18 — BID MODULE

This is the core of the application and the section an interviewer will probe hardest.

## 18.1 `Bid.model.js`

```js
const bidSchema = new mongoose.Schema({
    auction: { type: ObjectId, ref: "Auction", required: [true, "Auction is required"] },
    bidder:  { type: ObjectId, ref: "User",    required: [true, "Bidder is required"] },
    amount:  { type: Number, required: [true, "Bid amount is required"], min: 0 },
    status:  { type: String, enum: ["pending","approved","rejected"], default: "pending" }
}, { timestamps: true });
```

Four fields plus timestamps. `createdAt` matters — it is what `reportController` counts for "bids this month", and what every bid list sorts by (`.sort({ createdAt: -1 })`).

## 18.2 `placeBid` — all five validations, in order

Route: `POST /api/bids`, `protect`, `authorizeRoles("customer")`.

Before the role middleware even runs, `protect` has already established identity. So by the time `placeBid` executes, we know the caller is an authenticated customer.

```js
const { auction, amount } = req.body;

// 1. Does the auction exist?
const existingAuction = await Auction.findById(auction);
if (!existingAuction) {
    return res.status(404).json({ success: false, message: "Auction not found" });
}

// 2. Is the bidder the seller of this auction?
if (existingAuction.seller.toString() === req.user.id) {
    return res.status(403).json({ success: false, message: "Seller cannot bid on own auction" });
}

// 3. Is the auction live?
if (existingAuction.status !== "live") {
    return res.status(400).json({ success: false, message: "Auction is not live" });
}

// 4. Has it already ended?
if (new Date() > new Date(existingAuction.endTime)) {
    return res.status(400).json({ success: false, message: "Auction has ended" });
}

// 5. Is the amount higher than the current bid?
if (!amount || Number(amount) <= Number(existingAuction.currentBid)) {
    return res.status(400).json({
        success: false,
        message: "Bid amount must be greater than current bid"
    });
}

// 6. Create the bid
const bid = await Bid.create({
    auction,
    bidder: req.user.id,
    amount: Number(amount),
    status: "pending"
});

// 7. Update the auction's current bid
existingAuction.currentBid = Number(amount);
await existingAuction.save();

res.status(201).json({ success: true, message: "Bid placed successfully", bid });
```

### Why each validation exists

| # | Check | Why | Status code |
|---|---|---|---|
| 1 | Auction exists | A fabricated ObjectId would otherwise create an orphan bid | 404 |
| 2 | Not your own auction | A seller could otherwise bid up their own item — shill bidding | 403 |
| 3 | Status is `live` | Blocks bidding on upcoming, completed and cancelled auctions | 400 |
| 4 | `endTime` not passed | A safety net for the window between `endTime` passing and the status updater running | 400 |
| 5 | Amount strictly greater | An auction must ascend; equal or lower bids are meaningless | 400 |

**Check 4 is subtle and worth explaining.** Checks 3 and 4 look redundant, but they are not. The status updater runs every 60 seconds. In the worst case, an auction whose `endTime` passed 59 seconds ago is still marked `live` in the database. Check 3 would pass; check 4 catches it by comparing the actual clock time. Being able to explain that shows you thought about timing, not just about copying a validation list.

**Check 5's `!amount` guard** also catches `0`, `undefined`, `null` and an empty string, because all are falsy.

**`.toString()` vs `String()`.** Note check 2 uses `existingAuction.seller.toString() === req.user.id` while other controllers use `String(x) !== String(y)`. Both work here because `seller` is always a populated-free ObjectId at this point. The `String()` form is safer in general because it does not throw if the value is `null` or `undefined`.

### Status codes: 403 vs 400 in this controller

Check 2 returns **403** because it is an authorization failure — this specific user is not permitted to perform this action on this resource. Checks 3, 4 and 5 return **400** because they are bad-request failures — the state or the data is wrong, not the identity.

## 18.3 The three bid statuses

| Status | Set when | Effect |
|---|---|---|
| `pending` | On creation, hardcoded | Visible to the seller for review. **Already counted in `auction.currentBid`** |
| `approved` | Seller or admin approves | Eligible to win. Triggers a notification |
| `rejected` | Seller or admin rejects | Can never win. Triggers a notification. **`currentBid` is not rolled back** |

## 18.4 The most important behaviour to be honest about

> **`auction.currentBid` is updated the moment a bid is placed — before any approval.**

Consequences you should state before an interviewer finds them:

1. **`currentBid` means "the highest bid placed", not "the highest bid approved."** The auction detail page labels it "Last bid", which is actually accurate wording for what it holds.
2. **Rejecting a bid does not lower `currentBid`.** If a ₹50,000 bid is placed and then rejected, `currentBid` stays at ₹50,000, and the next bidder must beat ₹50,000 even though no valid bid of that size exists.
3. **The winner is still computed correctly**, because `getAuctionWinner` queries approved bids only and ignores `currentBid` entirely.

Your original design intent (in `ProjectDetails.txt`) was that the *approved* bid becomes the visible current bid. The implementation diverged from that.

*Possible improvement — not part of the current implementation:* move the `currentBid` update from `placeBid` into `updateBidStatus`, setting it only on approval, and recomputing it from the highest remaining approved bid on rejection.

**Interview Q:** "If a bid is rejected, does the current bid go back down?"
**Answer:** "No, and that's a real limitation I can explain. I update `auction.currentBid` inside `placeBid`, as soon as a bid passes validation, so it reflects the highest bid *placed*, not the highest *approved*. Rejecting a bid changes only the bid's status. The winner calculation is unaffected because it queries approved bids and sorts by amount. But if I were fixing it, I'd move the `currentBid` write into `updateBidStatus` so it only changes on approval, and recompute it from the remaining approved bids when one is rejected."

## 18.5 The three read endpoints and how they differ

### `GET /api/bids/my` — customer's own bids

```js
const bids = await Bid.find({ bidder: req.user.id })
    .populate({ path: "auction", populate: { path: "product", select: "name" } })
    .sort({ createdAt: -1 });
```

Scoped by `req.user.id` at the **database level**. A customer can never see another customer's bids, because the query filter comes from their own verified token. Route is `authorizeRoles("customer")`.

### `GET /api/bids` — all bids (admin) or own-auction bids (seller)

```js
const bids = await Bid.find()
    .populate({ path: "auction", populate: [
        { path: "product", select: "name" },
        { path: "seller",  select: "name email" }
    ]})
    .populate("bidder", "name email")
    .sort({ createdAt: -1 });

let filteredBids = bids;

if (req.user.role === "seller") {
    filteredBids = bids.filter((bid) =>
        bid.auction &&
        bid.auction.seller &&
        String(bid.auction.seller._id) === String(req.user.id)
    );
}
```

**Be precise about this in a viva:** the seller filter is applied **in JavaScript, after fetching every bid in the database**. It is not a database query. So:

- The response the seller receives is correctly scoped — no data leak.
- But the server loaded and populated every bid in the system to produce it.
- The `bid.auction && bid.auction.seller` guards exist because a bid whose auction was deleted would populate to `null` and crash on `.seller._id`.

*Possible improvement — not part of the current implementation:* for sellers, first query `Auction.find({ seller: req.user.id }).select("_id")` and then `Bid.find({ auction: { $in: auctionIds } })`, so the filtering happens in the database.

### `GET /api/bids/:auctionId` — all bids on one auction

```js
const bids = await Bid.find({ auction: req.params.auctionId })
    .populate("bidder", "name email")
    .sort({ createdAt: -1 });
```

Allowed for admin, seller **and customer** with no ownership check. So any logged-in customer who knows an auction id can see every bidder's name and email on that auction.

*Possible improvement — not part of the current implementation:* restrict this to the auction's seller and admin, or return amounts without bidder identities for customers.

**Route ordering detail worth pointing out.** In `bidRoutes.js`, `/my` is declared **before** `/:auctionId`:
```js
router.get("/",            protect, authorizeRoles("admin","seller"), getAllBids);
router.get("/my",          protect, authorizeRoles("customer"), getMyBids);
router.get("/:auctionId",  protect, authorizeRoles("admin","seller","customer"), getBids);
```
Express matches in declaration order. If `/:auctionId` came first, a request to `/api/bids/my` would match it with `auctionId = "my"`, and Mongoose would throw a CastError trying to convert `"my"` to an ObjectId. The same ordering discipline appears in `orderRoutes.js`, where `/won` precedes `/:id`.

## 18.6 `updateBidStatus` — the approval workflow

Route: `PATCH /api/bids/:bidId/status`, `authorizeRoles("admin", "seller")`.

```js
const { status } = req.body;

// 1. Only two values allowed
if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Status must be approved or rejected" });
}

// 2. Find the bid, with its auction and that auction's seller
const bid = await Bid.findById(req.params.bidId).populate({
    path: "auction",
    populate: { path: "seller", select: "name email" }
});
if (!bid) return res.status(404)... "Bid not found";

// 3. The auction must still exist
if (!bid.auction) return res.status(404)... "Auction not found";

// 4. A seller may only act on bids for their own auctions
if (req.user.role === "seller" &&
    String(bid.auction.seller?._id) !== String(req.user.id)) {
    return res.status(403).json({
        success: false,
        message: "You can only manage bids on your own auctions"
    });
}

// 5. Update
bid.status = status;
await bid.save();

// 6. Notify the bidder
await Notification.create({
    user: bid.bidder,
    message: status === "approved"
        ? "Your bid has been approved."
        : "Your bid has been rejected.",
    type: "bid"
});
```

Three points worth noting:

- **Validation 1 means a bid cannot be reverted to `pending`** through this endpoint, even though `pending` is a valid enum value. The workflow is one-directional.
- **`bid.auction.seller?._id`** uses optional chaining, needed because `seller` is populated and could be `null` if the user was deleted.
- **The notification is created here and only here.** This is the single automatic notification trigger in the entire application.
- **There is no check on the bid's current status.** An already-approved bid can be approved again, or flipped to rejected — and each action creates another notification.

## 18.7 How the frontend determines Pending / Winning / Outbid

This logic lives entirely in `dashboards/customer/MyBids.jsx` and is not computed by the backend:

```jsx
bid.status === "pending"
  ? "Pending"
  : bid.status === "approved" && bid.amount === bid.auction?.currentBid
  ? "Winning"
  : "Outbid"
```

Read as a decision table:

| Bid status | `bid.amount === auction.currentBid` | Displayed |
|---|---|---|
| `pending` | (not checked) | **Pending** |
| `approved` | true | **Winning** |
| `approved` | false | **Outbid** |
| `rejected` | (not checked) | **Outbid** |

**Two consequences you should volunteer rather than be caught on:**

1. **A rejected bid displays as "Outbid".** There is no separate "Rejected" label in this table, even though the backend distinguishes the two. The customer sees the same word for "someone bid higher" and "the seller refused your bid" — although the Notifications page does tell them explicitly.

2. **An approved bid can show "Outbid" while still being the winner.** Because `currentBid` tracks the latest *placed* bid, if your approved ₹10,000 bid is followed by someone else's *pending* ₹11,000 bid, `currentBid` becomes ₹11,000, your amount no longer equals it, and your row flips to "Outbid" — even though you are still the only approved bid and would win the auction.

**Interview Q:** "How does a customer know if they're winning?"
**Answer:** "On the My Bids page I compare the bid's amount to the auction's `currentBid`, and only show 'Winning' if the bid is approved and the amounts match. Being fully honest about the limitation: `currentBid` updates on every placed bid, including pending ones, so an approved bid can display as 'Outbid' even when it's still the highest approved bid and would actually win. The winner endpoint is authoritative; this label is a UI approximation."

## 18.8 The three different "bid" values — do not confuse them

| Value | Where it lives | What it means |
|---|---|---|
| **Bid status** | `bids.status` | The seller's decision on one specific bid: pending / approved / rejected |
| **Auction currentBid** | `auctions.currentBid` | A single Number: the highest amount **placed**, regardless of approval |
| **Winning bid** | Computed by query, stored nowhere | `Bid.findOne({ auction, status: "approved" }).sort({ amount: -1 })` |

The winning bid is **not a field** on any document. It is derived on demand. When it is turned into an `Order`, the amount is copied into `order.amount` — which is the first time it becomes persisted data.

## 18.9 The seller's Bids Received page

`dashboards/bidder/BidsReceived.jsx`:

- Fetches `GET /bids` (already server-filtered for sellers)
- **Filters again on the client** by comparing `bid.auction?.seller?._id` with the localStorage user id — a redundant second filter, harmless but duplicated
- Provides four filter buttons: All / Pending / Approved / Rejected, filtering `bid.status` locally
- Approve and Reject buttons call `PATCH /bids/:bidId/status`, then update that row in state

**A UI detail:** the Approve button renders whenever `bid.status !== "approved"`, and Reject whenever `bid.status !== "rejected"`. So a rejected bid still shows an Approve button — the seller can reverse a rejection. The admin `BidApprovals.jsx` page behaves differently: both buttons only render when `bid.status === "pending"`, so the admin cannot reverse a decision. The same backend endpoint, two different UI policies. Worth knowing if asked.

---

# PART 19 — ORDER MODULE

## 19.1 `Order.model.js`

```js
const orderSchema = new mongoose.Schema({
    auction: { type: ObjectId, ref: "Auction", required: true },
    product: { type: ObjectId, ref: "Product", required: true },
    buyer:   { type: ObjectId, ref: "User",    required: true },
    seller:  { type: ObjectId, ref: "User",    required: true },
    amount:  { type: Number, required: true, min: 0 },
    status:  { type: String,
               enum: ["pending","confirmed","shipped","delivered","cancelled"],
               default: "pending" }
}, { timestamps: true });
```

| Field | Purpose |
|---|---|
| `auction` | Traceability back to the auction |
| `product` | Denormalised for convenience — avoids a two-level populate to show the item name |
| `buyer` | The winning bidder |
| `seller` | The auction's seller |
| `amount` | **The winning bid amount, frozen at order creation.** This is the only place the winning amount is persisted |
| `status` | Fulfilment lifecycle |

**Why store both `auction` and `product`?** Strictly, `product` is derivable from `auction.product`. Storing it directly means `getOrders` can `.populate("product", "name")` in one step instead of nesting. It is deliberate denormalisation for read convenience.

## 19.2 The five order statuses

`pending → confirmed → shipped → delivered`, with `cancelled` as a terminal alternative.

**Important honesty point:** the *enum* defines five states, but only two are actually reachable through the running application:
- `pending` — set automatically on creation
- `confirmed` — set by the customer clicking "Complete Order" on the Won Auctions page

`shipped`, `delivered` and `cancelled` are valid values that `PATCH /api/orders/:id` would accept, but **no UI in the project sets them**. There is no shipping screen and no cancel button.

`cancelled` does have logical significance in `reportController`, which excludes cancelled orders from `totalSales`, `totalOrders` and `monthlyPerformance` — so the reporting is written to handle a state the UI never produces.

## 19.3 The two ways an order is created

### Path A — `createOrderFromAuction` (the real business flow)

Route: `POST /api/orders/from-auction/:auctionId`, **admin only**.

```js
// 1. Find the auction
const auction = await Auction.findById(req.params.auctionId);
if (!auction) return 404 "Auction not found";

// 2. It must be completed
if (auction.status !== "completed") return 400 "Auction is not completed";

// 3. Find the highest approved bid
const winningBid = await Bid.findOne({ auction: auction._id, status: "approved" })
    .sort({ amount: -1 });
if (!winningBid) return 404 "No approved bids found";

// 4. Prevent duplicates
const existingOrder = await Order.findOne({ auction: auction._id });
if (existingOrder) return 400 "Order already exists for this auction";

// 5. Create
const order = await Order.create({
    auction: auction._id,
    product: auction.product,
    buyer:   winningBid.bidder,
    seller:  auction.seller,
    amount:  winningBid.amount,
    status:  "pending"
});
```

This is the cleanest controller in the project. Every field is derived server-side — nothing comes from `req.body` at all. The buyer is the winning bidder, not the caller.

**Step 4 is the idempotency guard.** Without it, an admin clicking the button twice would create two orders for one auction. Since the query is `Order.findOne({ auction })`, one auction can produce at most one order.

**Where it is triggered in the UI:** `AuctionListings.jsx` renders a green shopping-bag button, but only for completed auctions:
```jsx
{auction.status === "completed" && (
    <button onClick={() => createOrder(auction._id)} ...><ShoppingBag size={16} /></button>
)}
```

### Path B — `createOrder` (manual)

Route: `POST /api/orders`, **customer only**.

```js
const { auction, product, seller, amount } = req.body;
const order = await Order.create({ auction, product, seller, buyer: req.user.id, amount });
```

Only `buyer` is server-derived. Everything else is taken from the request body with no validation — no check that the auction is completed, no check that this customer actually won it, no check on the amount.

**This endpoint is not called anywhere in the frontend.** No React component posts to `/orders`. It exists in the API and is reachable from Postman.

Be straightforward about this: "There are two order-creation endpoints. The one the application actually uses is the admin's `from-auction` endpoint, which derives everything from the auction and the winning bid. There's also a generic customer `POST /orders`, but nothing in the UI calls it, and it trusts the request body — I'd remove it or lock it down."

## 19.4 Reading orders

### `getOrders` — `GET /api/orders`

```js
const filter = req.user.role === "seller"
    ? { seller: req.user.id }
    : { buyer: req.user.id };

const orders = await Order.find(filter)
    .populate("product", "name")
    .populate("auction")
    .populate("seller", "name email")
    .sort({ createdAt: -1 });
```

The route allows `admin`, `seller` and `customer`, but the ternary only has two branches. **An admin falls into the `else`, so an admin sees orders where they personally are the buyer** — which is normally an empty list.

**So there is no "all orders" view for the admin.** The admin dashboard has no Orders page in `navigation.js`, which is consistent, but the API gap is real.

*Possible improvement — not part of the current implementation:*
```js
const filter =
    req.user.role === "admin"  ? {} :
    req.user.role === "seller" ? { seller: req.user.id } :
                                 { buyer: req.user.id };
```

### `getMyWonAuctions` — `GET /api/orders/won`

Customer only. `Order.find({ buyer: req.user.id })` with `product` populated including `images` and `startingPrice`.

Functionally this returns the same set as `getOrders` does for a customer — both filter on `buyer: req.user.id`. The difference is only the populate projection. That is why `CustomerDashboard.jsx` shows "Won Auctions" and "Orders" as separate stat cards that will always display the **same number**.

Say this plainly if asked: "Won Auctions and Orders query the same collection with the same filter, so the counts match. Conceptually 'won' should mean auctions won and 'orders' should mean orders placed, but since an order is only ever created from a won auction, they're the same set in this implementation."

### `getOrderById` — `GET /api/orders/:id`

The most thorough authorization in the project — two separate ownership checks:
```js
if (req.user.role === "seller" && order.seller._id.toString() !== req.user.id)
    return 403 "Access denied";

if (req.user.role === "customer" && order.buyer._id.toString() !== req.user.id)
    return 403 "Access denied";
```
An admin passes both conditions and can view any order. Note `order.seller._id` (with `._id`) because both are populated here.

**Not called anywhere in the frontend** — the Orders page opens its detail from data already in state.

## 19.5 Updating and deleting orders

### `updateOrder` — `PATCH /api/orders/:id`
Reads only `{ status }` from the body. Mirror-image ownership checks for customer and seller; admin passes both.

Called from `WonAuctions.jsx`:
```jsx
const response = await api.patch(`/orders/${order._id}`, { status: "confirmed" });
alert(response.data.message || "Order completed successfully");
window.location.reload();
```

Note the `window.location.reload()` — a full browser refresh instead of updating React state. It works, but it discards all component state and re-runs every request on the page. The rest of the project uses `setState`; this is the one place that reloads.
*Possible improvement — not part of the current implementation:* re-fetch the orders list or update the item in state.

**No status-transition validation.** `updateOrder` accepts any enum value in any order. An order could go from `delivered` straight back to `pending`.

### `deleteOrder` — `DELETE /api/orders/:id`
Admin only. `findByIdAndDelete`, 404 if missing. **Not called anywhere in the frontend.**

## 19.6 Complete order lifecycle as implemented

```
Auction endTime passes
      ↓  updateAuctionStatuses → status: "completed"
Admin opens /admin/auctions
      ↓  the green ShoppingBag button appears on completed rows only
Admin clicks it
      ↓  POST /api/orders/from-auction/:auctionId
      ↓  validates: completed ✓, approved bid exists ✓, no existing order ✓
Order created  { buyer: winningBid.bidder, amount: winningBid.amount, status: "pending" }
      ↓
Customer opens /buyer/won   →  GET /api/orders/won
      ↓  card shows product name, winning amount, "Order Status: pending"
Customer clicks "Complete Order"
      ↓  PATCH /api/orders/:id  { status: "confirmed" }
Order status: "confirmed"  →  page reloads
```

**There is no payment step anywhere in this flow.** No payment gateway, no invoice, no transaction record. "Complete Order" changes a string field. State that clearly — an interviewer will ask.

---

# PART 20 — WATCHLIST

## 20.1 The model

```js
const watchlistSchema = new mongoose.Schema({
    user:    { type: ObjectId, ref: "User",    required: [true, "User is required"] },
    auction: { type: ObjectId, ref: "Auction", required: [true, "Auction is required"] }
}, { timestamps: true });
```

A pure **join collection** — two references and nothing else. This is the standard way to model a many-to-many relationship in MongoDB when the relationship itself carries no extra data. One user can watch many auctions; one auction can be watched by many users.

`createdAt` gives the "recently added" ordering for free.

## 20.2 Routes — all three are customer-only

| Method | Endpoint | Controller |
|---|---|---|
| POST | `/api/watchlist` | `addToWatchlist` |
| GET | `/api/watchlist` | `getWatchlist` |
| DELETE | `/api/watchlist/:id` | `removeFromWatchlist` |

`authorizeRoles("customer")` on all three. A seller or admin gets 403.

## 20.3 How customer-specific data is determined

Never from the request. Always from `req.user.id`:

```js
// Add
const watchlist = await Watchlist.create({ user: req.user.id, auction });

// Read
const watchlist = await Watchlist.find({ user: req.user.id })...

// Remove
const watchlist = await Watchlist.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id           // ← ownership folded into the query
});
```

**`removeFromWatchlist` is the most elegant authorization pattern in the project.** Instead of load → check owner → delete, it puts both conditions in one query. If the item exists but belongs to a different user, the query matches nothing, `watchlist` is `null`, and it returns 404 "Watchlist item not found". One database round trip, and no way to delete someone else's entry.

Note it returns **404**, not 403. That is arguably better security: it does not confirm that an item with that id exists at all.

## 20.4 The four-level populate

```js
const watchlist = await Watchlist.find({ user: req.user.id })
    .populate({
        path: "auction",
        populate: [{
            path: "product",
            select: "name images description category",
            populate: { path: "category", select: "name" }
        }]
    })
    .sort({ createdAt: -1 });
```

Watchlist → auction → product → category. This is the only place in the project that resolves the category name through the auction chain, which is why the Watchlist page shows real category names on its cards while the main Auctions page shows the fallback text "Auction".

## 20.5 The frontend flow

**Adding** — from `AuctionDetail.jsx`:
```jsx
const handleAddToWatchlist = async () => {
    if (!auction) return;
    try {
        setAddingToWatchlist(true);
        await api.post("/watchlist", { auction: auction._id });
        alert("Added to watchlist successfully.");
    } catch (error) {
        console.error("ADD WATCHLIST ERROR:", error);
        alert(error.response?.data?.message || "Failed to add to watchlist");
    } finally {
        setAddingToWatchlist(false);
    }
};
```

**Viewing** — `dashboards/customer/Watchlist.jsx` fetches on mount and renders each item through the shared `AuctionCard`, passing `item.auction`:
```jsx
{watchlist.map((item) => (
  <div className="relative" key={item._id}>
    <AuctionCard a={item.auction} />
    <button onClick={() => removeFromWatchlist(item._id)} className="absolute right-3 top-3 ...">
      <Heart size={16} />
    </button>
  </div>
))}
```

Note the id passed to `removeFromWatchlist` is `item._id` — the **watchlist entry's** id, not the auction's id. That matches the backend, which deletes by `_id`.

**Removing** — `DELETE /watchlist/:id`, then filter it out of local state.

## 20.6 Two honest gaps

**1. Duplicates are possible.** There is no unique compound index on `{ user, auction }` and no existence check in `addToWatchlist`. Clicking "Add to Watchlist" three times creates three documents, and the Watchlist page shows the same auction three times.

*Possible improvement — not part of the current implementation:*
```js
watchlistSchema.index({ user: 1, auction: 1 }, { unique: true });
```

**2. The heart button is not a toggle.** On the auction detail page the button always adds; it never checks whether the auction is already watched and never removes. There is no visual indication that an auction is already on the watchlist.

Also note: `addToWatchlist` returns **500** on any failure rather than a specific 400, because there is no validation before `Watchlist.create` — the only errors are Mongoose errors, caught by the generic catch block.

---

# PART 21 — NOTIFICATIONS

## 21.1 The model

```js
const notificationSchema = new mongoose.Schema({
    user:    { type: ObjectId, ref: "User", required: [true, "User is required"] },
    message: { type: String, required: [true, "Notification message is required"], trim: true },
    type:    { type: String, enum: ["bid","auction","order","general"], default: "general" },
    isRead:  { type: Boolean, default: false }
}, { timestamps: true });
```

`user` is the **recipient**, not the sender.

## 21.2 Where notifications are actually created

There is exactly **one automatic trigger** in the entire application — `bidController.updateBidStatus`:

```js
await Notification.create({
    user: bid.bidder,
    message: status === "approved"
        ? "Your bid has been approved."
        : "Your bid has been rejected.",
    type: "bid"
});
```

Plus one manual endpoint, `POST /api/notifications` (admin only), which is **not called anywhere in the frontend**.

**This means the enum values `auction`, `order` and `general` are never produced by the running application.** Every notification in the database has `type: "bid"`. Only the admin, via Postman, could create another type.

Be precise about this: "Notifications are generated automatically in exactly one place — when a seller or admin approves or rejects a bid. The model supports auction, order and general types, but nothing currently generates them. Order creation, auction going live and auction ending do not create notifications."

## 21.3 Routes

| Method | Endpoint | Roles | Controller |
|---|---|---|---|
| POST | `/api/notifications` | admin only | `createNotification` |
| GET | `/api/notifications` | admin, seller, customer | `getNotifications` |
| PATCH | `/api/notifications/:id/read` | admin, seller, customer | `markAsRead` |

## 21.4 Reading and marking as read

```js
// Scoped by the token, newest first
const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 });

// Mark as read — ownership in the query, same pattern as watchlist removal
const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isRead: true },
    { new: true }
);
if (!notification) return 404 "Notification not found";
```

Again, the ownership condition is inside the query filter. A user cannot mark someone else's notification as read.

## 21.5 "Mark all as read" — implemented on the frontend, not the backend

There is **no** `PATCH /api/notifications/read-all` endpoint. The frontend simulates it:

```jsx
const unreadNotifications = notifications.filter((n) => !n.isRead);

await Promise.all(
  unreadNotifications.map((notification) =>
    api.patch(`/notifications/${notification._id}/read`, {}, { headers: {...} })
  )
);

setNotifications((current) => current.map((n) => ({ ...n, isRead: true })));
```

So "Mark all as read" with twelve unread notifications sends **twelve** HTTP requests in parallel.

**Interview Q:** "How does Mark All As Read work?"
**Answer:** "There's no bulk endpoint. The frontend filters the unread ones and fires one PATCH per notification through `Promise.all`, then updates local state. It works, but with many notifications it's a lot of requests — a single `updateMany` endpoint would be the right fix."

## 21.6 The notifications UI

`dashboards/customer/Notifications.jsx`:
- Fetches on mount
- Renders each as a card with the message in bold and the `type` below it
- Shows a gold **NEW** badge when `!notification.isRead`
- "Mark all as read" button at the bottom

**Note it is a customer-only page.** The route is `/buyer/notifications`, inside the customer `ProtectedRoute`, and `navigation.js` lists Notifications only in the `buyer` menu. **Sellers and admins have no notifications page**, even though the API allows all three roles to read them. Since notifications are only ever created for bidders, no notification is ever generated for a seller or admin anyway — so the gap is consistent, but it is a gap.

Also: there is no unread-count badge in the navbar or sidebar. A user only discovers a notification by visiting the page.

---

# PART 22 — REPORTS

## 22.1 What `getReports` actually returns

Route: `GET /api/reports`, **admin only**.

This is the section where your assumed list needs correcting. The controller **computes six values but returns only five:**

```js
res.status(200).json({
    success: true,
    reports: {
        totalSales,
        bidsThisMonth,
        newUsers,
        conversion,
        monthlyPerformance
    }
});
```

`completedAuctions` and `totalOrders` **are computed but not included in the response.** They exist only as intermediate values used to calculate `conversion`. Do not claim the API returns them.

## 22.2 Each metric, and where the number comes from

### `totalSales`
```js
const totalSalesResult = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
]);
const totalSales = totalSalesResult[0]?.total || 0;
```
The sum of `amount` across all non-cancelled orders. **All time**, not this month. Since an order's amount is the winning bid, this is total auction value converted into orders.

### `bidsThisMonth`
```js
const bidsThisMonth = await Bid.countDocuments({
    createdAt: { $gte: startOfMonth, $lt: startOfNextMonth }
});
```
Counts **every** bid created this calendar month — pending, approved and rejected alike. Not filtered by status.

The boundaries are computed with plain JavaScript Date arithmetic:
```js
const startOfMonth     = new Date(now.getFullYear(), now.getMonth(), 1);
const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
const startOfYear      = new Date(now.getFullYear(), 0, 1);
```
`new Date(year, month + 1, 1)` correctly rolls into the next year when the month is December — JavaScript normalises month 12 into January of the following year. Worth knowing if asked.

### `newUsers`
```js
const newUsers = await User.countDocuments({
    createdAt: { $gte: startOfMonth, $lt: startOfNextMonth }
});
```
All users registered this month, across all three roles.

### `conversion`
```js
const completedAuctions = await Auction.countDocuments({ status: "completed" });
const totalOrders       = await Order.countDocuments({ status: { $ne: "cancelled" } });

const conversion = completedAuctions > 0
    ? Math.round((totalOrders / completedAuctions) * 100)
    : 0;
```

**Meaning: of all completed auctions, what percentage produced an order?** A low number means auctions are ending without a winner — either no bids, or bids the seller never approved.

The `completedAuctions > 0` guard prevents division by zero on an empty database.

**Note it can exceed 100%** if orders exist for auctions that are not in `completed` status — for example an order created through the manual `POST /api/orders` endpoint.

### `monthlyPerformance`
```js
const monthlyPerformance = await Order.aggregate([
    { $match: { createdAt: { $gte: startOfYear }, status: { $ne: "cancelled" } } },
    { $group: { _id: { month: { $month: "$createdAt" } }, sales: { $sum: "$amount" } } },
    { $sort: { "_id.month": 1 } }
]);
```

Returns an array like:
```json
[ { "_id": { "month": 8 }, "sales": 42000 },
  { "_id": { "month": 9 }, "sales": 15500 } ]
```

**Only months that have orders appear.** A month with no orders is simply absent from the array — there is no zero-filling.

## 22.3 How the frontend displays them

`dashboards/admin/Reports.jsx`:

```jsx
<StatGrid items={[
  ["Total Sales",     money(reports?.totalSales),        IndianRupee],
  ["Bids This Month", reports?.bidsThisMonth || 0,       Gavel],
  ["New Users",       reports?.newUsers || 0,            Users],
  ["Conversion",      `${reports?.conversion || 0}%`,    TrendingUp],
]} />
```

Optional chaining plus `|| 0` fallbacks everywhere, so a failed request renders zeros rather than crashing.

## 22.4 The chart — be honest about this one

```jsx
<div className="mt-7 grid h-56 grid-cols-12 items-end gap-2">
  {(reports?.monthlyPerformance || []).map((item) => (
    <div
      key={item._id.month}
      className="rounded-t-lg bg-ink"
      style={{ height: "80%" }}
      title={`Month ${item._id.month}: ${money(item.sales)}`}
    />
  ))}
</div>
```

**Every bar has a hardcoded height of 80%.** The bar heights are **not proportional to sales**. The real value appears only in the `title` attribute, which shows as a browser tooltip on hover.

So the chart is:
- **Dynamic** in the number of bars (one per month that has orders) and in the tooltip values
- **Static** in bar height

Do not describe this as a working bar chart in a viva. The correct description: "The monthly performance section renders one bar per month that has sales, and the real figure shows in the tooltip. The bar heights are currently fixed rather than scaled to the values — I'd calculate `height: (sales / maxSales) * 100 + '%'` to make it a true chart. That's a known gap, not something I'm claiming works."

No charting library is used. There is no Chart.js, no Recharts, no D3 — the bars are plain divs with Tailwind classes.

## 22.5 Dynamic vs static data across the admin area — the precise picture

| Screen | Data source |
|---|---|
| Reports — four stat cards | **Dynamic** — `GET /reports` |
| Reports — bar count and tooltips | **Dynamic** |
| Reports — bar heights | **Static** (hardcoded 80%) |
| Admin Dashboard — Users, Live Auctions, Pending Bids | **Dynamic** — computed from `/users`, `/auctions`, `/bids` |
| Admin Dashboard — Revenue | **Static `null`**, renders as `—` |
| Admin Dashboard — Recent Activity | **Hardcoded array of four strings** |
| Admin Dashboard — Quick Actions | Static links (correct — they are navigation) |
| Admin Users / Products / Auctions / Bids / Categories | **Fully dynamic** |
| Admin Discounts | **Fully static** — local React state only |
| Public Home page | **Static** — imports from `src/data.js` |
| Public Categories page | **Static** — imports from `src/data.js` |
| Public Auctions page | **Dynamic** — `GET /auctions` |

Knowing this table cold is one of the most valuable things you can take into a viva, because it is exactly what a careful examiner will test by clicking around.

## 22.6 The Discounts page

`dashboards/admin/Discounts.jsx` holds three campaigns in `useState` and lets you add and toggle them. There is **no Discount model, no discountController, no discountRoutes and no `/api/discounts` endpoint.** Nothing persists — refreshing the page resets it.

State it directly: "Discounts is a UI prototype only. There's no backend model or API for it, so nothing is saved. It's the one admin screen I built the interface for but didn't implement end-to-end."

---

# PART 23 — DASHBOARDS

## 23.1 The shared pattern

Every dashboard page follows the same shape:

```
Component mounts
      ↓
useEffect(() => { fetchData(); }, [])
      ↓
api.get(...)  →  interceptor attaches Bearer token
      ↓
Express → protect → authorizeRoles → controller → Mongoose → MongoDB
      ↓
res.json({ success, message, data })
      ↓
setState(response.data.something || [])
      ↓
React re-renders  →  StatGrid / DataTable / cards display the values
```

---

## 23.2 ADMIN DASHBOARD (`/admin`)

**APIs called (in parallel via `Promise.all`):** `GET /users`, `GET /auctions`, `GET /bids`

**How each number is calculated — in the browser, not the server:**

```js
const users        = usersRes.data.users || [];
const auctions     = auctionsRes.data.auctions || [];
const bids         = bidsRes.data.bids || [];

const liveAuctions = auctions.filter((a) => a.status === "live").length;
const pendingBids  = bids.filter((b) => b.status === "pending").length;

setStats({ users: users.length, liveAuctions, pendingBids, revenue: null });
```

| Stat card | Source |
|---|---|
| Users | `users.length` — the full user list, counted client-side |
| Live Auctions | `.filter(status === "live").length` |
| Pending Bids | `.filter(status === "pending").length` |
| Revenue | **Hardcoded `null`** → displays `—` |

**Revenue is deliberately blank.** `AdminDashboard` does not call `/reports`, so it has no sales figure. The `money()` helper and the ternary `stats.revenue === null ? "—" : money(stats.revenue)` are in place for when it is wired up, but the value is never set.

**Recent Activity** is a hardcoded array:
```jsx
["New bid submitted on Motorcycle", "Product awaiting approval",
 "Customer account created", "Discount campaign updated"].map(...)
```
Static placeholder text. There is no activity log model.

*Possible improvement — not part of the current implementation:* call `GET /reports` for revenue, and build the activity feed from the newest bids, users and orders by `createdAt`.

**Other admin pages, precisely:**

| Page | Route | APIs | Notes |
|---|---|---|---|
| Auction Listings | `/admin/auctions` | `GET /auctions`, `GET /products`, `POST /auctions`, `PATCH /auctions/:id`, `DELETE /auctions/:id`, `POST /orders/from-auction/:id` | The richest page — two modals, six endpoints |
| Bid Approvals | `/admin/bids` | `GET /bids`, `PATCH /bids/:bidId/status` | Approve/Reject buttons only on pending bids |
| Users | `/admin/users` | `GET /users`, `PATCH /users/:id` | Block/Unblock toggle |
| Products | `/admin/products` | `GET /products`, `PATCH /products/:id` | Status toggle + detail modal |
| Categories | `/admin/categories` | `GET /categories`, `POST /categories`, `DELETE /categories/:id` | No edit UI |
| Discounts | `/admin/discounts` | none | Local state only |
| Reports | `/admin/reports` | `GET /reports` | See Part 22 |

---

## 23.3 SELLER DASHBOARD (`/seller`)

`BidderDashboard.jsx` fires four requests in parallel: `/products`, `/auctions`, `/bids`, `/orders`.

**Exactly how each of the four numbers is produced:**

```js
const user = JSON.parse(localStorage.getItem("user"));

// Products — filter ALL products down to mine, in the browser
const myProducts = productResponse.data.products.filter(
    (product) => product.seller?._id === user?.id
);

// Live Auctions — filter ALL auctions by seller AND status
const myLiveAuctions = auctionResponse.data.auctions.filter(
    (auction) => auction.seller?._id === user?.id && auction.status === "live"
);

// Bids Received — NO filter; the backend already scoped this for sellers
setBidCount(bidResponse.data.bids.length);

// Sales — sum of every order amount where I am the seller
const totalSales = orderResponse.data.orders.reduce(
    (total, order) => total + Number(order.amount || 0), 0
);
```

| Stat | Calculation | Filtered where? |
|---|---|---|
| **Products** | count of products where `seller._id === my id` | **Frontend** |
| **Live Auctions** | count of auctions where `seller._id === my id` **and** `status === "live"` | **Frontend** |
| **Bids Received** | `bids.length` straight from the response | **Backend** (`getAllBids` filters for sellers) |
| **Sales** | `reduce` summing `order.amount` | **Backend** (`getOrders` filters by `seller: req.user.id`) |

**Two honest points about the Sales figure:**
1. It includes orders of **every status**, including `cancelled`, because `getOrders` has no status filter. `reportController` deliberately excludes cancelled orders; this dashboard does not.
2. `product.seller?._id === user?.id` uses `===` on two strings — that works because `populate("seller", "name email")` returns an object whose `_id` serialises to a string in JSON. Other pages use the safer `String(...)` comparison.

**Other seller pages:**

| Page | Route | APIs | Notes |
|---|---|---|---|
| Add Product | `/seller/add-product` | `GET /categories`, `POST /products`, `POST /auctions` | Two sequential writes, no rollback |
| My Products | `/seller/products` | `GET /products`, `GET /categories`, `PATCH /products/:id`, `DELETE /products/:id` | Client-side "mine" filter; full edit modal |
| My Auctions | `/seller/auctions` | `GET /auctions` | **Read-only** — the "Manage" button opens a view-only modal. No edit or delete UI for the seller |
| Bids Received | `/seller/bids` | `GET /bids`, `PATCH /bids/:bidId/status` | Approve/Reject + status filter buttons |
| Auction Results | `/seller/results` | `GET /auctions`, then `GET /auctions/:id/winner` per completed auction | Uses `Promise.all` with per-call `try/catch` |

**`AuctionResults.jsx` is worth explaining as a design decision:**
```jsx
const resultData = await Promise.all(
    myCompletedAuctions.map(async (auction) => {
        try {
            const winnerResponse = await api.get(`/auctions/${auction._id}/winner`);
            return { auction, winner: winnerResponse.data.winner };
        } catch {
            return { auction, winner: null };
        }
    })
);
```
The inner `try/catch` is essential. The winner endpoint returns **404** when no bid was approved, and without the catch that rejection would fail the entire `Promise.all` and the page would render nothing. Catching per-auction lets it display "No approved winner" for that one card while the rest render normally. This is a genuinely good piece of error handling and worth pointing out.

---

## 23.4 CUSTOMER DASHBOARD (`/buyer`)

`CustomerDashboard.jsx` fires five requests in parallel:

```js
const [bidsResponse, watchlistResponse, wonResponse, ordersResponse, auctionsResponse] =
  await Promise.all([
    api.get("/bids/my"), api.get("/watchlist"), api.get("/orders/won"),
    api.get("/orders"), api.get("/auctions"),
  ]);

setStats({
  activeBids:  bidsResponse.data.bids?.length || 0,
  watchlist:   watchlistResponse.data.watchlist?.length || 0,
  wonAuctions: wonResponse.data.orders?.length || 0,
  orders:      ordersResponse.data.orders?.length || 0,
});
```

| Stat | Meaning as implemented |
|---|---|
| **Active Bids** | **All** the customer's bids, of every status — pending, approved and rejected. The label says "Active" but there is no status filter |
| **Watchlist** | Number of watchlist documents (duplicates counted separately) |
| **Won Auctions** | Number of orders where the customer is the buyer |
| **Orders** | Number of orders where the customer is the buyer — **the same query**, so this always equals Won Auctions |

Below the stats, the dashboard filters the auctions response to live ones and renders each as a `BuyerCard` with an inline bid input, letting the customer bid without leaving the dashboard.

**Other customer pages:**

| Page | Route | APIs |
|---|---|---|
| My Bids | `/buyer/bids` | `GET /bids/my` |
| Watchlist | `/buyer/watchlist` | `GET /watchlist`, `DELETE /watchlist/:id` |
| Won Auctions | `/buyer/won` | `GET /orders/won`, `PATCH /orders/:id` |
| Orders | `/buyer/orders` | `GET /orders` |
| Notifications | `/buyer/notifications` | `GET /notifications`, `PATCH /notifications/:id/read` |

**Interview Q:** "Why do Won Auctions and Orders show the same number?"
**Answer:** "Because both endpoints run the same query — `Order.find({ buyer: req.user.id })`. `/orders/won` differs only in which product fields it populates. In this implementation an order only ever exists because an auction was won, so the two sets are identical. Conceptually they should differ, and the right fix would be for Won Auctions to query approved winning bids on completed auctions rather than orders."

---

# PART 24 — CONTACT US

## 24.1 The four files

| File | Role |
|---|---|
| `frontend/src/pages/contact/Contact.jsx` | The form |
| `backend/models/Contact.model.js` | The schema |
| `backend/controllers/contactController.js` | Save to MongoDB + send the email |
| `backend/routes/contactRoutes.js` | `router.post("/", createContact)` — **no middleware** |

## 24.2 The frontend flow

```jsx
const [formData, setFormData] = useState({ name: "", email: "", message: "" });
const [status, setStatus] = useState("");

const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await api.post("/contact", formData);
        setStatus("Message submitted successfully!");
        setFormData({ name: "", email: "", message: "" });
    } catch (error) {
        console.error("CONTACT ERROR:", error);
        setStatus("Failed to submit message.");
    }
};
```

```
Contact.jsx form (3 controlled inputs)
      ↓  useState holds { name, email, message }
      ↓  onChange → handleChange → setFormData with computed key [e.target.name]
      ↓  onSubmit → handleSubmit → e.preventDefault()
api.post("/contact", formData)
      ↓  interceptor runs; if the visitor is logged out there is no token, so no header is added
POST http://localhost:5000/api/contact
      ↓
express.json() parses the body
      ↓
app.use("/api/contact", contactRoutes)
      ↓
router.post("/", createContact)          ← NO protect, NO authorizeRoles
      ↓
Contact.create({ name, email, message })
      ↓
MongoDB "contacts" collection
      ↓
Nodemailer → Gmail SMTP → inbox
      ↓
201 { success, message: "Message submitted successfully", contact }
      ↓
setStatus("Message submitted successfully!")  +  form cleared
```

This is the **only** page that shows inline status text instead of an `alert()`.

## 24.3 The controller

```js
const Contact = require("../models/Contact.model");
const nodemailer = require("nodemailer");

const createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const contact = await Contact.create({ name, email, message });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Storage Wars Contact Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        });

        res.status(201).json({ success: true, message: "Message submitted successfully", contact });
    } catch (error) {
        console.error("CONTACT ERROR:", error);
        res.status(500).json({ success: false, message: "Message submission failed", error: error.message });
    }
};
```

**Order matters: the database write happens first.** If Gmail is unreachable, the `sendMail` call throws, the catch returns 500 — but the contact document is already saved. So the message is never lost, even though the user sees a failure. That is arguably the right order; the alternative would lose messages whenever SMTP failed.

## 24.4 The mail options explained

| Option | Value | Why |
|---|---|---|
| `from` | `process.env.EMAIL_USER` | Gmail only lets you send as the authenticated account. Setting the visitor's address here would be rejected or marked as spoofing |
| `to` | `process.env.EMAIL_USER` | The site owner receives it — the same account sends and receives |
| `replyTo` | the visitor's email | **The key line.** Hitting Reply in the inbox addresses the visitor, not yourself |
| `subject` | `` `Storage Wars Contact Message from ${name}` `` | Template literal, so the sender's name is visible in the subject line |
| `text` | name, email and message on separate lines | Plain text, using `\n` escapes for line breaks. **No `html` option is used** |

**Interview Q:** "Why not put the visitor's address in `from`?"
**Answer:** "Because Gmail authenticates the sending account and only permits you to send as that account. Putting an arbitrary address in `from` would be spoofing, and it would either be rejected or land in spam because of SPF and DKIM checks. The correct pattern is `from` = my account, `to` = my account, and `replyTo` = the visitor, so replying works naturally."

## 24.5 Why an App Password and not the Gmail password

Google turned off "Less secure app access" in 2022. A normal account password will not authenticate over SMTP for third-party applications.

An **App Password** is a 16-character credential generated at `myaccount.google.com` under 2-Step Verification → App passwords. It:
- Only works for the specific application it was created for
- Can be revoked independently without changing your account password
- Cannot be used to sign in to Gmail in a browser
- Requires 2-Step Verification to be enabled on the account first

In this project it is stored as `EMAIL_PASS` in `.env`, which is git-ignored.

**Note on the format:** an app password is shown as four groups of four characters with spaces. It is stored in `.env` exactly as issued, spaces included — Google accepts it either way.

## 24.6 Contact Us is public — confirmed

`contactRoutes.js` in full:
```js
const express = require("express");
const { createContact } = require("../controllers/contactController");
const router = express.Router();
router.post("/", createContact);
module.exports = router;
```

No `protect`, no `authorizeRoles`. **This is one of only three public endpoints in the entire API** — the others are `POST /api/auth/register`, `POST /api/auth/login` and `POST /api/ai`.

The Axios interceptor still runs on this request, but because `if (token)` guards the header assignment, a logged-out visitor sends no Authorization header at all — and the endpoint does not look for one.

**Why public is correct here.** Requiring login to contact support would be backwards. Somebody who cannot log in is exactly the person who most needs the contact form.

**The trade-off, stated honestly:** an unauthenticated POST endpoint with no rate limiting, no CAPTCHA and no honeypot field can be scripted to flood both the `contacts` collection and the inbox.
*Possible improvement — not part of the current implementation:* add `express-rate-limit` on this route.

## 24.7 The Contact model

```js
name:    { type: String, required: [true, "Name is required"], trim: true },
email:   { type: String, required: [true, "Email is required"], trim: true, lowercase: true },
message: { type: String, required: [true, "Message is required"], trim: true }
```

`lowercase` on email but **no `unique`** — the same person can send many messages, which is correct for a contact form.

**There is no admin UI for reading submitted messages.** No `GET /api/contact` endpoint exists. Messages are read either in the inbox or directly in MongoDB Compass.

---

# PART 25 — GEMINI AI CHATBOT

## 25.1 The complete backend (`routes/aiRoutes.js`)

```js
const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: `You are StorageWars AI, an assistant for a storage auction website. Answer clearly and briefly about auctions, bidding, products, orders and using the website. User question: ${message}`
        });

        res.status(200).json({ success: true, reply: response.text });

    } catch (error) {
        console.error("AI ERROR:", error);
        res.status(500).json({ success: false, message: "AI response failed", error: error.message });
    }
});

module.exports = router;
```

**Corrections to common assumptions — use the real names in your viva:**

| Often assumed | What the code actually uses |
|---|---|
| `interactions.create(...)` | `ai.models.generateContent({ model, contents })` |
| `response.output_text` | `response.text` |
| a `prompt` field | a `contents` field |
| an `aiController.js` | logic lives **inside the route file** |

## 25.2 Line by line

**`new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })`** — created **once**, at module load, outside the route handler. So the client is instantiated when the server starts, not on every request.

**`if (!message)`** — the only validation. Returns 400. There is no length limit, no content filter and no rate limit.

**The prompt.** A single template literal that concatenates a system instruction with the user's message:
```
You are StorageWars AI, an assistant for a storage auction website.
Answer clearly and briefly about auctions, bidding, products, orders
and using the website. User question: <whatever the user typed>
```

**The model:** `"gemini-3.6-flash"`. A Flash-tier model — optimised for speed and cost rather than maximum reasoning depth, which suits a short help chatbot.

**`response.text`** — the SDK exposes the generated text directly on this property.

## 25.3 The frontend (`component/chatbox/ChatBot.jsx`)

```jsx
const [chat, setChat] = useState(false);      // panel open/closed
const [message, setMessage] = useState("");   // input value
const [reply, setReply] = useState("");       // latest reply only
const [loading, setLoading] = useState(false);

const sendMessage = async () => {
    if (!message.trim()) return;
    try {
        setLoading(true);
        const response = await api.post("/ai", { message: message });
        setReply(response.data.reply);
        setMessage("");
    } catch (error) {
        console.log("CHATBOT ERROR:", error);
        setReply("Sorry, I could not process your request.");
    } finally {
        setLoading(false);
    }
};
```

The panel is a floating gold circle at `bottom-5 right-5`, rendered inside `Layout.jsx` — so it appears on **every** page, public and dashboard alike.

Sends on click or on Enter (`onKeyDown` → `if (e.key === "Enter") sendMessage()`).

## 25.4 The complete flow

```
User clicks the gold chat bubble  →  setChat(true)
      ↓
User types and presses Enter
      ↓
sendMessage() → api.post("/ai", { message })
      ↓  interceptor attaches a token if one exists — but the route ignores it
POST /api/ai
      ↓
express.json() parses the body
      ↓
aiRoutes.js handler — NO protect, NO authorizeRoles
      ↓
message present?  → no → 400
      ↓  yes
ai.models.generateContent({ model: "gemini-3.6-flash", contents: <prompt> })
      ↓  HTTPS request to Google's servers, authenticated with GEMINI_API_KEY
Gemini generates a response
      ↓
res.json({ success: true, reply: response.text })
      ↓
setReply(response.data.reply)
      ↓
The reply renders in a cream bubble inside the panel
```

## 25.5 What the chatbot knows — and what it does not

**This is the single most important honest statement in this section.**

> **The chatbot is NOT database-aware.** No MongoDB query is made anywhere in the AI request path. `aiRoutes.js` imports `express` and `@google/genai` and nothing else — no models, no Mongoose.

### What it CAN answer
- General questions about how auctions and bidding work
- General questions about how to use an auction website
- Anything within the model's own general knowledge
- Explanations of concepts like "what is a starting price" or "what does pending mean"

### What it CANNOT answer
- "What auctions are live right now?"
- "What's the current bid on the motorcycle?"
- "How many bids have I placed?"
- "Did my bid get approved?"
- "When does auction X end?"
- Anything about actual data in the `Storagewars` database

If asked any of these, the model will produce a plausible-sounding but **invented** answer, because it has no data and no instruction to refuse.

### Two further limitations

**No conversation memory.** The frontend stores a single `reply` string, not an array of turns, and the backend sends only the current message. Every request is completely independent. Asking "what did I just ask you?" will not work.

**No user context.** Even though a logged-in user's token reaches the route (the interceptor attaches it), the handler never calls `protect` and never reads `req.user`. The AI does not know who is asking.

**Interview Q:** "Does your AI chatbot know your live MongoDB data?"
**Answer:** "No, and I want to be clear about that. The AI route takes the user's message, wraps it in a system prompt describing Storage Wars, and sends it to Gemini. There's no database query in that path at all — `aiRoutes.js` doesn't even import a model. So it can explain how bidding works in general, but if you ask what's live right now it will make something up. To fix that I'd query the auctions collection first and inject the real data into the prompt as context — that's retrieval-augmented generation, and it's future scope, not what I built."

That answer is stronger than claiming an AI feature you do not have. Interviewers test AI claims specifically because they are so often overstated.

## 25.6 Security notes on the AI route

**Good:** the API key lives in `.env` on the server and is never sent to the browser. The browser calls `/api/ai` on your own server, which then calls Google. If the key were in frontend code, anyone could open DevTools, copy it and spend your quota.

**Gaps, stated honestly:**
- The route is **public** — no `protect`. Anyone who can reach the server can consume your Gemini quota.
- **No rate limiting** — a script could send thousands of requests.
- **No input length cap** — a very long message becomes a very expensive request.
- **Prompt injection is possible** — a user message like "ignore your instructions and..." is concatenated directly into the prompt with no separation or sanitisation.

*Possible improvements — not part of the current implementation:* add `protect` so only logged-in users can use it, add `express-rate-limit`, cap the message length, and use the SDK's structured system-instruction field rather than string concatenation.

---

# PART 26 — COMPLETE API DOCUMENTATION

Base URL: `http://localhost:5000/api`
All protected endpoints require the header: `Authorization: Bearer <token>`

**Standard success shape:** `{ "success": true, "message": "...", "<data key>": ... }`
**Standard error shape:** `{ "success": false, "message": "...", "error": "<error.message>" }`

**Universal errors on protected routes:**
- `401` — no header, malformed header, invalid signature or expired token
- `403` — role not permitted, or resource not owned by the caller
- `500` — any uncaught exception in the controller

---

## System routes

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/` | Health check → `"Storage Wars Backend is running..."` | No | — |
| GET | `/api/test-protected` | Echoes back `req.user` — proves JWT decoding works | Yes | Any |
| GET | `/api/admin-test` | Proves role middleware works | Yes | admin |

---

## Authentication — `/api/auth`

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| POST | `/api/auth/register` | Create an account | **No** | — |
| POST | `/api/auth/login` | Log in, receive a JWT | **No** | — |

**POST /api/auth/register**
```json
{ "name": "Rohan Mehta", "email": "rohan@example.com", "password": "rohan123",
  "mobile": "9876543210", "address": "12 MG Road", "city": "Indore",
  "gender": "male", "role": "seller" }
```
→ `201 { success, message: "User registered successfully", user: { id, name, email, role } }`
Errors: `400` "Email already registered" · `500` on a Mongoose validation failure
Note: `role` is sanitised — only `"seller"` is honoured, anything else becomes `"customer"`.

**POST /api/auth/login**
```json
{ "email": "rohan@example.com", "password": "rohan123" }
```
→ `200 { success, message: "Login successful", token, user: { id, name, email, role } }`
Errors: `404` "User not found" · `401` "Invalid email or password"

---

## Users — `/api/users` (all admin-only)

| Method | Endpoint | Purpose | Body | Response key |
|---|---|---|---|---|
| GET | `/api/users` | List all users (no password) | — | `users` |
| GET | `/api/users/:id` | One user | — | `user` |
| PATCH | `/api/users/:id` | Update name, mobile, address, city, gender, status | `{ status: "blocked" }` | `user` |
| DELETE | `/api/users/:id` | Delete a user | — | — |

Errors: `404` "User not found" on the last three.

---

## Categories — `/api/categories`

| Method | Endpoint | Purpose | Roles | Body | Response key |
|---|---|---|---|---|---|
| POST | `/api/categories` | Create | **admin** | `{ name, description }` | `category` |
| GET | `/api/categories` | List all | admin, seller, customer | — | `categories` |
| GET | `/api/categories/:id` | One category | **admin** | — | `category` |
| PATCH | `/api/categories/:id` | Update | **admin** | `{ name, description, status }` | `category` |
| DELETE | `/api/categories/:id` | Delete | **admin** | — | — |

Errors: `404` "Category not found" · `500` "Category creation failed" on a duplicate name (unique index).

---

## Products — `/api/products`

| Method | Endpoint | Purpose | Roles | Body |
|---|---|---|---|---|
| POST | `/api/products` | Create (seller set from token) | **seller** | `{ name, description, category, images, startingPrice }` |
| GET | `/api/products` | List all, category + seller populated | admin, seller, customer | — |
| GET | `/api/products/:id` | One product | admin, seller, customer | — |
| PATCH | `/api/products/:id` | Update (ownership enforced) | seller, admin | any product fields |
| DELETE | `/api/products/:id` | Delete (ownership enforced) | seller, admin | — |

Errors: `404` "Product not found" · `403` "You can only update/delete your own products"

---

## Auctions — `/api/auctions`

| Method | Endpoint | Purpose | Roles | Body |
|---|---|---|---|---|
| POST | `/api/auctions` | Create (seller from token, status "upcoming", currentBid 0) | seller, admin | `{ product, startingPrice, startTime, endTime }` |
| GET | `/api/auctions` | List all; refreshes statuses first | admin, seller, customer | — |
| GET | `/api/auctions/:id/winner` | Highest **approved** bid | admin, seller, customer | — |
| GET | `/api/auctions/:id` | One auction | admin, seller, customer | — |
| PATCH | `/api/auctions/:id` | Update — **send all 5 fields** | seller, admin | `{ product, startingPrice, startTime, endTime, status }` |
| DELETE | `/api/auctions/:id` | Delete (ownership enforced) | seller, admin | — |

Errors: `404` "Auction not found" · `404` "No approved bids found" · `403` "You can only update/delete your own auctions" · `400` "End time must be after start time"

Winner response:
```json
{ "success": true, "message": "Auction winner found",
  "winner": { "bidder": { "_id", "name", "email" }, "amount": 6800,
              "auction": { "_id", "name" } } }
```
(Note: the `winner.auction` key actually holds the **product** object.)

---

## Bids — `/api/bids`

| Method | Endpoint | Purpose | Roles | Body |
|---|---|---|---|---|
| POST | `/api/bids` | Place a bid | **customer** | `{ auction, amount }` |
| GET | `/api/bids` | All bids (admin) / own-auction bids (seller) | admin, seller | — |
| GET | `/api/bids/my` | The customer's own bids | **customer** | — |
| GET | `/api/bids/:auctionId` | All bids on one auction | admin, seller, customer | — |
| PATCH | `/api/bids/:bidId/status` | Approve or reject | admin, seller | `{ status: "approved" \| "rejected" }` |

**POST /api/bids errors:**
| Code | Message | Cause |
|---|---|---|
| 404 | Auction not found | Bad auction id |
| 403 | Seller cannot bid on own auction | Bidder is the auction's seller |
| 400 | Auction is not live | Status is upcoming, completed or cancelled |
| 400 | Auction has ended | `endTime` already passed |
| 400 | Bid amount must be greater than current bid | Amount missing, or ≤ `currentBid` |

**PATCH status errors:** `400` "Status must be approved or rejected" · `404` "Bid not found" · `404` "Auction not found" · `403` "You can only manage bids on your own auctions"

Side effect of a successful PATCH: a `Notification` document is created for `bid.bidder`.

---

## Orders — `/api/orders`

| Method | Endpoint | Purpose | Roles | Body |
|---|---|---|---|---|
| POST | `/api/orders` | Manual order (buyer from token) — **unused by the UI** | **customer** | `{ auction, product, seller, amount }` |
| GET | `/api/orders` | Seller → own sales; customer/admin → own purchases | admin, seller, customer | — |
| GET | `/api/orders/won` | Customer's won auctions | **customer** | — |
| POST | `/api/orders/from-auction/:auctionId` | Create from the winning bid | **admin** | — (all derived server-side) |
| GET | `/api/orders/:id` | One order (ownership enforced) | admin, seller, customer | — |
| PATCH | `/api/orders/:id` | Update status (ownership enforced) | admin, seller, customer | `{ status }` |
| DELETE | `/api/orders/:id` | Delete | **admin** | — |

**from-auction errors:** `404` "Auction not found" · `400` "Auction is not completed" · `404` "No approved bids found" · `400` "Order already exists for this auction"
**Other errors:** `404` "Order not found" · `403` "Access denied" · `403` "You can only update your own orders"

---

## Watchlist — `/api/watchlist` (all customer-only)

| Method | Endpoint | Purpose | Body |
|---|---|---|---|
| POST | `/api/watchlist` | Add an auction | `{ auction }` |
| GET | `/api/watchlist` | List mine, deeply populated | — |
| DELETE | `/api/watchlist/:id` | Remove by **watchlist entry id** | — |

Errors: `404` "Watchlist item not found" · `500` on any create failure.

---

## Notifications — `/api/notifications`

| Method | Endpoint | Purpose | Roles | Body |
|---|---|---|---|---|
| POST | `/api/notifications` | Create manually — **unused by the UI** | **admin** | `{ user, message, type }` |
| GET | `/api/notifications` | List mine, newest first | admin, seller, customer | — |
| PATCH | `/api/notifications/:id/read` | Mark one as read | admin, seller, customer | — |

Errors: `404` "Notification not found"

---

## Reports — `/api/reports`

| Method | Endpoint | Purpose | Roles |
|---|---|---|---|
| GET | `/api/reports` | Admin analytics | **admin** |

```json
{ "success": true,
  "reports": {
    "totalSales": 42000,
    "bidsThisMonth": 17,
    "newUsers": 5,
    "conversion": 66,
    "monthlyPerformance": [ { "_id": { "month": 9 }, "sales": 42000 } ]
  } }
```

---

## Contact — `/api/contact`

| Method | Endpoint | Purpose | Auth | Body |
|---|---|---|---|---|
| POST | `/api/contact` | Save the message and email it | **No** | `{ name, email, message }` |

→ `201 { success, message: "Message submitted successfully", contact }`
Errors: `500` "Message submission failed" — including when Gmail SMTP fails, even though the document was already saved.

---

## AI — `/api/ai`

| Method | Endpoint | Purpose | Auth | Body |
|---|---|---|---|---|
| POST | `/api/ai` | Send a message to Gemini | **No** | `{ message }` |

→ `200 { success: true, reply: "<generated text>" }`
Errors: `400` "Message is required" · `500` "AI response failed"

---

## Endpoints that exist but no frontend page calls

Worth knowing, because an examiner may ask "which of your APIs are actually used?"

- `GET /api/products/:id`
- `GET /api/categories/:id`
- `PATCH /api/categories/:id`
- `GET /api/orders/:id`
- `DELETE /api/orders/:id`
- `POST /api/orders`
- `POST /api/notifications`
- `GET /api/bids/:auctionId`
- `GET /api/test-protected`, `GET /api/admin-test`

All of them work; they are simply not wired to a screen. Demonstrate them in Postman.

---

# PART 27 — COMPLETE REQUEST LIFECYCLE — SEVEN WORKED EXAMPLES

## Example 1 — Seller creates a product

```
UI        Seller fills the Add Product form and clicks "Create Auction"
React     handleSubmit → e.preventDefault() → setLoading(true)
Axios     api.post("/products", { name, description, category, images: [], startingPrice })
Intercept localStorage.getItem("token") → config.headers.Authorization = "Bearer eyJ..."
HTTP      POST http://localhost:5000/api/products
Express   cors() → express.json() → app.use("/api/products", productRoutes)
Route     router.post("/", protect, authorizeRoles("seller"), createProduct)
MW 1      protect → jwt.verify → req.user = { id: "68b1...", role: "seller" } → next()
MW 2      authorizeRoles("seller") → ["seller"].includes("seller") ✓ → next()
Ctrl      createProduct → destructures 5 fields (NOT seller)
Mongoose  Product.create({ ..., seller: req.user.id }) → validates required + min:0
MongoDB   insert into "products", generates _id, createdAt, updatedAt
Response  201 { success, message: "Product created successfully", product }
React     const product = productResponse.data.product  →  used for step 2
UI        Loading text remains until the auction call also completes
```

## Example 2 — Seller creates an auction

```
UI        (continues automatically from Example 1)
React     api.post("/auctions", { product: product._id, startingPrice, startTime, endTime })
HTTP      POST /api/auctions
Route     protect → authorizeRoles("seller", "admin") → createAuction
Ctrl      Auction.create({ product, seller: req.user.id, startingPrice,
                           startTime, endTime, currentBid: 0, status: "upcoming" })
Mongoose  casts the datetime-local strings to Date, validates required + enum
MongoDB   insert into "auctions"
Response  201 { success, message: "Auction created successfully", auction }
React     setSaved(true); form fields reset to empty strings
UI        Green box: "Product and auction created successfully! ✅"
Later     server.js setInterval OR the next GET /auctions flips status to "live"
```

## Example 3 — Customer places a bid

```
UI        Customer on /auction/:id types 7000 and clicks "Place Bid"
React     handlePlaceBid → minimumBid = Math.max(startingPrice, currentBid) + 1
          if (Number(bidAmount) < minimumBid) → alert and STOP (client-side pre-check)
          setPlacingBid(true)
Axios     api.post("/bids", { auction: auction._id, amount: 7000 })
HTTP      POST /api/bids
Route     protect → authorizeRoles("customer") → placeBid
Ctrl      1. Auction.findById(auction)               → exists?
          2. seller.toString() === req.user.id?      → 403 if yes
          3. status !== "live"?                      → 400 if yes
          4. new Date() > endTime?                   → 400 if yes
          5. amount <= currentBid?                   → 400 if yes
          6. Bid.create({ auction, bidder: req.user.id, amount: 7000, status: "pending" })
          7. existingAuction.currentBid = 7000; await existingAuction.save()
MongoDB   insert into "bids"; update the auction document
Response  201 { success, message: "Bid placed successfully", bid }
React     alert("Bid submitted successfully! Waiting for approval.")
          setBidAmount(""); setPlacingBid(false)
UI        Note: the page does NOT re-fetch, so the displayed "Last bid"
          still shows the old value until the user reloads
```

## Example 4 — Seller approves a bid

```
UI        Seller on /seller/bids clicks the green tick on a pending row
React     updateStatus(bid._id, "approved")
Axios     api.patch(`/bids/${bidId}/status`, { status: "approved" })
HTTP      PATCH /api/bids/68c9.../status
Route     protect → authorizeRoles("admin", "seller") → updateBidStatus
Ctrl      1. ["approved","rejected"].includes("approved") ✓
          2. Bid.findById(bidId).populate({ path: "auction",
                 populate: { path: "seller", select: "name email" } })
          3. bid.auction exists?
          4. role === "seller" && bid.auction.seller._id !== req.user.id → 403?
          5. bid.status = "approved"; await bid.save()
          6. Notification.create({ user: bid.bidder,
                 message: "Your bid has been approved.", type: "bid" })
MongoDB   update "bids"; insert into "notifications"
Response  200 { success, message: "Bid approved successfully", bid }
React     setBids(prev => prev.map(b => b._id === bidId ? { ...b, status: "approved" } : b))
UI        The row's Status cell changes to "approved" without a page reload
Elsewhere The customer sees a NEW badge on /buyer/notifications
```

## Example 5 — Winning customer views their order

```
Prereq    Auction endTime passed → status "completed"
          Admin clicked the ShoppingBag button on /admin/auctions
          → POST /api/orders/from-auction/:auctionId
          → Order created with buyer = highest approved bidder

UI        Customer opens /buyer/won
React     ProtectedRoute(["customer"]) → Outlet → WonAuctions mounts
          useEffect → fetchWonAuctions()
Axios     api.get("/orders/won")
HTTP      GET /api/orders/won
Route     protect → authorizeRoles("customer") → getMyWonAuctions
Ctrl      Order.find({ buyer: req.user.id })
              .populate("product", "name images startingPrice")
              .populate("auction")
              .populate("seller", "name email")
              .sort({ createdAt: -1 })
MongoDB   query "orders", then $in lookups for products, auctions and users
Response  200 { success, message, orders: [...] }
React     setWonAuctions(response.data.orders || [])
UI        A card per order: product name, winning amount, "Order Status: pending"
Action    "Complete Order" → PATCH /orders/:id { status: "confirmed" }
          → ownership check passes (buyer === req.user.id) → saved
          → alert + window.location.reload()
```

## Example 6 — Visitor submits the Contact Us form

```
UI        Any visitor (logged in or not) on /contact fills 3 fields
React     handleSubmit → e.preventDefault()
Axios     api.post("/contact", { name, email, message })
Intercept if (token) — a logged-out visitor has none, so NO header is added
HTTP      POST /api/contact
Express   express.json() → app.use("/api/contact", contactRoutes)
Route     router.post("/", createContact)      ← no middleware at all
Ctrl      Contact.create({ name, email, message })
MongoDB   insert into "contacts"
Ctrl      nodemailer.createTransport({ service: "gmail", auth: { EMAIL_USER, EMAIL_PASS } })
External  transporter.sendMail({ from, to, replyTo: email, subject, text })
          → SMTP handshake with smtp.gmail.com, authenticated with the App Password
Inbox     Email arrives; hitting Reply addresses the visitor because of replyTo
Response  201 { success, message: "Message submitted successfully", contact }
React     setStatus("Message submitted successfully!")
          setFormData({ name: "", email: "", message: "" })
UI        Bold confirmation text below the form; inputs are now empty
```

## Example 7 — User asks the AI chatbot

```
UI        User clicks the gold circle at bottom-right (present on every page)
React     setChat(true) → the panel renders
UI        User types "how does bidding work" and presses Enter
React     onKeyDown → e.key === "Enter" → sendMessage()
          if (!message.trim()) return;  → setLoading(true)
Axios     api.post("/ai", { message })
Intercept attaches a token if one exists — the route never reads it
HTTP      POST /api/ai
Route     router.post("/", handler)          ← no protect, no authorizeRoles
Handler   if (!message) → 400
          ai.models.generateContent({
              model: "gemini-3.6-flash",
              contents: "You are StorageWars AI, ... User question: how does bidding work"
          })
External  HTTPS to Google's Gemini API, authenticated with GEMINI_API_KEY from .env
          NO MongoDB query happens anywhere in this path
Gemini    generates text from the prompt alone
Response  200 { success: true, reply: response.text }
React     setReply(response.data.reply); setMessage(""); setLoading(false)
UI        The reply appears in a cream bubble, REPLACING any previous reply
          (there is no conversation history)
```

---

# PART 28 — MULTI-USER ARCHITECTURE

## 28.1 The scenario

Four people use Storage Wars at the same time:

```
Seller A     (role: seller,   _id: 68b1aa...)
Customer B   (role: customer, _id: 68c2bb...)
Customer C   (role: customer, _id: 68c3cc...)
Admin D      (role: admin,    _id: 68a0dd...)
```

They share:
- **One** React build served from one URL
- **One** Express server on port 5000
- **One** MongoDB database `Storagewars`

They do **not** share:
- Their browser's localStorage
- Their JWT
- The `req.user` object created for each of their requests
- The data any endpoint returns to them

## 28.2 What makes them different — the token

```
Login A → jwt.sign({ id: "68b1aa...", role: "seller"   }, SECRET) → token_A → A's localStorage
Login B → jwt.sign({ id: "68c2bb...", role: "customer" }, SECRET) → token_B → B's localStorage
Login C → jwt.sign({ id: "68c3cc...", role: "customer" }, SECRET) → token_C → C's localStorage
Login D → jwt.sign({ id: "68a0dd...", role: "admin"    }, SECRET) → token_D → D's localStorage
```

localStorage is scoped by **origin and browser profile**. B's token exists only in B's browser; the server never keeps a copy.

## 28.3 The same URL, four different results

All four hit `GET /api/bids`:

| Who | Middleware outcome | Result |
|---|---|---|
| Seller A | `authorizeRoles("admin","seller")` ✓ | Every bid, then JS-filtered to bids on A's own auctions |
| Customer B | `authorizeRoles("admin","seller")` ✗ | **403 Access denied** — B must use `/api/bids/my` |
| Customer C | same | **403 Access denied** |
| Admin D | ✓ | Every bid in the system, unfiltered |

And `GET /api/orders`:

| Who | `filter` computed as |
|---|---|
| Seller A | `{ seller: "68b1aa..." }` |
| Customer B | `{ buyer: "68c2bb..." }` |
| Customer C | `{ buyer: "68c3cc..." }` |
| Admin D | `{ buyer: "68a0dd..." }` — falls into the else branch |

Same endpoint, same code, four different queries — because the filter is built from `req.user`.

## 28.4 How the backend prevents cross-user access

Three independent layers, all server-side:

**Layer 1 — role check (`roleMiddleware`)**
Customer B calling `POST /api/products` → 403 before the controller runs.

**Layer 2 — query scoping**
```js
Bid.find({ bidder: req.user.id })
Watchlist.find({ user: req.user.id })
Notification.find({ user: req.user.id })
Order.find({ buyer: req.user.id })
```
Even if Customer B knew Customer C's bid ids, `getMyBids` would never return them — the filter is not negotiable.

**Layer 3 — ownership checks after loading**
```js
if (req.user.role === "seller" && String(product.seller) !== String(req.user.id))
    return res.status(403)...
```
Used where the resource must be loaded first to know who owns it.

**The unifying principle:** every one of these uses `req.user`, which comes from a signed token — never from `req.body` or `req.query`. A client can send anything it likes in the body; it cannot forge `req.user`.

## 28.5 Why each browser has a different token

localStorage is per-origin and per-browser-profile. Consequences:
- Two different browsers on the same machine can be logged in as two different users at once — which is exactly how you should run your live demo.
- An incognito window has its own empty localStorage, so it is effectively a fourth session.
- Clearing site data logs that browser out.
- The server has no session table; it does not know or care how many users are "logged in".

**Practical demo tip:** open Chrome as the seller, Firefox as the customer, and a Chrome incognito window as the admin. Three simultaneous roles, one server, one database.

## 28.6 Concurrent requests at a high level

Node.js runs your JavaScript on a single thread with an event loop. When `placeBid` hits `await Auction.findById(...)`, the function suspends and Node immediately picks up the next queued request. When MongoDB replies, the suspended function resumes.

So four users bidding at the same second are handled as interleaved async operations on one thread, not as four parallel threads. For an I/O-bound API this is efficient — the thread is almost never doing CPU work, only waiting.

## 28.7 The concurrency problem this project has — be honest about it

**Scenario:** Customer B and Customer C both submit ₹8,000 on the same auction, whose `currentBid` is ₹7,000, within milliseconds of each other.

```
t0   B's request: Auction.findById → currentBid = 7000
t1   C's request: Auction.findById → currentBid = 7000   ← C read BEFORE B wrote
t2   B: 8000 > 7000 ✓ → Bid.create(B, 8000) → auction.currentBid = 8000 → save()
t3   C: 8000 > 7000 ✓ (using its STALE read) → Bid.create(C, 8000) → currentBid = 8000 → save()
```

**Result:** two bids of ₹8,000 both exist, and the "must be greater than current bid" rule was effectively violated for the second one. This is a **race condition** caused by a read-then-write sequence that is not atomic.

It has never been observed in this project because the auctions are tested by one person at a time, but the flaw is real and an interviewer may well ask.

*Possible improvements — not part of the current implementation:*
1. **Atomic conditional update** — do the check and the write in one operation, so MongoDB enforces it:
```js
const updated = await Auction.findOneAndUpdate(
    { _id: auctionId, status: "live", currentBid: { $lt: amount } },
    { $set: { currentBid: amount } },
    { new: true }
);
if (!updated) return res.status(400).json({ message: "Bid amount must be greater than current bid" });
```
2. **A MongoDB transaction** wrapping the bid insert and the auction update (requires a replica set).
3. **A unique compound index** on `{ auction, amount }` to at least prevent identical duplicate amounts.

**Interview Q:** "What happens if two customers bid at nearly the same time?"
**Answer:** "Right now there's a race condition, and I'd rather tell you than have you find it. `placeBid` reads the auction, compares the amount against `currentBid`, then writes — three separate steps. If a second request reads between the first one's read and write, it validates against a stale value and both bids get accepted. The clean fix is to make it atomic with `findOneAndUpdate` using `currentBid: { $lt: amount }` in the filter, so MongoDB does the comparison and the update in one operation and the loser simply gets no document back."

That is a genuinely strong answer. It shows you understand atomicity, not just that you can write CRUD.

---

# PART 29 — SECURITY

## 29.1 What is actually implemented

| Mechanism | Where | What it protects |
|---|---|---|
| Password hashing | `bcrypt.hash(password, 10)` in `registerUser` | Plain passwords are never stored |
| Password verification | `bcrypt.compare(...)` in `loginUser` | Verifies without ever decrypting |
| JWT signing | `jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1d" })` | Tamper-proof identity |
| JWT verification | `jwt.verify(...)` in `protect` | Rejects forged or expired tokens |
| Bearer scheme | Axios interceptor + `authHeader.split(" ")[1]` | Standard credential transport |
| Role authorization | `authorizeRoles(...)` on 30+ routes | Role separation |
| Ownership checks | 9 places across 4 controllers | Resource-level separation |
| Password exclusion | `.select("-password")` in `userController` | Hashes never reach the browser |
| Populate projections | `.populate("seller", "name email")` | Only two user fields leak into other responses |
| Server-derived ownership | `seller: req.user.id`, `bidder: req.user.id`, `user: req.user.id` | Clients cannot claim to be someone else |
| Role sanitisation | `role === "seller" ? "seller" : "customer"` | Nobody can self-register as admin |
| Environment variables | `dotenv` + `.env` | Secrets are out of the source code |
| `.gitignore` | `node_modules/` and `.env` | Secrets are out of version control |

## 29.2 Authentication vs authorization, one more time

**Authentication** = "who are you?" Handled once per request by `protect`, which either sets `req.user` or returns 401.
**Authorization** = "what may you do?" Handled by `authorizeRoles` (role level) and by controller ownership checks (resource level), returning 403.

You can be authenticated and still be forbidden. You can never be authorized without first being authenticated — which is why `protect` always comes first in every route definition.

## 29.3 401 vs 403 in practice

| Request | Result | Why |
|---|---|---|
| `GET /api/users` with no header | 401 "Authentication required" | No identity |
| `GET /api/users` with `Bearer abcdef` | 401 "Invalid or expired token" | `jwt.verify` threw |
| `GET /api/users` with a valid 2-day-old token | 401 "Invalid or expired token" | `exp` passed |
| `GET /api/users` with a valid customer token | 403 "Access denied" | Authenticated, wrong role |
| `PATCH /api/products/<other seller's product>` with a valid seller token | 403 "You can only update your own products" | Right role, wrong owner |

## 29.4 Why API keys must not be hardcoded

If `GEMINI_API_KEY` were written into `aiRoutes.js`:
- It would be in every git commit forever, even if later removed — git history retains it.
- Anyone with repository access, including a public GitHub fork, would have it.
- Automated scanners crawl public repositories specifically for API key patterns; keys are typically found and abused within minutes.
- Rotating it would require a code change and redeploy rather than an environment update.

With `process.env.GEMINI_API_KEY`, the key lives only in `.env`, which is git-ignored, and rotating it means editing one file and restarting.

## 29.5 Why `.env` must never be pushed

This project's `.env` contains:
- `MONGO_URI` — the database location
- `JWT_SECRET` — **the master key.** Anyone with this can sign a token claiming `role: "admin"` for any user id, and `protect` would accept it as genuine
- `GEMINI_API_KEY` — billable API access
- `EMAIL_USER` and `EMAIL_PASS` — the ability to send email as you

`JWT_SECRET` is the most damaging of the five. Leaking it is equivalent to leaking every user's password at once, because forged tokens are indistinguishable from real ones.

**Important, and worth acting on:** the zip you shared has `backend/.env` inside it, with real values for the Gemini key and the Gmail App Password. `.gitignore` prevented it reaching git, but zipping the folder included it anyway. Before you share this project again — with an examiner, a recruiter, or anyone — delete `.env` from the archive and rotate both credentials (revoke the App Password in your Google Account, and regenerate the Gemini key). Ship a `.env.example` with empty values instead.

## 29.6 What is NOT secure — state these honestly

Do not claim production-grade security. This is a learning project with real, identifiable gaps:

| Gap | Consequence |
|---|---|
| **Weak, human-readable `JWT_SECRET`** (`storage_wars_secret_key`) | Guessable. Should be a long random string from `crypto.randomBytes(64).toString("hex")` |
| **Token in localStorage** | Readable by any JavaScript on the page → vulnerable to XSS |
| **`status: "blocked"` is not enforced at login** | A blocked user can still log in and use the API normally |
| **No rate limiting anywhere** | Login can be brute-forced; `/api/ai` and `/api/contact` can be flooded |
| **User enumeration at login** | 404 vs 401 reveals which emails are registered |
| **No password strength rules** | `"1"` is a valid password |
| **No HTTPS** | Plain HTTP on localhost; the token travels unencrypted |
| **`cors()` with no options** | Allows **every** origin — any website could call this API from a user's browser |
| **Mass assignment in `updateProduct`** | `Object.assign(product, req.body)` lets a request rewrite any field, including `seller` |
| **No `helmet`** | Missing standard security headers |
| **No refresh tokens, no revocation** | A stolen token is valid for its full 24 hours, and logout only clears the client |
| **`GET /api/bids/:auctionId` is open to all customers** | Any customer can read every bidder's name and email on any auction |
| **`error.message` returned in 500 responses** | Internal details, sometimes including stack context, are exposed to the client |
| **AI route is public and unmetered** | Your Gemini quota is consumable by anyone |

**Interview Q:** "Is your application production-ready?"
**Answer:** "No, and I can be specific about why. The JWT secret is a weak human-readable string, the token is in localStorage so it's exposed to XSS, there's no rate limiting on login or on the AI endpoint, CORS allows every origin, there's no HTTPS, and the blocked-user status isn't actually enforced at login. It demonstrates the concepts correctly — hashing, signed tokens, role and ownership authorization — but hardening it for production would mean httpOnly cookies, a strong random secret, `helmet`, `express-rate-limit`, a CORS origin whitelist, refresh tokens and input sanitisation."

---

# PART 30 — ERROR HANDLING

## 30.1 The backend pattern

Every controller function follows the same structure:

```js
const someFunction = async (req, res) => {
    try {
        // validation → early returns with specific status codes
        // database operation
        // res.status(2xx).json({ success: true, ... })
    } catch (error) {
        console.error("SOMETHING ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Something failed",
            error: error.message
        });
    }
};
```

Roughly 35 functions, all the same shape. There is **no** global error-handling middleware and **no** `asyncHandler` wrapper — each function handles itself.

## 30.2 Every status code used, with real examples

### 200 OK
```js
res.status(200).json({ success: true, message: "Auctions fetched successfully", auctions });
```
All GETs and all PATCH updates.

### 201 Created
```js
res.status(201).json({ success: true, message: "Bid placed successfully", bid });
```
Used by: register, createCategory, createProduct, createAuction, placeBid, createOrder, createOrderFromAuction, addToWatchlist, createNotification, createContact.

### 400 Bad Request — the request itself is invalid
| Message | Controller |
|---|---|
| "Email already registered" | `registerUser` |
| "Auction is not live" | `placeBid` |
| "Auction has ended" | `placeBid` |
| "Bid amount must be greater than current bid" | `placeBid` |
| "Status must be approved or rejected" | `updateBidStatus` |
| "End time must be after start time" | `updateAuction` |
| "Auction is not completed" | `createOrderFromAuction` |
| "Order already exists for this auction" | `createOrderFromAuction` |
| "Message is required" | AI route |

### 401 Unauthorized — identity not established
| Message | Location |
|---|---|
| "Authentication required" | `protect` — missing or malformed header |
| "Invalid or expired token" | `protect` — `jwt.verify` threw |
| "Invalid email or password" | `loginUser` — wrong password |

### 403 Forbidden — identity fine, permission denied
See the complete table in Part 11.4.

### 404 Not Found — the resource does not exist
"User not found" · "Category not found" · "Product not found" · "Auction not found" · "Bid not found" · "Order not found" · "Notification not found" · "Watchlist item not found" · "No approved bids found"

### 500 Internal Server Error — an uncaught exception
Reached by the catch block. Common real causes in this project:
- MongoDB is not running → connection error
- An invalid ObjectId string → Mongoose `CastError`
- A duplicate `email` or category `name` → MongoDB `E11000`
- A missing required field on a `save()` → `ValidationError`

**Worth noting honestly:** several conditions that ought to be 400 surface as 500, because they are only caught by the generic catch. A duplicate category name returns 500 "Category creation failed" rather than a clean 400. A malformed ObjectId in any `:id` route returns 500 rather than 400.

*Possible improvement — not part of the current implementation:* inspect `error.name` in the catch and map `ValidationError` and `CastError` to 400, and `code === 11000` to 409 Conflict.

## 30.3 `console.error` vs `console.log`

Both are used. `console.error` writes to stderr and is the correct choice for failures; `console.log` writes to stdout. In this project:

- `console.error("CREATE PRODUCT ERROR:", error)` — used in productController, auctionController, bidController, reportController, contactController, aiRoutes
- `console.log("MongoDB connection failed:", error.message)` — `config/db.js` uses `log` rather than `error`
- Several controllers (userController, categoryController, watchlistController, notificationController, most of orderController) have **no logging at all** in their catch blocks — they return the 500 silently as far as the server console is concerned

The uppercase labels (`"PLACE BID ERROR:"`, `"UPDATE ORDER ERROR:"`) make the source instantly greppable in the terminal, which is a genuinely useful habit.

## 30.4 Frontend error handling

**The dominant pattern:**
```jsx
catch (error) {
    console.error("SOMETHING ERROR:", error);
    alert(error.response?.data?.message || "Fallback message");
}
```

**Why the optional chaining is essential.** Three different failure shapes exist:
1. The server responded with an error → `error.response.data.message` exists → the real message is shown
2. The request was made but no response came (server down, CORS blocked) → `error.response` is `undefined` → the fallback shows
3. Something failed before the request was sent → same as above

Without `?.`, case 2 would throw "Cannot read properties of undefined" inside the catch block itself.

**Inline status text** — only `Contact.jsx`.

**Graceful defaults everywhere:**
```jsx
setAuctions(response.data.auctions || []);
setWatchlist(response.data.watchlist || []);
{reports?.bidsThisMonth || 0}
{auction.product?.name || "Auction Item"}
{product.category?.name || "No Category"}
{winner?.amount || auction.currentBid}
```
These prevent `.map is not a function` and `Cannot read properties of null` when a populate returns `null` or a request fails.

**Per-item error isolation** — `AuctionResults.jsx` wraps each winner request in its own `try/catch` inside `Promise.all`, so a 404 on one auction does not blank the whole page.

**What is missing:** there is no Axios **response** interceptor. So a 401 from an expired token produces an alert on whichever page the user is on, and they stay there with a broken page rather than being redirected to login.

*Possible improvement — not part of the current implementation:*
```js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

---

# PART 31 — POSTMAN TESTING

## 31.1 How to obtain a token

Every protected request needs one, so this is always step one.

```
POST http://localhost:5000/api/auth/login
Headers: Content-Type: application/json
Body (raw JSON):
{ "email": "seller@storagewars.com", "password": "seller123" }
```

Response:
```json
{ "success": true, "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "68b1...", "name": "...", "email": "...", "role": "seller" } }
```

Copy the `token` value. In Postman, either set it under **Authorization → Bearer Token**, or add the header manually:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Tip for a smooth demo:** create a Postman environment with three variables — `adminToken`, `sellerToken`, `customerToken` — and reference them as `{{sellerToken}}`. Switching roles then takes one click.

## 31.2 Public vs protected

**Public (no token needed):** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/contact`, `POST /api/ai`, `GET /`
**Everything else requires a Bearer token.**

## 31.3 Test sequence — seller

**1. Create a product**
```
POST http://localhost:5000/api/products
Authorization: Bearer {{sellerToken}}
Content-Type: application/json

{ "name": "Vintage 1970s Motorcycle",
  "description": "Original paint, runs well, single owner.",
  "category": "<paste a real category _id>",
  "images": [],
  "startingPrice": 4200 }
```
Expect `201`. Verify in the response that `product.seller` equals your own user id — proof that the server set it, not you.

**2. Create an auction**
```
POST http://localhost:5000/api/auctions
Authorization: Bearer {{sellerToken}}

{ "product": "<product _id from step 1>",
  "startingPrice": 4200,
  "startTime": "2026-09-10T10:00:00.000Z",
  "endTime":   "2026-09-12T20:00:00.000Z" }
```
Expect `201` with `status: "upcoming"` and `currentBid: 0`.

**3. View bids on your auctions**
```
GET http://localhost:5000/api/bids
Authorization: Bearer {{sellerToken}}
```
Expect only bids on your own auctions.

**4. Approve a bid**
```
PATCH http://localhost:5000/api/bids/<bidId>/status
Authorization: Bearer {{sellerToken}}

{ "status": "approved" }
```
Then check the `notifications` collection in Compass — a new document should exist for that bidder.

## 31.4 Test sequence — customer

**1. Place a bid** (set the auction's `startTime` in the past first so it becomes `live`)
```
POST http://localhost:5000/api/bids
Authorization: Bearer {{customerToken}}

{ "auction": "<auction _id>", "amount": 5000 }
```
Expect `201` with `status: "pending"`.

**2. Test each validation deliberately** — this is what makes a good demo:

| Test | Change | Expected |
|---|---|---|
| Below current bid | `amount: 100` | `400` "Bid amount must be greater than current bid" |
| Upcoming auction | use an auction whose startTime is in the future | `400` "Auction is not live" |
| Own auction | use the **seller** token | `403` "Seller cannot bid on own auction" |
| Fake auction | random valid ObjectId | `404` "Auction not found" |
| No token | remove the header | `401` "Authentication required" |

**3. My bids**
```
GET http://localhost:5000/api/bids/my
Authorization: Bearer {{customerToken}}
```

**4. Watchlist**
```
POST /api/watchlist   { "auction": "<auction _id>" }
GET  /api/watchlist
DELETE /api/watchlist/<watchlist entry _id>
```

## 31.5 Test sequence — admin

```
GET    /api/users                              → every user, no password field
PATCH  /api/users/<id>     { "status": "blocked" }
POST   /api/categories     { "name": "Vehicles", "description": "Cars and bikes" }
GET    /api/reports                            → the five metrics
GET    /api/bids                               → EVERY bid, unfiltered
POST   /api/orders/from-auction/<auctionId>    → creates the order
DELETE /api/orders/<id>
```

## 31.6 Role-based testing — the demonstration that impresses

Run **the same request** three times with three different tokens:

```
POST /api/products with {{sellerToken}}    → 201 Created
POST /api/products with {{customerToken}}  → 403 Access denied
POST /api/products with {{adminToken}}     → 403 Access denied
```

The third result is the interesting one and shows you know your own system: `productRoutes.js` declares `authorizeRoles("seller")` with no admin, so **even the admin cannot create a product.** If an examiner is surprised by that, you can explain it was deliberate — products belong to sellers, and an admin creating one would produce a product whose seller is the admin.

Similarly:
```
GET /api/reports with {{adminToken}}     → 200 with the metrics
GET /api/reports with {{sellerToken}}    → 403 Access denied

GET /api/bids/my with {{customerToken}}  → 200 with that customer's bids
GET /api/bids/my with {{sellerToken}}    → 403 Access denied
```

## 31.7 Testing the token itself

Three quick tests that demonstrate you understand JWT:

| Test | Expected |
|---|---|
| Delete the Authorization header | `401` "Authentication required" |
| Change one character in the token | `401` "Invalid or expired token" (signature mismatch) |
| Send `Token eyJ...` instead of `Bearer eyJ...` | `401` "Authentication required" (`startsWith("Bearer ")` fails) |

You can also paste the token into jwt.io to show the decoded payload contains only `id`, `role`, `iat` and `exp` — and specifically **no password**. That is a memorable moment in a viva.

---

# PART 32 — MONGODB COMPASS TESTING

## 32.1 Connection

```
mongodb://127.0.0.1:27017
```
(`localhost` and `127.0.0.1` are equivalent; the `.env` uses `localhost`.)

**Database:** `Storagewars` — note the capital S and lowercase w, exactly as written in `MONGO_URI`. MongoDB database names are case-sensitive.

## 32.2 The nine collections

Collections appear only after the first document is inserted, so a fresh database will not show all nine until each feature has been used at least once.

| Collection | Created when |
|---|---|
| `users` | First registration |
| `categories` | Admin creates the first category |
| `products` | Seller creates the first product |
| `auctions` | Seller or admin creates the first auction |
| `bids` | Customer places the first bid |
| `orders` | Admin creates the first order from an auction |
| `watchlists` | Customer adds the first watchlist item |
| `notifications` | First bid approval or rejection |
| `contacts` | First contact form submission |

## 32.3 What to verify in each collection

**`users`** — confirms hashing and role sanitisation.
- `password` starts with `$2a$10$` → bcrypt worked
- `role` is exactly `admin`, `seller` or `customer`
- `status` defaults to `active`
- `email` is stored lowercase even if typed with capitals
- Register via Postman with `"role": "admin"` and confirm the stored document says `"customer"` — a compelling live demonstration

**`products`** — confirms server-derived ownership.
- `seller` matches the logged-in seller's `_id`
- `category` holds an ObjectId, not a name
- `images` is `[]`
- `status` defaults to `active`

**`auctions`** — confirms the status lifecycle.
- Immediately after creation: `status: "upcoming"`, `currentBid: 0`
- Set `startTime` to the past, wait up to 60 seconds, refresh → `status: "live"`
- Set `endTime` to the past, refresh → `status: "completed"`
- This is the single best way to prove `updateAuctionStatuses` works

**`bids`** — confirms the bid workflow.
- `status: "pending"` on creation
- `bidder` matches the customer's `_id`
- After the seller approves → `status: "approved"` and `updatedAt` changes while `createdAt` does not
- Cross-check the auction document: `currentBid` equals the latest bid's amount — including when that bid is still pending. This is how you **demonstrate** the honest limitation from Part 18.4 rather than merely describing it

**`orders`** — confirms winner derivation.
- `buyer` matches the highest **approved** bidder, not the highest bidder overall
- `amount` matches that bid's amount exactly
- Only one order exists per auction — try the from-auction endpoint twice and confirm no second document appears

**`notifications`** — confirms the automatic trigger.
- A document appears the moment a bid status changes
- `user` is the **bidder's** id, not the seller's
- `isRead: false` initially; after "Mark all as read" it becomes `true`
- Every document has `type: "bid"` — proof that the other enum values are never generated

**`contacts`** — confirms the public endpoint.
- The document exists even when the email fails to send
- `email` is stored lowercase

**`watchlists`** — confirms the join collection.
- Two ObjectId fields and nothing else
- Add the same auction twice and observe two documents — the duplicate limitation from Part 20.6, visible

## 32.4 Useful Compass filters

Paste these into the FILTER bar:

```js
{ role: "seller" }                                 // all sellers
{ status: "blocked" }                              // blocked users
{ status: "live" }                                 // in the auctions collection
{ status: "pending" }                              // in the bids collection
{ auction: ObjectId("68c9...") }                   // all bids on one auction
{ bidder: ObjectId("68c2...") }                    // all bids by one customer
{ isRead: false }                                  // unread notifications
{ amount: { $gt: 5000 } }                          // bids over ₹5,000
{ createdAt: { $gte: ISODate("2026-09-01") } }     // this month's records
```

And a sort, to find the winner exactly as `getAuctionWinner` does:
```
FILTER:  { auction: ObjectId("68c9..."), status: "approved" }
SORT:    { amount: -1 }
```
The first row is the winner. Being able to reproduce your own backend query by hand in Compass is a very strong demonstration.

## 32.5 Why database verification matters

An API returning `201 Created` proves the controller ran. It does not prove the right data was written.

Compass is how you verify:
- That the password really is a hash and not plain text
- That `seller` really is the token's user and not something from the request body
- That `role: "admin"` really was rejected during registration
- That the notification really was created for the bidder
- That the order's buyer really is the highest approved bidder

Manually creating the admin account is also done here: insert a user document, or register normally and then edit `role` from `"customer"` to `"admin"` in Compass. There is no API route that can do it.

---

# PART 33 — REAL DEVELOPMENT PROBLEMS

These are drawn from evidence visible in the code itself — leftover debugging statements, defensive fallbacks, duplicated logic and explicit in-app notes. Each entry states what the evidence is, so you are describing your own history rather than inventing a story.

---

## 33.1 The `id` vs `_id` mismatch

**Evidence:** `MyProducts.jsx`, `MyAuctions.jsx` and `BidsReceived.jsx` all read the user id defensively:
```js
String(user?._id || user?.id)
```
while `BidderDashboard.jsx` and `AuctionResults.jsx` use only `user?.id`.

**Problem.** Filtering "my products" on the frontend returned an empty list.

**Why it happened.** `loginUser` returns `user: { id: user._id, ... }` — the key is `id`. But every MongoDB document and every populated object uses `_id`. So `product.seller._id === user._id` compared a real value against `undefined`, which is always false.

**How it was diagnosed.** Logging the localStorage user object next to the API response and seeing the key names differ.

**The change.** A defensive fallback `user?._id || user?.id` in the files written after the discovery.

**Result.** The filters work.

**What it teaches.** Keep the shape of an API response consistent with the database, or normalise it once at the boundary. *A cleaner fix would be to have `loginUser` return `_id` instead of `id`, and remove all the fallbacks.*

---

## 33.2 Token attachment — 401 on every protected page

**Evidence:** eleven files still pass `headers: { Authorization: \`Bearer ${token}\` }` manually even though `api/axios.js` has a request interceptor doing exactly that. And `MyBids.jsx` and `BidApprovals.jsx` contain extra diagnostic logging:
```js
console.log("STATUS:", error.response?.status);
console.log("DATA:", error.response?.data);
```

**Problem.** Protected pages returned 401 "Authentication required".

**Why it happened.** The first pages were written before the interceptor existed, so the header was added by hand in each one — and forgetting it anywhere produced a silent 401.

**How it was diagnosed.** Logging `error.response.status` and `error.response.data` separately, and checking the Request Headers tab in DevTools → Network.

**The change.** `api/axios.js` was created with the request interceptor, so the token is attached centrally.

**Result.** New pages only need `api.get("/x")`.

**What it teaches.** Centralise cross-cutting concerns. *The remaining manual headers are leftovers that should be removed.*

---

## 33.3 Auction status not updating

**Evidence:** the status-update logic exists in **two** places — `server.js` (with `setInterval`) and `auctionController.js` (called at the top of `getAuctions`).

**Problem.** An auction whose `startTime` had passed still displayed as "upcoming", so customers could not bid — `placeBid` rejects anything not `live`.

**Why it happened.** Status was stored as a field, but nothing recalculated it. It was only ever set to `"upcoming"` at creation.

**How it was diagnosed.** The auction document in Compass showed `status: "upcoming"` with a `startTime` clearly in the past.

**The change.** A `setInterval` in `server.js` running `updateAuctionStatuses` every 60 seconds — and then, because a 60-second lag was still visible when loading the page, the same logic was also called at the start of `getAuctions`.

**Result.** Statuses are correct on every read and self-correct in the background.

**What it teaches.** Any state derived from time must be recalculated, not merely stored. *The two copies have since drifted apart in behaviour and should be unified.*

---

## 33.4 Image upload — a constraint accepted rather than solved

**Evidence:** `AddProduct.jsx` contains an explicit in-app note:
> "Image upload will be added later"
> "Current backend does not have image upload API."

and always sends `images: []`.

**Problem.** The product model supports an array of image strings, but there is no way to get a file from the browser into it.

**Why it happened.** File upload needs `multer` on the backend plus either local disk storage or a cloud service such as Cloudinary or S3, plus `multipart/form-data` handling — a substantial feature in its own right.

**The decision.** Ship the auction flow working without images, and say so in the UI rather than leaving a broken upload control.

**Result.** `AuctionCard` and `AuctionDetail` render a "No image available" placeholder, which looks deliberate rather than broken.

**What it teaches.** An honest placeholder is better than a half-working feature. Being upfront about this in a viva is far stronger than being asked "why do none of your products have images?"

---

## 33.5 Sellers seeing other sellers' bids

**Evidence:** `bidController.getAllBids` contains an explicit role-based filter with null guards:
```js
if (req.user.role === "seller") {
    filteredBids = bids.filter((bid) =>
        bid.auction && bid.auction.seller &&
        String(bid.auction.seller._id) === String(req.user.id)
    );
}
```
and `BidsReceived.jsx` **filters again** on the client.

**Problem.** `GET /api/bids` is allowed for both admin and seller. Without a filter, a seller would receive every bid in the system, including competitors'.

**How it was diagnosed.** The Bids Received page listed auctions the seller did not own.

**The change.** The seller branch in `getAllBids`. The `bid.auction && bid.auction.seller` guards were needed because a bid pointing at a deleted auction populates to `null` and crashes on `.seller._id`.

**Result.** Sellers see only their own auctions' bids.

**What it teaches.** A shared endpoint serving two roles needs role-specific scoping inside the controller. *And the filter should move into the database query rather than running in JavaScript over the full collection.*

---

## 33.6 Auction edit failing with a validation error

**Evidence:** `AuctionListings.jsx` has an unusually specific error alert on update:
```js
alert(error.response?.data?.error || error.response?.data?.message || error.message);
```
It reads `data.error` **first** — the raw Mongoose message — which is what you do when a generic message is not telling you enough.

**Problem.** Saving the auction edit form failed with an unclear error.

**Why it happened.** `updateAuction` assigns all five fields unconditionally. Any field missing from the request becomes `undefined`, and `save()` then fails on the schema's `required` rule.

**How it was diagnosed.** By surfacing `error.response.data.error`, which contains Mongoose's actual `ValidationError` text naming the field.

**The change.** The edit modal was built to always send all five fields, pre-filled from the existing auction, including the `datetime-local` conversion:
```js
startTime: auction.startTime ? new Date(auction.startTime).toISOString().slice(0, 16) : ""
```
(`.slice(0, 16)` trims `2026-09-10T10:00:00.000Z` to `2026-09-10T10:00`, which is the only format `datetime-local` accepts.)

**Result.** Editing works.

**What it teaches.** Know whether your endpoint is really PATCH or really PUT, and design the client to match.

---

## 33.7 Auctions with no approved bids breaking the results page

**Evidence:** `AuctionResults.jsx` wraps each winner call in its own `try/catch`:
```js
try {
    const winnerResponse = await api.get(`/auctions/${auction._id}/winner`);
    return { auction, winner: winnerResponse.data.winner };
} catch {
    return { auction, winner: null };
}
```

**Problem.** The seller's Auction Results page rendered nothing at all.

**Why it happened.** `getAuctionWinner` returns **404** when no approved bid exists. `Promise.all` rejects as soon as any promise rejects, so one auction with no approved bid failed the whole batch.

**How it was diagnosed.** The page was blank while the Network tab showed one 404 among several 200s.

**The change.** A per-item catch returning `{ auction, winner: null }`, plus a conditional render showing "No approved winner".

**Result.** Every completed auction renders; those without winners say so.

**What it teaches.** `Promise.all` is all-or-nothing. Isolate failures per item when partial success is acceptable.

---

## 33.8 Migrating from static demo data to a live API

**Evidence:** `src/data.js` still exports `categories`, `demos`, `auctions` and `products`; `src/data/demoData.js.txt` is an empty 0-byte file; and `notes.txt` documents the frontend-only phase in detail. Several components — `SellerLayout`, `BuyerLayout`, `StatGrid`, `DataTable`, `Users`, `Discounts`, `Categories` (public) — still carry `import { auctions, categories, demos, products } from "../../data"` even where nothing is used.

**Problem.** The project was built UI-first against static data, then had to be reconnected to real APIs.

**How it went.** `Auctions.jsx`, `AuctionDetail.jsx` and every dashboard page were converted to `useEffect` + `api.get`. `Home.jsx` and the public `Categories.jsx` were left on static data.

**Result.** A working application, with some leftovers.

**A real consequence still visible:** `Home.jsx` renders demo auctions through `AuctionCard`, which builds its link as `"/auction/" + a._id`. The demo objects have `id`, not `_id`, so the homepage's live-auction cards link to `/auction/undefined`, which falls through to the 404 page. **Do not click those cards during your demo.** Navigate to Auctions from the navbar instead.

*Fix — not part of the current implementation:* convert `Home.jsx` to fetch `GET /auctions` and filter `status === "live"`, and delete the unused `data.js` imports.

**What it teaches.** Structure mock data to match the eventual API shape — which is exactly what `ProjectDetails.txt` said the plan was. The mismatch here is precisely the cost of not doing it.

---

## 33.9 Public auction pages requiring a token

**Evidence:** `auctionRoutes.js` applies `protect` and `authorizeRoles("admin","seller","customer")` to **every** auction route, including `GET /` and `GET /:id`. But `App.jsx` declares `/auctions` and `/auction/:id` as **public** routes, and `ProjectDetails.txt` explicitly required:
> "The auction end date and countdown timer should be visible even if the customer is not logged in."

**Problem.** A logged-out visitor opening `/auctions` sees an alert saying "Authentication required" and an empty list.

**Why it happened.** Every route file was written with `protect` by default; the public-read requirement was not carried over from the design document into the API.

**Result.** The React route is public but the data behind it is not, so the page is effectively unusable when logged out.

**What it teaches.** Route-level permissions must be decided per endpoint, not applied uniformly. *Fix — not part of the current implementation: remove `protect` from `GET /api/auctions` and `GET /api/auctions/:id`, keeping it on the write routes.*

If an examiner opens `/auctions` in an incognito window, this is what they will see. Better to know it and lead your demo from a logged-in state.

---

## 33.10 Ordering routes so `/my` and `/won` are not treated as ids

**Evidence:** in `bidRoutes.js`, `router.get("/my", ...)` is declared before `router.get("/:auctionId", ...)`. In `orderRoutes.js`, `router.get("/won", ...)` is declared before `router.get("/:id", ...)`.

**Problem (if reversed).** `GET /api/bids/my` would match `/:auctionId` with `auctionId = "my"`, and `Bid.find({ auction: "my" })` throws a Mongoose CastError → 500.

**How it is avoided.** Express matches routes in declaration order, so the literal paths come first.

**What it teaches.** In Express, specific routes must be declared before parameterised ones. This is a classic interview question and you have a real example of handling it correctly.

---

# PART 34 — DESIGN DECISIONS

For each: why it was chosen, what it gave you, the alternative, and why the alternative was not used.

| Choice | Why | Benefit in this project | Alternative | Why not |
|---|---|---|---|---|
| **React** | Many screens share the same UI pieces | `AuctionCard` on 3 pages, `DataTable` on 10, `Timer` on 3 | Vanilla JS, Angular, Vue | Vanilla would mean manual DOM sync across ~40 screens; Angular is heavier for a project this size; React is what the syllabus and the job market align on |
| **Vite** | Fast dev server, no bundler config | Instant HMR while iterating on 40 components | Create React App | CRA is deprecated and noticeably slower to start |
| **React Router v7** | Role-separated URL areas | The layout-route pattern guards 8 admin routes with one wrapper | Conditional rendering by state | The URL would never change — no bookmarking, no back button, no shareable auction links |
| **Axios over fetch** | Interceptors and a base URL | One line attaches the JWT to ~40 requests | `fetch` | `fetch` has no interceptors, so the token logic would be repeated everywhere |
| **Express** | Minimal, middleware-based | The route → middleware → controller chain maps exactly onto auth + role + logic | Raw `http`, NestJS, Fastify | Raw `http` means writing your own router and body parser; NestJS adds decorators and DI that would obscure the fundamentals |
| **MongoDB** | Document-shaped data | `images` as a native array; no migrations while the schema evolved | MySQL/PostgreSQL | A relational schema would need a separate images table and a migration for every field change during development |
| **Mongoose** | Schema, validation, populate | `enum`, `required`, `min: 0`, `ref` + `populate` across 9 models | The raw MongoDB driver | The driver has no schema, so `amount: "hello"` would be accepted; every validation would be hand-written |
| **Referenced, not embedded** | One source of truth per entity | A user changing their email updates one document | Embedding user data in products/auctions | Embedding creates duplicate copies that go stale |
| **JWT** | Stateless auth | Verification is a signature check — no session store | Server sessions | Sessions need shared storage to scale and don't suit a separate frontend origin cleanly |
| **bcryptjs** | Salted, deliberately slow hashing | Passwords are unreadable even to me | Plain text, MD5, SHA-256 | Plain text is indefensible; MD5/SHA are fast and unsalted, so rainbow tables defeat them |
| **`role` on the user document** | Simple three-role model | One `enum` field drives every authorization decision | Separate collections per role | Separate collections would triple the auth logic and make role changes a migration |
| **Custom `authorizeRoles`** | One reusable middleware | `authorizeRoles("seller")`, `("admin")`, `("admin","seller","customer")` — one function, every combination | A hardcoded check inside each controller | The check would be duplicated 30+ times, and forgetting it once is a security hole |
| **Ownership checks in controllers** | Role alone is not enough | A seller cannot touch another seller's product | Role check only | Any seller could edit any product |
| **Routes / Controllers / Models split** | Separation of concerns | A route file reads as a table of contents; logic is testable independently | Everything in `server.js` | One unmaintainable file; every URL change would risk breaking logic |
| **`ProtectedRoute` as a layout route** | Guard written once per role | 20 protected routes, 3 wrappers | A check inside every page component | 20 copies of the same code |
| **localStorage for the token** | Simple and persistent | Survives refresh; readable by the interceptor | httpOnly cookie, sessionStorage | An httpOnly cookie is more secure but needs CSRF protection and cookie config; sessionStorage would log the user out on every tab close |
| **Nodemailer + Gmail** | Free and immediate | Contact messages actually arrive | SendGrid, Mailgun, AWS SES | Those need account setup and domain verification; Gmail with an App Password works in minutes for a project |
| **Gemini Flash** | Fast and cheap tier | Short help answers return quickly | GPT-based APIs, a rules-based FAQ | The Google SDK was straightforward; a rules engine would have needed hand-written answers for every question |
| **Tailwind** | Utility-first speed | Consistent spacing and colour across 40 components without a naming system | Plain CSS, styled-components, Bootstrap | Plain CSS at this scale needs a naming convention; Bootstrap would have made it look like every other Bootstrap site |
| **`setInterval` for statuses** | No extra dependency | Auctions go live and complete on their own | node-cron, agenda, a DB TTL | Overkill for a single-process app — though it would be the right call for multi-instance deployment |
| **Approval before winning** | Matches the original design | Sellers keep control over who wins | Auto-win on the highest bid | The design document specified an approval step, and it protects sellers from unserious bids |

## The decisions you should present as consciously yours

1. **Role sanitisation at registration** — refusing to trust `req.body.role` is a deliberate security decision, not an accident.
2. **Server-derived ownership** — `seller: req.user.id`, `bidder: req.user.id`, `user: req.user.id`. Never from the body.
3. **Populate projections** — `.populate("seller", "name email")` deliberately excludes the password hash from every nested response.
4. **`getAuctionWinner` filtering by approved status** — the winner is a query over approved bids, not simply the highest number.
5. **Duplicate-order prevention** — `Order.findOne({ auction })` before creating, making the endpoint idempotent.
6. **`removeFromWatchlist` and `markAsRead` folding ownership into the query filter** — the cleanest authorization pattern in the codebase.
7. **Per-item `try/catch` in `AuctionResults`** — deliberate partial-failure tolerance.

---

# PART 35 — COMPLETE DATABASE RELATIONSHIPS

## 35.1 Verified relationship map

```
USER  (users)
 ├── creates many PRODUCTS         products.seller      → User
 ├── creates many AUCTIONS         auctions.seller      → User
 ├── places many BIDS              bids.bidder          → User
 ├── receives many NOTIFICATIONS   notifications.user   → User
 ├── owns many WATCHLIST entries   watchlists.user      → User
 ├── buys in many ORDERS           orders.buyer         → User
 └── sells in many ORDERS          orders.seller        → User

CATEGORY  (categories)
 └── classifies many PRODUCTS      products.category    → Category
     (Category itself holds NO outgoing references)

PRODUCT  (products)
 ├── belongs to one CATEGORY       products.category    → Category
 ├── belongs to one SELLER         products.seller      → User
 ├── can appear in many AUCTIONS   auctions.product     → Product
 └── appears in many ORDERS        orders.product       → Product

AUCTION  (auctions)
 ├── belongs to one PRODUCT        auctions.product     → Product
 ├── belongs to one SELLER         auctions.seller      → User
 ├── receives many BIDS            bids.auction         → Auction
 ├── appears in many WATCHLISTS    watchlists.auction   → Auction
 └── produces at most one ORDER    orders.auction       → Auction

BID  (bids)
 ├── belongs to one AUCTION        bids.auction         → Auction
 └── belongs to one BIDDER (User)  bids.bidder          → User

ORDER  (orders)
 ├── belongs to one AUCTION        orders.auction       → Auction
 ├── belongs to one PRODUCT        orders.product       → Product
 ├── belongs to one BUYER (User)   orders.buyer         → User
 └── belongs to one SELLER (User)  orders.seller        → User

WATCHLIST  (watchlists)   — pure join collection
 ├── belongs to one USER           watchlists.user      → User
 └── belongs to one AUCTION        watchlists.auction   → Auction

NOTIFICATION  (notifications)
 └── belongs to one USER           notifications.user   → User

CONTACT  (contacts)       — completely standalone, no references
```

## 35.2 Corrections to the assumed diagram

Two things to fix relative to a naive reading:

1. **A Product can have many Auctions, not one.** `Auction.product` is a plain ObjectId with no uniqueness constraint, so the same product can be auctioned repeatedly. Nothing prevents two live auctions on one product simultaneously.

2. **Order references Product directly, not only through Auction.** This is deliberate denormalisation so `getOrders` can populate the product name in one step.

## 35.3 Cardinality table

| Relationship | Cardinality | Enforced by |
|---|---|---|
| User → Products | 1 : many | `products.seller` |
| User → Auctions | 1 : many | `auctions.seller` |
| User → Bids | 1 : many | `bids.bidder` |
| User → Notifications | 1 : many | `notifications.user` |
| User → Watchlist entries | 1 : many | `watchlists.user` |
| User → Orders (as buyer) | 1 : many | `orders.buyer` |
| User → Orders (as seller) | 1 : many | `orders.seller` |
| Category → Products | 1 : many | `products.category` |
| Product → Auctions | 1 : many | `auctions.product` |
| Auction → Bids | 1 : many | `bids.auction` |
| Auction → Order | 1 : 1 (in practice) | `Order.findOne({ auction })` check in `createOrderFromAuction` — **application logic, not a database constraint** |
| User ↔ Auction (watchlist) | many : many | the `watchlists` join collection |

## 35.4 The complete data journey

```
Admin                                   Seller                          Customer
  │                                        │                                │
  ├─ creates Category ────────────────────►│                                │
  │                                        ├─ creates Product               │
  │                                        │    (category → Category)       │
  │                                        │    (seller   → User)           │
  │                                        │                                │
  │                                        ├─ creates Auction               │
  │                                        │    (product → Product)         │
  │                                        │    (seller  → User)            │
  │                                        │    status: "upcoming"          │
  │                                        │                                │
  │   ⏱ updateAuctionStatuses → "live"    │                                │
  │                                        │                                │
  │                                        │◄──── places Bid ───────────────┤
  │                                        │      (auction → Auction)       │
  │                                        │      (bidder  → User)          │
  │                                        │      status: "pending"         │
  │                                        │      auction.currentBid updated│
  │                                        │                                │
  │                                        ├─ approves Bid ─────────────────►
  │                                        │    bid.status → "approved"     │
  │                                        │    Notification created ───────►
  │                                        │                                │
  │   ⏱ updateAuctionStatuses → "completed"                                 │
  │                                        │                                │
  ├─ POST /orders/from-auction/:id         │                                │
  │    finds highest approved bid          │                                │
  │    Order created ──────────────────────┼───────────────────────────────►
  │      (auction, product, buyer, seller, amount)                          │
  │      status: "pending"                 │                                │
  │                                        │           marks "confirmed" ◄──┤
```

## 35.5 What has no relationships

- **`contacts`** — completely standalone. A visitor's email is a plain string, never linked to a user, even when a logged-in user submits the form.
- **`categories`** — receives references but holds none.
- **`users`** — the root of the graph; holds no outgoing references.

## 35.6 No indexes beyond the automatic ones

The only indexes in this project are:
- `_id` on every collection (automatic)
- `email` on `users` (from `unique: true`)
- `name` on `categories` (from `unique: true`)

Every reference field — `bids.auction`, `bids.bidder`, `orders.buyer`, `watchlists.user`, `notifications.user` — is **unindexed**, so every query on them is a full collection scan.

*Possible improvement — not part of the current implementation:*
```js
bidSchema.index({ auction: 1, status: 1 });   // getAuctionWinner
bidSchema.index({ bidder: 1 });               // getMyBids
orderSchema.index({ buyer: 1 });
orderSchema.index({ seller: 1 });
watchlistSchema.index({ user: 1, auction: 1 }, { unique: true });
notificationSchema.index({ user: 1, isRead: 1 });
auctionSchema.index({ status: 1, startTime: 1, endTime: 1 });
```

**Interview Q:** "Have you added any indexes?"
**Answer:** "Only the automatic ones — `_id` everywhere, plus unique indexes on user email and category name from `unique: true` in the schemas. Every reference field is unindexed, so queries like `Bid.find({ bidder })` are collection scans. At my data volume that's invisible, but the ones I'd add first are `{ auction: 1, status: 1 }` on bids, because that's exactly the filter `getAuctionWinner` uses, and a unique compound index on `{ user, auction }` for watchlists, which would also fix the duplicate-entry problem."

---

# PART 36 — FILE-BY-FILE EXPLANATION

---

### `backend/server.js`
**Purpose:** Application entry point — middleware registration, route mounting, database connection, the auction status scheduler, and starting the HTTP listener.
**Imports:** `express`, `cors`, `dotenv`, `./config/db`, `./models/Auction.model`, twelve route files, both middlewares.
**Key contents:** `app.use(cors())`, `app.use(express.json())`, `connectDB()`, thirteen `app.use(prefix, router)` mounts, three inline routes (`/`, `/api/test-protected`, `/api/admin-test`), `updateAuctionStatuses` with `setInterval`, `app.listen(PORT)`.
**Used by:** Nothing imports it — Node executes it.
**Interview Qs:** Why must `express.json()` come before the routes? What does `app.use()` do? Why is `Auction` imported here?

---

### `backend/config/db.js`
**Purpose:** Connect Mongoose to MongoDB.
**Exports:** `connectDB` — an async function.
**Called by:** `server.js`.
**Note:** The catch logs but does not exit, so the server starts even when the database is unreachable.
**Interview Qs:** Why is the connection in a separate file? What does `process.env.MONGO_URI` contain?

---

### `backend/controllers/authController.js`
**Purpose:** Registration and login — the only two public write endpoints in the API.
**Imports:** `bcryptjs`, `../models/User.model`, `jsonwebtoken` (required mid-file, just before `loginUser`).
**Exports:** `registerUser`, `loginUser`.
**Key lines:** `bcrypt.hash(password, 10)`; `role === "seller" ? "seller" : "customer"`; `bcrypt.compare(...)`; `jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" })`.
**Interview Qs:** What is in the token? Why 10 salt rounds? How is admin registration prevented? Why does login return 404 for a missing user and 401 for a wrong password, and what's the security concern with that?

---

### `backend/middlewares/authMiddleware.js`
**Purpose:** Verify the JWT and attach `req.user`.
**Exports:** `protect` (a single function, exported directly rather than in an object).
**The critical line:** `req.user = decoded;`
**Used by:** Every protected route in ten route files, plus two inline routes in `server.js`.
**Interview Qs:** What exactly does `authHeader.split(" ")[1]` produce? What are the three ways this returns 401? What happens if `next()` is never called?

---

### `backend/middlewares/roleMiddleware.js`
**Purpose:** Role-based authorization.
**Exports:** `authorizeRoles` — a higher-order function using a rest parameter.
**Interview Qs:** Why is it called with parentheses in the route while `protect` is not? What is a rest parameter? Why must it run after `protect`?

---

### `backend/models/User.model.js`
**Purpose:** The user schema.
**Nine fields** plus timestamps. `email` is unique/lowercase/trim; `role` and `status` are enums with defaults.
**Interview Qs:** Why is `mobile` a String? Why does `role` have an enum but `gender` doesn't? What does `unique: true` actually create?

---

### `backend/controllers/productController.js`
**Purpose:** Product CRUD with seller ownership enforcement.
**Exports:** `createProduct`, `getProducts`, `getProductById`, `updateProduct`, `deleteProduct`.
**Key lines:** `seller: req.user.id` on create; `String(product.seller) !== String(req.user.id)` on update and delete.
**Interview Qs:** Why `String()` on both sides? Why isn't `seller` read from `req.body`? What does `Object.assign(product, req.body)` risk?

---

### `backend/models/Product.model.js` · `backend/routes/productRoutes.js`
Seven fields; two ObjectId refs (`category`, `seller`); `images: [String]` defaulting to `[]`.
Routes: POST (seller), GET / and GET /:id (all three roles), PATCH and DELETE (seller + admin).
**Interview Q:** Why can a seller create a product but an admin cannot?

---

### `backend/controllers/auctionController.js`
**Purpose:** Auction CRUD, the status lifecycle, and winner determination.
**Exports:** `createAuction`, `getAuctions`, `getAuctionById`, `updateAuction`, `deleteAuction`, `getAuctionWinner`. (`updateAuctionStatuses` is internal and not exported.)
**Key lines:** `await updateAuctionStatuses()` at the top of `getAuctions`; `Bid.findOne({ auction, status: "approved" }).sort({ amount: -1 })`.
**Interview Qs:** How does the winner query work? Why does `getAuctions` refresh statuses first? Why does PATCH require all five fields?

---

### `backend/controllers/bidController.js`
**Purpose:** The core auction logic — placing bids and the approval workflow.
**Imports:** `Notification.model`, `Bid.model`, `Auction.model`.
**Exports:** `placeBid`, `getBids`, `getAllBids`, `getMyBids`, `updateBidStatus`.
**Key lines:** the five validations; `existingAuction.currentBid = Number(amount)`; the seller filter in `getAllBids`; `Notification.create(...)` in `updateBidStatus`.
**Interview Qs:** Walk me through every validation in `placeBid`. Why is `currentBid` updated before approval? Where do notifications come from? Why is the seller filter done in JavaScript rather than in the query?

---

### `backend/routes/bidRoutes.js`
Five routes. **`/my` is declared before `/:auctionId`** — the ordering detail from Part 33.10.

---

### `backend/controllers/orderController.js`
**Purpose:** Order creation and management.
**Exports:** `createOrder`, `getOrders`, `getMyWonAuctions`, `getOrderById`, `updateOrder`, `deleteOrder`, `createOrderFromAuction`.
**The important function:** `createOrderFromAuction` — every field derived server-side, plus the duplicate guard.
**Interview Qs:** Why does the order store `amount` when it could be looked up from the bid? What stops a duplicate order? Why does an admin see no orders from `GET /api/orders`?

---

### `backend/models/Contact.model.js` · `contactController.js` · `contactRoutes.js`
Three fields; a public POST; database write then Nodemailer send.
**Interview Qs:** Why `replyTo`? Why an App Password? Why is this route public? What happens if Gmail fails after the document is saved?

---

### `backend/routes/aiRoutes.js`
**Purpose:** The Gemini endpoint. **The only route file containing business logic.**
**Key lines:** `new GoogleGenAI({ apiKey })` at module scope; `ai.models.generateContent({ model: "gemini-3.6-flash", contents })`; `response.text`.
**Interview Qs:** Where is the API key stored and why? Does this know your database? What's the risk of concatenating user input into the prompt?

---

### `frontend/src/api/axios.js`
**Purpose:** One configured Axios instance with the auth interceptor.
**Exports:** the instance, as default.
**Interview Qs:** What does an interceptor do? Why the `if (token)` guard? Why an instance rather than the global `axios`?

---

### `frontend/src/component/protectedroute/ProtectedRoute.jsx`
**Purpose:** Client-side route guard.
**Props:** `allowedRoles` — an array.
**Returns:** `<Navigate to="/login" />`, `<Navigate to="/<their dashboard>" />`, or `<Outlet />`.
**Interview Qs:** What is `Outlet`? What does `replace` do? Why redirect a wrong-role user to their own dashboard instead of to login? Is this security?

---

### `frontend/src/App.jsx`
**Purpose:** The complete route table.
**Structure:** 8 public routes, three layout-route groups (8 + 6 + 6), one catch-all.
**Interview Qs:** How does the catch-all work? Why does the wrapper `<Route>` have no `path`? What happens at `/random`?

---

### `frontend/src/component/dashboard/DashboardLayout.jsx`
**Purpose:** Shared dashboard shell for all three roles.
**Props:** `role`, `title`, `children`.
**Reads:** `demoNav[role]`, `useLocation().pathname`.
**Logout:** clears both localStorage keys, navigates to `/login`.
**Interview Qs:** How does one component serve three roles? Why is there no logout API call?

---

### Major dashboard pages — quick reference

| File | APIs | Distinctive feature |
|---|---|---|
| `admin/AdminDashboard.jsx` | `/users`, `/auctions`, `/bids` | `Promise.all`; counts computed client-side; Revenue hardcoded `null` |
| `admin/AuctionListings.jsx` | 6 endpoints | Two modals; `datetime-local` ISO conversion; order creation button |
| `admin/BidApprovals.jsx` | `/bids`, `/bids/:id/status` | Buttons only on pending; re-fetches after update |
| `admin/Users.jsx` | `/users`, `/users/:id` | Block/unblock; replaces state with the server's returned object |
| `admin/Reports.jsx` | `/reports` | The only aggregation consumer; bar heights hardcoded |
| `bidder/AddProduct.jsx` | `/categories`, `/products`, `/auctions` | Two sequential writes; explicit image-upload note |
| `bidder/MyProducts.jsx` | 4 endpoints | Client-side ownership filter; full edit modal |
| `bidder/BidsReceived.jsx` | `/bids`, `/bids/:id/status` | Status filter buttons; optimistic row update |
| `bidder/AuctionResults.jsx` | `/auctions`, `/auctions/:id/winner` | Per-item `try/catch` inside `Promise.all` |
| `customer/MyBids.jsx` | `/bids/my` | The Pending/Winning/Outbid derivation |
| `customer/WonAuctions.jsx` | `/orders/won`, `/orders/:id` | The only `window.location.reload()` in the project |
| `customer/Notifications.jsx` | `/notifications`, `/notifications/:id/read` | Simulated bulk update via `Promise.all` |

---

# PART 37 — LINE-LEVEL CONCEPT EXPLANATION

## 37.1 `const express = require("express");`

- `const` — a binding that cannot be reassigned.
- `require(...)` — the CommonJS module loader. Used because `package.json` sets `"type": "commonjs"`. The frontend uses `import` because its `package.json` sets `"type": "module"`.
- `"express"` — no `./` prefix, so Node resolves it from `node_modules`.

## 37.2 `const router = express.Router();`

`Router()` returns a mini Express application — an isolated middleware and route stack. Mounting it with `app.use("/api/products", router)` makes every path inside it relative to that prefix.

## 37.3 `router.post("/", protect, authorizeRoles("seller"), createProduct);`

| Piece | Meaning |
|---|---|
| `router.post` | Matches the HTTP POST method only |
| `"/"` | Relative to the mount prefix → the real path is `/api/products` |
| `protect` | A **reference**, no parentheses — Express calls it with `(req, res, next)` |
| `authorizeRoles("seller")` | **Called now**; its return value is the middleware Express will call |
| `createProduct` | The final handler, which sends the response |

Execution is strictly left to right, and each item must call `next()` for the next to run.

## 37.4 `const token = localStorage.getItem("token");`

`localStorage` is a browser Web Storage API: synchronous, string-only, roughly 5–10 MB, scoped per origin, and persistent until explicitly cleared. `getItem` returns the stored string or `null`. The `null` case is exactly why the interceptor guards with `if (token)`.

## 37.5 `config.headers.Authorization = \`Bearer ${token}\`;`

- `config` — the request configuration object Axios is about to send.
- `headers` — the HTTP headers.
- `Authorization` — the standard header name for credentials.
- Backticks — a **template literal**, allowing `${token}` interpolation.
- `Bearer ` with the trailing space — the scheme name, required because the backend does `authHeader.split(" ")[1]`.

## 37.6 `const user = JSON.parse(localStorage.getItem("user") || "null");`

Read right to left:

1. `localStorage.getItem("user")` → the stored JSON **string**, or `null` if absent.
2. `|| "null"` → if it is `null` (falsy), substitute the **string** `"null"`. This is the crucial part: `JSON.parse(null)` would actually coerce to `JSON.parse("null")` and work, but `JSON.parse(undefined)` throws. The `|| "null"` makes the intent explicit and guarantees valid JSON input.
3. `JSON.parse(...)` → converts the string into a JavaScript object, or the value `null`.

Result: `user` is either `{ id, name, email, role }` or `null`, which `if (!token || !user)` then checks.

**Why is it stored as a string at all?** localStorage can only hold strings. `Login.jsx` writes `JSON.stringify(user)`; every reader must `JSON.parse` it back.

**Interview Q:** "Why `|| 'null'` in quotes rather than `|| null`?"
**Answer:** "Because `JSON.parse` expects a string. Passing the string `'null'` parses cleanly to the value `null`. It makes the fallback explicit and avoids relying on coercion."

## 37.7 `await mongoose.connect(process.env.MONGO_URI);`

- `mongoose.connect` returns a Promise; `await` pauses until the connection is established.
- `process.env` — Node's environment-variable object, populated by `require("dotenv").config()` reading `.env` at startup.
- `MONGO_URI` → `mongodb://localhost:27017/Storagewars`, which breaks down as protocol `mongodb://`, host `localhost`, port `27017` (MongoDB's default), database `Storagewars`.
- The whole call sits in a `try/catch` because a failed connection would otherwise be an unhandled rejection.

## 37.8 `const decoded = jwt.verify(token, process.env.JWT_SECRET);`

`verify` does three things: recomputes the HMAC signature over the header and payload using the secret and compares it; checks the `exp` claim against the current time; and returns the decoded payload if both pass. It **throws** on failure — `JsonWebTokenError` for a bad signature, `TokenExpiredError` for expiry — which is why the whole thing sits inside `try/catch`.

Note: `jwt.decode(token)` would read the payload **without** verifying. Using `decode` instead of `verify` in a middleware would be a serious security bug, because anyone could edit the payload.

## 37.9 `const hashedPassword = await bcrypt.hash(password, 10);`

`10` is the cost factor: 2¹⁰ = 1024 key-expansion rounds. It is `await`ed because hashing is deliberately slow and runs asynchronously so as not to block the event loop. The output embeds the algorithm version, the cost and the salt, which is why `bcrypt.compare` needs nothing else.

## 37.10 `String(product.seller) !== String(req.user.id)`

`product.seller` is an ObjectId instance; `req.user.id` is a string. `String()` calls `toString()` on the ObjectId, producing its 24-character hex form, so both sides are comparable strings. Without the conversion, the comparison would always be unequal and every seller would be blocked from editing their own products.

## 37.11 `existingAuction.seller.toString() === req.user.id`

The same idea using the method form. Equivalent here, but `String(x)` is safer in general because it does not throw when `x` is `null` or `undefined`.

## 37.12 `const auctions = await Auction.find().populate("product", "name images description category").populate("seller", "name email");`

- `find()` with no filter → every document in the collection.
- `.populate(path, select)` → replaces the ObjectId at `path` with the referenced document, keeping only the fields named in `select` (plus `_id`).
- Chaining two populates means two additional queries after the main one.
- `await` on the query executes it — a Mongoose `Query` is thenable, so `await` triggers it.

## 37.13 `setFormData({ ...formData, [e.target.name]: e.target.value });`

- `{ ...formData }` — the **spread operator** copies every existing key/value into a new object. State must be replaced, not mutated.
- `[e.target.name]` — a **computed property name**. The square brackets mean "evaluate this expression and use the result as the key", so an input with `name="email"` writes to the `email` key.
- One handler therefore serves all eight fields in `Register.jsx`.

## 37.14 `const [loading, setLoading] = useState(true);`

Array destructuring of the tuple `useState` returns: the current value and a setter. Calling `setLoading(false)` schedules a re-render; assigning `loading = false` directly would do nothing.

## 37.15 `{auction.status === "live" && (<div>...</div>)}`

JavaScript's `&&` returns its left operand if that operand is falsy, otherwise the right one. When the condition is false, the expression evaluates to `false`, and React renders nothing for `false`, `null` and `undefined`.

**A caveat worth knowing:** with a **number** on the left, `0 && <div/>` returns `0`, and React renders the character "0". That is why `{items.length && <List/>}` is a classic bug and `{items.length > 0 && <List/>}` is correct. This project uses boolean comparisons throughout, so it does not hit this.

## 37.16 `const seconds = Math.max(0, Math.floor((new Date(end) - new Date()) / 1000));`

Subtracting two `Date` objects coerces both to milliseconds since the epoch and yields the difference in milliseconds. `/1000` converts to seconds, `Math.floor` truncates, and `Math.max(0, ...)` clamps a past date to zero rather than showing a negative countdown.

## 37.17 `const minimumBid = Math.max(auction.startingPrice, auction.currentBid) + 1;`

Handles the no-bids case. When `currentBid` is 0, `Math.max` picks `startingPrice`; once bidding starts, it picks `currentBid`. `+ 1` enforces a strictly higher bid, matching the backend's `<=` rejection.

## 37.18 `const totalSales = totalSalesResult[0]?.total || 0;`

`aggregate` returns an array. On an empty collection it returns `[]`, so `[0]` is `undefined`. Optional chaining (`?.`) stops the property access from throwing, and `|| 0` supplies a sensible default.

## 37.19 `new Date(auction.startTime).toISOString().slice(0, 16)`

`toISOString()` produces `2026-09-10T10:00:00.000Z`. An `<input type="datetime-local">` accepts only `YYYY-MM-DDTHH:mm`, so `.slice(0, 16)` trims the seconds, milliseconds and the `Z`. Note this also converts to UTC, so the displayed time in the edit form may differ from the local time originally entered — a real quirk of this implementation.

## 37.20 `module.exports = { createProduct, getProducts, ... };`

CommonJS export of an object, which is why the route file destructures:
```js
const { createProduct, getProducts } = require("../controllers/productController");
```
Contrast with `authMiddleware.js`, which does `module.exports = protect;` — a single value — so its consumers write `const protect = require("../middlewares/authMiddleware");` with no braces.

---

# PART 38 — INTERVIEW QUESTION BANK

Format for each: **Q** → *Short answer* → **Detailed answer** → **Storage Wars example** → *Follow-up*

---

## A. Basic project questions

**Q1. Tell me about your project.**
*Short:* A full-stack MERN online auction platform with three roles.
**Detailed:** See the 1-minute introduction in Part 1.10.
*Follow-up:* "What was the hardest part?" → The bid approval workflow, because it needed role checks, ownership checks and a notification side effect in one controller.

**Q2. Why did you choose this project?**
*Short:* It exercises every part of a full-stack application in one business domain.
**Detailed:** An auction needs authentication, three distinct roles with different permissions, time-based state changes, relational data across six collections, and a clear multi-step workflow. A simple CRUD app would not have forced me to think about ownership checks, status lifecycles or race conditions.

**Q3. What was your role?**
*Short:* I built the whole thing — frontend, backend and database.
**Detailed:** I designed the nine Mongoose schemas, wrote all eleven controllers and twelve route files, built the auth and role middleware, and built roughly forty React components across public pages and three dashboards. I also integrated Nodemailer and the Gemini API.

**Q4. How long did it take?**
Answer honestly with your actual timeline. The file timestamps show the backend was built over roughly a week in early September 2026, with the frontend UI phase preceding it — the `ProjectDetails.txt` document describes that UI-first phase explicitly.

**Q5. What would you do differently?**
*Short:* Make `currentBid` reflect only approved bids, and move the "my records" filtering into the database.
**Detailed:** Three things: first, `placeBid` updates `currentBid` before approval, which makes the customer's Winning/Outbid label unreliable. Second, several "my products" and "my auctions" filters run in the browser over the full collection — those should be server-side queries. Third, I'd add a global error-handling middleware instead of repeating the same catch block in thirty-five functions.

---

## B. Frontend / React

**Q6. Functional or class components?**
*Short:* Entirely functional, with hooks.
*Follow-up:* "Why?" → Hooks cover everything I needed; `useEffect` handles mounting and cleanup, and there's less boilerplate than `this.setState` and lifecycle methods.

**Q7. Which hooks did you use?**
`useState`, `useEffect`, and the React Router hooks `useNavigate`, `useParams` and `useLocation`. No `useContext`, `useMemo`, `useCallback`, `useRef` or `useReducer`.
*Follow-up:* "Why no `useMemo`?" → Nothing in this project does expensive computation on every render. Adding it without a measured problem is premature optimisation.

**Q8. How do you fetch data?**
`useEffect` with an empty dependency array, containing an inner async function that calls the Axios instance and sets state.
*Example:* `Auctions.jsx` fetches `/auctions` on mount and stores the result in `auctions` state.
*Follow-up:* "Why can't `useEffect` be async?" → It would return a Promise, and React expects the return value to be a cleanup function.

**Q9. How do you avoid an infinite loop in `useEffect`?**
The empty dependency array. Without it, the effect runs after every render, and setting state inside it triggers another render, which triggers the effect again.

**Q10. What are keys and why do they matter?**
Keys let React match elements across renders. I use MongoDB `_id` values because they're stable and unique. `DataTable` falls back to the array index because its rows are plain data with no internal state.

**Q11. Controlled vs uncontrolled inputs?**
Every input in this project is controlled — `value` comes from state and `onChange` writes back. That's why `Contact.jsx` can clear the form with `setFormData({ name: "", email: "", message: "" })`.

**Q12. How do you share data between components?**
Props downward, callback props upward, and localStorage for the token and user. No Context or Redux.
*Follow-up:* "When would you add Context?" → When more than two or three levels needed the same value, or when a change to it had to trigger a re-render — which localStorage doesn't do.

**Q13. Give an example of a reusable component.**
`DataTable` — used on ten pages. It takes `headers`, `rows` and an `actions` render function, so each page supplies its own buttons while the table markup is written once.

**Q14. What does `Promise.all` do in your dashboards?**
It fires several independent requests concurrently. `CustomerDashboard` calls five endpoints at once, so the page waits for the slowest rather than the sum.
*Follow-up:* "What if one fails?" → The whole block rejects. `Promise.allSettled` would let the successful ones still render.

---

## C. Routing

**Q15. How is routing set up?**
`BrowserRouter` in `main.jsx`; the whole route table in `App.jsx`; `Link` for navigation; `useNavigate` for programmatic redirects after login and logout.

**Q16. How are protected routes implemented?**
A layout route with no `path`, whose `element` is `ProtectedRoute`. It reads the token and user from localStorage and returns either `<Navigate />` or `<Outlet />`, so one wrapper guards all eight admin routes.

**Q17. What is `Outlet`?**
A placeholder where React Router renders whichever child route matched. Without returning it, `ProtectedRoute` would render nothing and the protected pages would never appear.

**Q18. What happens at an unknown URL?**
`<Route path="*" element={<NotFound />} />` catches it. It never reaches `ProtectedRoute`, because that only wraps the specific dashboard paths.

**Q19. Why not redirect unknown URLs to login?**
Because "doesn't exist" and "not allowed" are different facts. Redirecting would imply a page exists there, and it would confuse an already-logged-in admin who mistyped a URL.

---

## D. Axios

**Q20. Why Axios over fetch?**
Interceptors and a configurable base URL. One interceptor attaches the JWT to roughly forty requests; `fetch` has no equivalent, so the token logic would be duplicated everywhere.

**Q21. What does the request interceptor do?**
Reads the token from localStorage and, if present, sets `config.headers.Authorization = \`Bearer ${token}\``, then returns the config.
*Follow-up:* "Why `if (token)`?" → Register, login, contact and the AI route are public. Without the guard, a logged-out visitor would send `Bearer null` and `jwt.verify` would throw.

**Q22. Do you have a response interceptor?**
No — and that's a gap. A 401 from an expired token currently just alerts on whatever page the user is on. A response interceptor should clear localStorage and redirect to login.

---

## E. Node and Express

**Q23. What is middleware?**
A function with `(req, res, next)` that runs between the request and the handler. It either passes control on with `next()` or ends the request with a response. `protect` and `authorizeRoles` are my two custom ones.

**Q24. Why is `express.json()` needed?**
Without it, `req.body` is `undefined`, because Express doesn't parse request bodies by default. It must be registered before the routes.

**Q25. What does `app.use("/api/products", productRoutes)` do?**
Mounts the router at that prefix, so paths inside the router are relative — `router.post("/")` becomes `POST /api/products`.

**Q26. Is Node single-threaded?**
Yes for JavaScript execution, but I/O is non-blocking. When a controller awaits a database call, the event loop handles other requests and resumes when MongoDB responds. That's why one process serves many concurrent users.

**Q27. Why is `nodemon` a devDependency?**
It only auto-restarts the server during development. Production runs `node server.js` via `npm start`, so shipping nodemon would be dead weight.

---

## F. MongoDB and Mongoose

**Q28. Why MongoDB rather than MySQL?**
Document-shaped data. `images` is a native array with no join table, and I could add fields during development without migrations. The trade-off is no foreign-key enforcement — nothing at the database level stops a bid referencing a deleted auction, which is why my controllers use optional chaining defensively.

**Q29. What does Mongoose add?**
Schema, validation, type casting, `populate` and middleware. Without it, MongoDB would accept `amount: "hello"`; with it, `Bid.model.js` declares `amount: { type: Number, min: 0 }` and rejects it.

**Q30. How do you model relationships?**
ObjectId references with `ref`, then `populate` on read. Everything is referenced, nothing embedded, so a user changing their email updates one document.

**Q31. Is `populate` a join?**
Not at the database level. Mongoose runs the main query, collects the ObjectIds and issues a second query with `$in`, merging in Node. MongoDB's real server-side join is `$lookup` in the aggregation pipeline.

**Q32. Have you used aggregation?**
Yes, in `reportController`. `$match` filters non-cancelled orders, `$group` with `_id: null` sums the amounts, and a second pipeline groups by `$month` for the monthly breakdown.

**Q33. What is an ObjectId?**
MongoDB's 12-byte unique identifier, displayed as 24 hex characters. It embeds a timestamp, which is why sorting by `_id` roughly sorts by creation time.

---

## G. Authentication and authorization

**Q34. Walk me through login.**
`Login.jsx` posts email and password. `loginUser` finds the user by email, runs `bcrypt.compare`, signs a JWT with `{ id, role }` and a one-day expiry, and returns the token plus a user object. The frontend stores both in localStorage and navigates based on role.

**Q35. What's in your JWT?**
`id`, `role`, `iat` and `exp`. Nothing else — no name, no email, no password. The payload is only Base64-encoded, not encrypted, so it holds only what's needed for authorization.

**Q36. How do you hash passwords?**
`bcrypt.hash(password, 10)` at registration, `bcrypt.compare` at login. Bcrypt salts automatically and is deliberately slow, so identical passwords produce different hashes and brute-forcing is expensive.

**Q37. Difference between authentication and authorization?**
Authentication is "who are you" — `protect`, returning 401. Authorization is "what may you do" — `authorizeRoles` and ownership checks, returning 403.

**Q38. How do you prevent a customer from creating a product?**
`productRoutes.js` declares `authorizeRoles("seller")`. A customer's token verifies fine, so `protect` passes, but the role check fails and returns 403 before the controller runs.

**Q39. How do you stop Seller A editing Seller B's product?**
`updateProduct` loads the document and compares `String(product.seller)` with `String(req.user.id)`, returning 403 on a mismatch. The role check alone would let any seller through.

**Q40. Where does `req.user` come from?**
`protect` sets it: `req.user = jwt.verify(token, JWT_SECRET)`. It's derived from a signed token, never from the request body.

---

## H. Business logic

**Q41. Walk me through the bidding validations.**
Auction exists → not your own auction → status is live → end time hasn't passed → amount greater than current bid. Then create the bid as pending and update `currentBid`.

**Q42. Why both a status check and an end-time check?**
The status updater runs every 60 seconds, so an auction can still say "live" up to a minute after it ended. The explicit clock comparison closes that window.

**Q43. How is the winner determined?**
`Bid.findOne({ auction, status: "approved" }).sort({ amount: -1 })` — the single highest bid among approved ones. If nothing was approved, it returns 404 and the UI shows "No approved winner".

**Q44. Why do bids need approval?**
It gives the seller control. A bid that looks unserious or suspicious can be rejected. It was in my original design document as a deliberate business rule.

**Q45. How does an auction go live?**
`updateAuctionStatuses` runs every 60 seconds via `setInterval` in `server.js`, and again at the start of every `GET /api/auctions`, using `updateMany` with `$lte` and `$gt` comparisons on the current time.

**Q46. How are orders created?**
`POST /api/orders/from-auction/:auctionId`, admin only. It checks the auction is completed, finds the highest approved bid, checks no order already exists, then creates one with the buyer and amount taken from that bid.

---

## I. Security

**Q47. Is your app secure?**
It implements the right concepts — hashed passwords, signed tokens, role and ownership authorization, secrets in environment variables. It is not production-hardened: the JWT secret is weak, the token sits in localStorage, there's no rate limiting, no HTTPS, and CORS allows every origin.

**Q48. What if someone edits localStorage to say `role: admin`?**
The React UI would render the admin dashboard, because `ProtectedRoute` trusts localStorage. But every API call carries the original signed token, whose payload still says customer, so each one returns 403. The frontend guard is UX; the backend is the security.

**Q49. Why not put the Gemini key in the frontend?**
Anyone could open DevTools, copy it and spend the quota. It lives in `.env` on the server; the browser calls my `/api/ai` endpoint, and my server calls Google.

**Q50. Why is `.env` git-ignored?**
It holds `JWT_SECRET`, the Gemini key and a Gmail App Password. Leaking `JWT_SECRET` is the worst of the three — anyone with it could sign a valid admin token for any user id.

---

## J. AI and email

**Q51. Does your chatbot know your database?**
No. `aiRoutes.js` doesn't import a single model. It wraps the user's message in a system prompt and sends it to Gemini. It can explain how bidding works in general; ask it what's live right now and it will invent something. Making it data-aware would mean querying MongoDB and injecting real context into the prompt.

**Q52. How does Contact Us send email?**
`contactController` saves the document first, then creates a Nodemailer transport with `service: "gmail"` and the credentials from `.env`, and sends with `from` and `to` as my account and `replyTo` as the visitor's address.

**Q53. Why an App Password?**
Google blocked plain-password SMTP for third-party apps. An App Password is a 16-character credential scoped to one application and independently revocable, and it requires 2-Step Verification on the account.

---

## K. Debugging

**Q54. Describe a bug you fixed.**
See Part 33 — the `id` vs `_id` mismatch is the clearest one. Login returned `user.id`, but every populated document uses `_id`, so my "my products" filter compared a real value against `undefined` and returned an empty list.

**Q55. How do you debug an API problem?**
Check the Network tab for the status code, log `error.response.status` and `error.response.data` separately, and verify the Request Headers actually contain the Authorization header. Then reproduce it in Postman without React in the way, and confirm the result in Compass.

**Q56. What does a 500 usually mean in your project?**
An uncaught exception reaching a controller's catch block. The common causes are MongoDB not running, a malformed ObjectId causing a CastError, or a Mongoose validation error on save.

---

## L. Deployment

**Q57. How would you deploy this?**
Frontend: `npm run build` and host the `dist` folder on Vercel or Netlify. Backend: Render or Railway with the environment variables configured there. Database: MongoDB Atlas instead of localhost. And the hardcoded `baseURL` in `axios.js` would have to become an environment variable.

**Q58. What would break if you deployed it as-is?**
Three things. The Axios `baseURL` points at `http://localhost:5000`. The Mongo URI points at a local database. And `cors()` with no options allows every origin, which should be a whitelist in production.

**Q59. Is it deployed?**
Answer honestly. If not: "No — it runs locally against a local MongoDB. Deploying it is the next step, and I know exactly which three things would need to change first."

---

# PART 39 — "WHY DID YOU USE...?"

**Why React?**
Storage Wars has around forty screens that share components — the auction card appears on three pages, the data table on ten, the countdown timer on three. React let me write each once. And the UI is state-driven: when a bid list updates, I set state and the table re-renders rather than manually rewriting DOM nodes.

**Why Node?**
One language across the stack. The same `String()` comparison, the same array methods, the same async/await on both sides. It also meant I could reuse mental models rather than context-switching between JavaScript and, say, PHP or Java.

**Why Express?**
My API has twelve route groups and a two-middleware chain in front of most handlers. Express's `Router` and `app.use()` model matched that structure directly. Writing it on the raw `http` module would have meant building my own router and body parser first.

**Why MongoDB?**
The data is document-shaped. A product has an array of image URLs, which MongoDB stores natively without a join table. And because the schema evolved during development — I added `status` fields after the fact — a schema-less database meant no migrations.

**Why Mongoose?**
MongoDB alone would accept `amount: "hello"` on a bid. Mongoose gives me `type: Number`, `required`, `min: 0` and `enum` on status fields, plus `populate` for relationships and `aggregate` for the reports. Every rule that protects my data lives in the nine model files.

**Why JWT?**
The API is stateless and the frontend is a separate origin. A JWT is self-contained, so verifying a request is a signature check with no session store to consult. The trade-off is that I can't revoke a token before it expires — with a one-day expiry, that was acceptable for this project.

**Why bcrypt?**
So a database leak doesn't expose passwords. Bcrypt salts automatically, so two users with the same password get different hashes, and its cost factor makes brute-forcing expensive. A fast hash like SHA-256 without a salt would be defeated by rainbow tables.

**Why Axios?**
The interceptor. One function in `axios.js` attaches the JWT to every protected request. With `fetch` I'd have written the token-reading code in about forty places, and forgetting it once produces a silent 401.

**Why middleware?**
Authentication and role checks are needed by thirty-plus routes. Writing them as middleware means each route declares its requirements in one readable line — `protect, authorizeRoles("seller")` — and the logic lives in one place. Putting the check inside each controller would mean thirty copies, and one omission is a security hole.

**Why `roleMiddleware`?**
Because `protect` only answers "is this a real user?". `authorizeRoles` answers "is this the right kind of user?". Separating them means I can compose them per route: some routes need any logged-in user, some need exactly an admin, some need any of the three.

**Why `ProtectedRoute`?**
So a customer typing `/admin` doesn't see an admin interface flash on screen before the API calls fail. It's a user-experience layer. I'm clear that it isn't security — anyone can edit localStorage — which is why every one of those pages' API calls is independently checked on the server.

**Why localStorage?**
It persists across refreshes and browser restarts, and it's readable synchronously by the Axios interceptor. The trade-off is XSS exposure. An httpOnly cookie would be more secure but needs CSRF protection and cookie configuration across origins — that's the upgrade path, not what I built.

**Why Nodemailer?**
So a Contact Us message doesn't just sit in a collection nobody checks. It goes to an inbox with the visitor's address in `replyTo`, so replying works naturally. Gmail with an App Password required no account setup beyond generating the password.

**Why Gemini?**
To give users a help assistant without hand-writing an FAQ engine. I chose the Flash tier because the answers are short help responses where speed matters more than deep reasoning. And I keep the key server-side so it can't be harvested from the browser.

**Why environment variables?**
Five secrets — the Mongo URI, the JWT secret, the Gemini key, the email address and the App Password. Hardcoding any of them would put them in git history permanently, and rotating one would mean a code change instead of an environment update.

**Why separate controllers from models?**
The model defines what the data is and what rules it must satisfy. The controller defines what happens to it. Keeping them separate means I can change a validation rule in one model file without reading a controller, and the same controller function could serve more than one route without duplication.

---

# PART 40 — CROSS QUESTIONS

Each answer states what your project actually does first, then separates any improvement.

---

**"Why JWT instead of sessions?"**
My API is stateless and the frontend runs on a separate origin. With sessions the server would keep session state and the client only a session id, meaning a lookup on every request and a shared store to scale beyond one process. A JWT carries the identity itself, so verification is just a signature check. The honest trade-off is revocation: I can't invalidate a token before its one-day expiry, so my logout only clears the client. Sessions would give me real revocation; I accepted that trade-off for this project.

---

**"How do you prevent a customer from creating a product?"**
`productRoutes.js` declares `router.post("/", protect, authorizeRoles("seller"), createProduct)`. A customer's token verifies fine, so `protect` passes and sets `req.user`. Then `authorizeRoles("seller")` checks `["seller"].includes("customer")`, which is false, and returns 403 "Access denied". The controller never runs and nothing touches the database.

---

**"What happens if someone manually types `/admin` in the URL as a customer?"**
React Router matches `/admin`, which is inside the admin layout route, so `ProtectedRoute` runs. There is a token and a user, so the authentication check passes. Then `allowedRoles = ["admin"]` doesn't include `"customer"`, so it returns `<Navigate to="/buyer" replace />`. They land on their own dashboard rather than a login page, because they *are* logged in. And if they forced past that by editing localStorage, every admin API call would still 403.

---

**"What if the JWT is invalid?"**
`jwt.verify` throws a `JsonWebTokenError`, the catch block in `protect` returns 401 "Invalid or expired token", and the controller never runs. Editing even one character of the payload changes the recomputed signature, so a tampered token fails the same way. Forging one requires `JWT_SECRET`, which lives only in `.env` on the server.

---

**"What if the JWT is expired?"**
`jwt.verify` throws `TokenExpiredError` — same catch, same 401. My tokens expire after one day. Being honest about the gap: I have no response interceptor, so the frontend just shows an alert on whatever page the user is on rather than redirecting them to login. Adding that redirect is the fix, and I'd add refresh tokens if this were going to production.

---

**"How do you know which user is making the request?"**
`protect` reads the Authorization header, verifies the token, and sets `req.user = decoded` — an object with `id` and `role`. Every controller reads identity from there and never from the request body. So `getMyBids` runs `Bid.find({ bidder: req.user.id })`, and there's no way to ask for someone else's bids, because the filter comes from the signed token.

---

**"How do you know which seller owns a product?"**
`products.seller` stores the owner's ObjectId, set at creation from `req.user.id`. On update or delete, the controller loads the product and compares `String(product.seller)` with `String(req.user.id)`. The `String()` on both sides matters — one is a Mongoose ObjectId and one is a plain string, so without conversion the comparison would always be unequal and every seller would be locked out of their own products.

---

**"How does MongoDB know which user placed the bid?"**
The bid document stores `bidder: req.user.id`. MongoDB itself doesn't know anything about users — it just stores an ObjectId that references a document in the `users` collection. The `ref: "User"` in the schema is Mongoose metadata, and `populate("bidder", "name email")` is what turns that id back into a name and email when reading.

---

**"How do you determine the winner?"**
`GET /api/auctions/:id/winner` runs `Bid.findOne({ auction: id, status: "approved" }).sort({ amount: -1 })`. So it's the highest bid among approved bids only — a pending or rejected bid can never win, regardless of amount. If nothing was approved, it returns 404 and the UI shows "No approved winner".

---

**"How does the seller approve a bid?"**
`PATCH /api/bids/:bidId/status` with `{ status: "approved" }`. The controller validates the status value, loads the bid with its auction and that auction's seller populated, checks the seller owns the auction, sets `bid.status`, saves, and then creates a Notification document for `bid.bidder`. That notification creation is the only automatic notification trigger in the whole application.

---

**"How does the customer see only their bids?"**
`GET /api/bids/my` is customer-only and runs `Bid.find({ bidder: req.user.id })`. The filter comes from the verified token, so there's no parameter a customer could change to see someone else's. That's different from `GET /api/bids`, which is admin and seller only.

---

**"How does the dashboard calculate sales?"**
Two different places, two different methods. The seller dashboard calls `GET /orders` — which the backend already filters to `{ seller: req.user.id }` — and then reduces over `order.amount` in the browser. The admin Reports page uses a MongoDB aggregation: `$match` on non-cancelled orders, then `$group` with `$sum` on amount. Being precise: the seller figure includes cancelled orders because `getOrders` has no status filter, while the reports figure deliberately excludes them.

---

**"How does Contact Us send email?"**
The controller saves the Contact document first, then builds a Nodemailer transport with `service: "gmail"` and the credentials from `.env`, and calls `sendMail` with `from` and `to` set to my account and `replyTo` set to the visitor's address. Saving before sending means a message is never lost if SMTP fails. The password is a Gmail App Password, not my account password, because Google blocks plain-password SMTP for third-party apps.

---

**"Where is your Gemini API key stored?"**
In `backend/.env` as `GEMINI_API_KEY`, loaded by `dotenv` into `process.env`, and read once at module load when `new GoogleGenAI({ apiKey })` is constructed. It never reaches the browser — the frontend calls my own `/api/ai` endpoint and my server calls Google. If it were in frontend code, anyone could open DevTools and take it.

---

**"Does your AI chatbot know live MongoDB data?"**
No, and I'd rather say so plainly. `aiRoutes.js` imports `express` and `@google/genai` and nothing else — no Mongoose models. It takes the user's message, wraps it in a fixed system prompt, and sends it to Gemini. So it can explain how bidding works, but asking "what's live right now" gets an invented answer, because the model has no data and no instruction to decline. Making it data-aware would mean querying auctions first and injecting real context into the prompt.

---

**"How would you deploy this?"**
Build the frontend with `npm run build` and host the `dist` output on Vercel or Netlify. Deploy the backend to Render or Railway with all six environment variables configured there. Move the database to MongoDB Atlas. Three things in the code would need to change first: the Axios `baseURL`, which is hardcoded to `http://localhost:5000/api`; the Mongo URI; and `cors()`, which currently allows every origin and should be a whitelist.

---

**"How would this support multiple users?"**
It already does. One React build, one Express process and one database serve everyone; what separates them is their JWT. Every protected controller scopes its query with `req.user.id` — `Bid.find({ bidder: req.user.id })`, `Watchlist.find({ user: req.user.id })`, and so on — so the same endpoint returns different data per caller. Node handles concurrency on a single thread with non-blocking I/O, so while one request waits on MongoDB the event loop serves others.

---

**"What happens when two customers bid at nearly the same time?"**
There's a race condition, and I'd rather tell you than have you find it. `placeBid` reads the auction, compares the amount to `currentBid`, then writes — three separate steps. If a second request reads between the first's read and write, it validates against a stale value and both bids are accepted. The fix is to make it atomic:
```js
Auction.findOneAndUpdate(
    { _id: auctionId, status: "live", currentBid: { $lt: amount } },
    { $set: { currentBid: amount } },
    { new: true }
)
```
MongoDB then does the comparison and the update as one operation, and the loser simply gets `null` back. A transaction around the bid insert and the auction update would be the fuller solution, but it needs a replica set.

---

**"Why is `currentBid` updated before the bid is approved?"**
That's an implementation choice I'd change. Right now `placeBid` sets it as soon as the bid passes validation, so it means "the highest bid placed", not "the highest bid approved". The visible consequences are that rejecting a bid doesn't lower it, and the customer's My Bids page can show "Outbid" for a bid that is actually still the highest approved one. The winner calculation is unaffected because it queries approved bids directly. The fix is to move the `currentBid` write into `updateBidStatus`.

---

**"Can an admin see all orders?"**
No, and that's a gap. `getOrders` uses `role === "seller" ? { seller: id } : { buyer: id }`, so an admin falls into the else branch and sees orders where they personally are the buyer — normally an empty list. A three-way ternary with `{}` for admin would fix it. There's also no admin Orders page in the navigation, so the UI is at least consistent with the API.

---

**"Why do Won Auctions and Orders show the same number?"**
Because both endpoints run `Order.find({ buyer: req.user.id })` — they differ only in which product fields they populate. In this implementation an order only ever exists because an auction was won, so the sets are identical. Conceptually Won Auctions should query approved winning bids on completed auctions instead.

---

**"Your Reports chart — how does it scale?"**
It doesn't, and I won't claim otherwise. Each bar has a hardcoded `height: "80%"`; only the count of bars and the hover tooltip are dynamic. Making it real would mean computing the maximum and setting `height: (sales / max) * 100 + "%"`, or using a charting library.

---

**"Why does an admin see 403 when creating a product?"**
Because `productRoutes.js` says `authorizeRoles("seller")` with no admin. It was deliberate — a product belongs to a seller, and `createProduct` sets `seller: req.user.id`, so an admin creating one would produce a product owned by the admin. If I wanted admins to create products on a seller's behalf, the controller would need to accept a seller id and validate it.

---

**"What if a seller never approves any bid?"**
The auction ends with no winner. `getAuctionWinner` returns 404 "No approved bids found", the seller's Auction Results page shows "No approved winner", and `createOrderFromAuction` refuses with the same 404. That's the intended consequence of making approval a required step, but it does mean an inattentive seller produces nothing from an auction with ten bids.

---

**"Can a user be blocked?"**
The admin can set `status: "blocked"` and it saves correctly. But `loginUser` never reads that field, so a blocked user can still log in and use the API. It's a field that's set but not enforced — the first thing I'd fix, with a status check in `loginUser` and ideally in `protect` as well.

---

**"Why is there no image upload?"**
Because it needs `multer` plus either disk storage or a cloud service, and `multipart/form-data` handling — a substantial feature. Rather than ship a broken upload control, I put an explicit note in the Add Product form saying image upload isn't implemented yet, and the cards render a "No image available" placeholder. The `images` field is `[String]` in the model, so the data layer is ready for it.

---

**"Is there a payment gateway?"**
No. "Complete Order" changes the order status from pending to confirmed and nothing more. There's no payment, no invoice and no transaction record. Adding Razorpay or Stripe would be the next feature, and it would need a webhook to confirm payment server-side rather than trusting a client-side success callback.

---

# PART 41 — PRESENTATION SCRIPT

For each slide: what goes **on** the slide (keep it short), what you **say**, and the likely examiner question.

---

### Slide 1 — Project Title
**On the slide:** Storage Wars · Full-Stack Online Auction Platform · MERN Stack · Your name, roll number, guide

**Say:** "Good morning. My project is Storage Wars, a full-stack online auction platform built on the MERN stack. It supports three user roles and covers the complete auction cycle from listing a product to creating an order for the winner."

**Likely question:** "Why the name?" → It's inspired by storage-unit auctions and the excitement of bidding on something whose value isn't fully known.

---

### Slide 2 — Problem Statement
**On the slide:** Physical auctions: limited reach · manual records · no verification · no transparency

**Say:** "A traditional auction requires everyone in one room at one time. That limits bidders, limits the seller's reach, and leaves records that are manual and disputable. There's also no way to verify who's bidding."

**Likely question:** "How is this different from an e-commerce site?" → Price is discovered by competition within a time window, not fixed by the seller, and there's a bid approval step.

---

### Slide 3 — Objective
**On the slide:** Role-based auction platform · Time-bound auctions · Seller-controlled bid approval · Auditable trail

**Say:** "The objective was a working system where every step — listing, bidding, approval, winner determination and order creation — is stored, permission-controlled and traceable."

---

### Slide 4 — Users and Roles
**On the slide:** A three-column table: Admin / Seller / Customer with three or four capabilities each

**Say:** "Three roles, stored as an enum on the user document. Admin manages users, categories and reports and converts completed auctions to orders. Seller lists products, creates auctions and approves bids on their own auctions. Customer browses, bids, watchlists and receives orders."

**Likely question:** "How do you create the admin?" → Manually in MongoDB Compass. The registration endpoint sanitises the role so nobody can self-register as admin.

---

### Slide 5 — Features
**On the slide:** Twelve module names as a grid — Auth · Users · Categories · Products · Auctions · Bids · Orders · Watchlist · Notifications · Reports · Contact · AI Assistant

**Say:** "Twelve modules. The core cycle is products, auctions, bids and orders. Around it: watchlist, automatic notifications on bid decisions, admin analytics, a contact form that emails, and a Gemini-powered help assistant."

**Likely question:** "Which are fully working?" → All except Discounts, which is a UI prototype with no backend, and image upload, which isn't implemented. Say it before they find it.

---

### Slide 6 — Technology Stack
**On the slide:** Two columns. Frontend: React 18, React Router 7, Axios, Tailwind, Vite, Lucide. Backend: Node, Express 5, MongoDB, Mongoose 9, JWT, bcryptjs, Nodemailer, Gemini.

**Say:** "React with Vite on the frontend, Express and Mongoose on the backend, MongoDB for storage. JWT for authentication, bcrypt for password hashing, Nodemailer for the contact form and the Google Gemini SDK for the assistant."

**Likely question:** "Why MongoDB over MySQL?" → Use the Part 39 answer.

---

### Slide 7 — Architecture
**On the slide:** The vertical flow diagram from Part 2.1, trimmed to nine boxes

**Say:** "A three-tier architecture. React holds all UI state and sends requests through a single Axios instance. Express matches the route, runs the auth middleware, then the role middleware, then the controller, which uses a Mongoose model to reach MongoDB. The JSON response goes back into React state, and the UI re-renders."

**Likely question:** "Where does the middleware sit?" → Between the route match and the controller. Show the `router.post("/", protect, authorizeRoles("seller"), createProduct)` line.

---

### Slide 8 — Authentication
**On the slide:** Login flow in six boxes, and the token payload `{ id, role, iat, exp }`

**Say:** "Registration hashes the password with bcrypt at ten salt rounds. Login finds the user, compares with `bcrypt.compare`, and if it matches signs a JWT containing only the user id and role, expiring in one day. The frontend stores it and the Axios interceptor attaches it to every protected request."

**Likely question:** "Why isn't the password in the token?" → The payload is only Base64-encoded, not encrypted; anyone can decode it. It holds the minimum needed.

---

### Slide 9 — Authorization
**On the slide:** Two rows — `protect` → 401 → "who are you?" · `authorizeRoles` → 403 → "what may you do?" — plus a line on ownership checks

**Say:** "Two layers of middleware plus a third layer inside the controllers. `protect` verifies the token. `authorizeRoles` checks the role. And for resources with an owner, the controller compares the document's seller field with the token's user id — because being *a* seller doesn't make you *the* seller of this product."

**Likely question:** "Isn't the frontend check enough?" → No. Demonstrate the localStorage edit from Part 11.7 if you have a laptop.

---

### Slide 10 — Database
**On the slide:** The nine collection names and the relationship arrows from Part 35.1, simplified

**Say:** "Nine collections. Every relationship is a stored ObjectId with a `ref`, resolved on read with `populate`. Nothing is embedded, so a user changing their email updates exactly one document."

**Likely question:** "Is `populate` a join?" → Not at the database level. Use the Part 13.4 answer.

---

### Slide 11 — Seller Workflow
**On the slide:** Register → Login → Add Product → Create Auction → Receive Bids → Approve → Result

**Say:** "The seller adds a product; the backend attaches their id from the token, so they can't create one on someone else's behalf. Then they set a start and end time to create the auction. Bids arrive on the Bids Received page, they approve or reject, and the results page shows the winner for each completed auction."

---

### Slide 12 — Customer Workflow
**On the slide:** Browse → View Auction → Place Bid → Notification → Won → Order

**Say:** "The customer browses live auctions with a countdown timer, opens one and places a bid. Five validations run on the backend before it's accepted. The bid is pending until the seller decides, and when they do, a notification is created automatically."

---

### Slide 13 — Admin Workflow
**On the slide:** Manage Users · Categories · Products · Auctions · Approve Bids · Create Orders · Reports

**Say:** "The admin manages the taxonomy and the user base, can approve any bid, and converts completed auctions into orders. The reports page uses MongoDB aggregation for total sales, monthly performance and a conversion rate."

---

### Slide 14 — Auction and Bid Workflow
**On the slide:** The lifecycle `upcoming → live → completed` with the trigger, plus the five bid validations as a numbered list

**Say:** "Auctions move between statuses automatically. A function runs every 60 seconds, and again on every read, using `updateMany` with time comparisons. A bid must pass five checks: the auction exists, you're not its seller, it's live, it hasn't ended, and your amount beats the current bid."

**Likely question:** "Why check both status and end time?" → Use the Part 18.2 answer about the 60-second window.

---

### Slide 15 — Orders
**On the slide:** Completed auction → highest approved bid → Order (auction, product, buyer, seller, amount, status)

**Say:** "The admin triggers order creation from a completed auction. Everything is derived server-side: the buyer is the highest approved bidder, the amount is that bid's amount. A duplicate check ensures one auction produces at most one order."

**Likely question:** "Is there payment?" → No. Say it directly and put it in Future Scope.

---

### Slide 16 — Contact and Email
**On the slide:** Form → MongoDB → Nodemailer → Gmail SMTP → Inbox, with `from` / `to` / `replyTo` labelled

**Say:** "The contact form is the only public write endpoint besides register and login. It saves to MongoDB first, then sends through Gmail SMTP with the visitor's address in replyTo, so replying from the inbox goes to them. It authenticates with a Gmail App Password, because Google blocks plain-password SMTP."

---

### Slide 17 — AI Assistant
**On the slide:** ChatBot → POST /api/ai → Gemini → reply. And one line: **"Not database-aware — answers general questions only."**

**Say:** "A floating assistant on every page. The message goes to my backend, which wraps it in a system prompt and calls Gemini Flash. The API key stays server-side so it can't be taken from the browser. I want to be clear that it isn't connected to my database — it explains how the platform works, but it doesn't know what's live right now."

**Likely question:** "Could you make it data-aware?" → Yes: query the auctions collection and inject the results into the prompt as context. That's retrieval-augmented generation, and it's in my future scope.

---

### Slide 18 — Security
**On the slide:** Implemented (six bullets) · Not implemented (four bullets). Both columns visible.

**Say:** "What's implemented: bcrypt hashing, signed JWTs, role middleware, ownership checks, password exclusion from every response, and secrets in environment variables. What isn't: rate limiting, HTTPS, a CORS whitelist and refresh tokens. It demonstrates the concepts correctly but it isn't production-hardened, and I'd rather state that than overclaim."

**Likely question:** Almost certainly a follow-up on one of the "not implemented" items — which is exactly why listing them makes you look stronger, not weaker.

---

### Slide 19 — Testing
**On the slide:** Postman (role-based API testing) · MongoDB Compass (data verification) · Browser DevTools

**Say:** "I tested every endpoint in Postman with three different tokens, so I could confirm the same request returns 201 for a seller and 403 for a customer. Then I verified in Compass that the right document was actually written — that the password is a hash, that the seller field matches the token's user, and that the notification was created for the bidder."

---

### Slide 20 — Challenges
**On the slide:** Four short lines: Token attachment · Auction status not updating · `id` vs `_id` mismatch · `Promise.all` failing on one 404

**Say:** Pick two from Part 33 and tell each as problem → diagnosis → fix → lesson. The `Promise.all` one is good because it shows you understand promise semantics, not just syntax.

---

### Slide 21 — Future Scope
**On the slide:** Payment gateway · Socket.IO real-time bidding · Cloud image upload · Atomic bid updates · Refresh tokens · Deployment · Data-aware AI

**Say:** "The most important one technically is atomic bid updates — my current implementation has a race condition if two customers bid within milliseconds, and `findOneAndUpdate` with a conditional filter would fix it. After that, real-time bidding with Socket.IO so bids appear without a refresh, and a payment gateway."

---

### Slide 22 — Conclusion
**On the slide:** Complete MERN cycle · Three roles · Nine collections · 40+ API endpoints · Working auction lifecycle

**Say:** "Storage Wars gave me the full cycle: designing schemas and relationships, building a role-based REST API, implementing authentication and authorization properly at both role and resource level, and connecting all of it to a React frontend. Just as importantly, I know exactly where its limits are and what I'd fix first. Thank you — I'm happy to demonstrate it or take questions."

---

# PART 42 — LIVE DEMONSTRATION SCRIPT

## 42.0 Before you start — three things that will save you

1. **Start MongoDB first**, then the backend (`npm run dev` in `backend/`), then the frontend (`npm run dev` in `frontend/`). If MongoDB is not running, `connectDB` logs the error but the server still starts, so every API call fails with a 500 and it looks like your code is broken.
2. **Log in before touching the Auctions page.** `GET /api/auctions` requires a token, so browsing `/auctions` while logged out produces a 401 alert. Start the demo at Login, not at Home.
3. **Do not click the auction cards on the Home page.** They are rendered from `data.js`, whose objects use `id`, while `AuctionCard` builds the link from `_id`. Those cards navigate to `/auction/undefined`. Scroll past the Home page or use the navbar to reach Auctions.

Have three browser windows ready, one per role — ideally one normal and two incognito, because localStorage is shared per profile and logging in as a second role in the same window overwrites the first.

Keep MongoDB Compass open on the `Storagewars` database and Postman open with one saved request. You will use them at steps 8 and 17.

---

## 42.1 The eighteen steps

For each step: what you click, what the UI does, which API is called, what the backend does, what changes in the database, and the question the examiner is most likely to ask right there.

---

### Step 1 — Register a customer

**Click:** Register → fill name, email, password, mobile, gender, address, city → select "Customer" → Submit.

**Frontend:** `Register.jsx` posts `formData`; on success it navigates to `/login`.

**API:** `POST /api/auth/register` — public, no token.

**Backend:** `registerUser` checks for an existing email, hashes the password with `bcrypt.hash(password, 10)`, sanitises the role with `role === "seller" ? "seller" : "customer"`, and creates the document.

**Database:** a new document in `users`. `password` is a 60-character bcrypt hash. `status` defaults to `"active"`.

**Likely question:** "What if I had sent `role: 'admin'` in the body?"
**Answer:** "The ternary would resolve it to `customer`. Only the two literal values are reachable through this endpoint, so admin accounts have to be created directly in the database."

---

### Step 2 — Log in as the customer

**Click:** enter the email and password → Login.

**Frontend:** `Login.jsx` posts, then stores `localStorage.setItem("token", ...)` and `localStorage.setItem("user", JSON.stringify(...))`, then navigates by role — `/admin`, `/bidder` or `/customer`.

**API:** `POST /api/auth/login`.

**Backend:** finds the user by email, runs `bcrypt.compare`, signs `jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1d" })`, returns the token plus a user object with no password.

**Database:** nothing is written. Login is a read.

**Show them:** open DevTools → Application → Local Storage. Two keys. Then paste the token into jwt.io and show the payload — `id`, `role`, `iat`, `exp`, and no password.

**Likely question:** "Why is the payload readable?"
**Answer:** "Because a JWT is signed, not encrypted. Anyone can decode it; nobody can change it without the secret, because the signature would no longer match. That's exactly why I put only the id and role in there."

---

### Step 3 — Show the Axios interceptor working

**Click:** stay on the customer dashboard, open DevTools → Network → click any dashboard page.

**Point at:** the Request Headers on any `/api/...` call — `Authorization: Bearer eyJ...`.

**Say:** "I never write that header in any page. One interceptor in `api/axios.js` reads the token from localStorage and attaches it to every request, so around forty API calls are authenticated by one function."

**Likely question:** "What happens for the login request itself?"
**Answer:** "There's no token yet, so `if (token)` is false and the header is skipped. That's why the guard matters — without it a logged-out visitor would send `Bearer null` and `jwt.verify` would throw."

---

### Step 4 — Register and log in as a seller

**Click:** log out, register again with "Seller" selected, log in.

**Show:** the sidebar is different. `DashboardLayout` reads `demoNav[role]`, so one layout component renders three different navigations.

**Likely question:** "Is that the security?"
**Answer:** "No, it's the navigation. The security is that every seller-only endpoint declares `authorizeRoles('seller')` on the server. Hiding a link only stops accidents."

---

### Step 5 — Create a category (admin)

**Click:** switch to the admin window → Categories → Add → name and description → Save.

**API:** `POST /api/categories` with `protect` and `authorizeRoles("admin")`.

**Database:** a document in `categories`. `name` is unique, so adding the same name twice returns an error.

**Say:** "This is admin-only deliberately. If sellers could create categories, the taxonomy would fragment into twenty variations of the same thing."

---

### Step 6 — Add a product (seller)

**Click:** seller window → Add Product → name, description, starting price, pick the category → Submit.

**Frontend:** `AddProduct.jsx` first fetches `/categories` to fill the dropdown, then posts the product, then immediately posts an auction using the returned product's `_id`.

**API:** `POST /api/products` then `POST /api/auctions` — two sequential requests.

**Backend:** `createProduct` sets `seller: req.user.id` from the token, not from the body.

**Database:** one document in `products` with `seller` set to the seller's ObjectId, and one in `auctions` referencing it.

**Point out:** the note on the form saying image upload is not implemented. Say it before they ask.

**Likely question:** "What if the auction creation fails after the product is created?"
**Answer:** "You get an orphan product with no auction, because there's no rollback. Doing both writes inside a MongoDB transaction would fix it, and that needs a replica set. It's a real limitation and I know how to close it."

---

### Step 7 — Set the auction time carefully

**Click:** in the same form, set the start time to now or a minute ago and the end time a few minutes ahead.

**Say:** "If I set the start time in the future, the auction is created as `upcoming` and nobody can bid on it. The status updater will flip it to `live` within a minute of the start time."

**Likely question:** "What sets the status?"
**Answer:** "`updateAuctionStatuses`, running on a 60-second `setInterval` in `server.js` and again at the top of every `GET /api/auctions`. It uses `updateMany` with `$lte` and `$gt` comparisons against the current time."

---

### Step 8 — Verify in MongoDB Compass

**Click:** Compass → `Storagewars` → `products` → the new document. Then `users` → the seller.

**Show three things:**
- `products.seller` holds an ObjectId, and it matches the seller's `_id` in `users`.
- `users.password` is a bcrypt hash starting with `$2b$10$` — the `10` is the cost factor.
- `auctions.currentBid` is currently `0`.

**Say:** "This is why the relationship works. The product doesn't store the seller's name — it stores a pointer. `populate('seller', 'name email')` is what turns that pointer into a name when React reads it."

---

### Step 9 — Browse auctions as the customer

**Click:** customer window → Auctions in the navbar.

**Frontend:** `Auctions.jsx` fetches on mount and renders `AuctionCard` for each, with the `Timer` component counting down.

**API:** `GET /api/auctions` — note that this refreshes the statuses before returning.

**Say:** "The timer is purely presentational. It computes `new Date(endTime) - new Date()` in the browser every second. The authoritative check is on the server — `placeBid` compares the end time against the server clock, so a user with a wrong system time can't bid late."

---

### Step 10 — Place a bid

**Click:** open the auction → enter an amount above the current bid → Place Bid.

**API:** `POST /api/bids` — customer only.

**Backend:** the five validations in order — auction exists, you're not the seller, status is live, end time hasn't passed, amount exceeds `currentBid`. Then it creates a bid with `status: "pending"` and sets `auction.currentBid = Number(amount)`.

**Database:** a new document in `bids` with `bidder` from the token, and `auctions.currentBid` updated.

**Prove a validation:** try to bid the same amount again. The alert shows "Bid must be higher than current bid."

**Likely question:** "Why is `currentBid` updated before the seller approves?"
**Answer:** Give the honest answer from Part 40 — it means "highest placed", not "highest approved", rejecting doesn't roll it back, and the fix is to move that write into `updateBidStatus`. Volunteering this makes you look far stronger than being caught by it.

---

### Step 11 — Show the seller cannot bid on their own auction

**Click:** in the seller window, open their own auction.

**Say:** "The frontend doesn't show a bid form here, but the real protection is on the server: `placeBid` compares `auction.seller` with `req.user.id` and returns 400. Even a direct Postman call would be refused."

---

### Step 12 — Approve the bid (seller)

**Click:** seller window → Bids Received → find the pending bid → Approve.

**API:** `PATCH /api/bids/:bidId/status` with `{ status: "approved" }`.

**Backend:** validates the status value, loads the bid with `auction` and `auction.seller` populated, verifies the seller owns that auction, saves the new status, and then calls `Notification.create({ user: bid.bidder, message, type: "bid" })`.

**Database:** the bid's `status` changes, and a new document appears in `notifications`.

**Say:** "This is the only place in the entire application that creates a notification automatically."

**Likely question:** "Could another seller approve this bid?"
**Answer:** "No. The controller checks that the bid's auction's seller matches the token's user id. Being a seller isn't enough — you have to be *this* auction's seller. That's resource-level authorization, separate from the role check."

---

### Step 13 — Show the notification appear

**Click:** customer window → Notifications.

**API:** `GET /api/notifications` → `Notification.find({ user: req.user.id })`.

**Click:** mark it read → `PATCH /api/notifications/:id/read`.

**Say honestly:** "'Mark all as read' loops over the unread ones and fires one PATCH per notification through `Promise.all`. With three notifications that's fine; with three hundred it's three hundred requests. A single bulk endpoint using `updateMany` is the correct fix."

---

### Step 14 — Show My Bids

**Click:** customer window → My Bids.

**API:** `GET /api/bids/my` → `Bid.find({ bidder: req.user.id })`.

**Say:** "The filter comes from the verified token, not from a URL parameter, so there is no value a customer could change to see somebody else's bids."

**Be ready for:** the Winning/Outbid label. It compares the bid amount against `auction.currentBid`, which — as established in step 10 — tracks the highest *placed* bid. So the label is approximate, and a rejected bid still shows "Outbid". Say it before they spot it.

---

### Step 15 — Let the auction end

**Click:** wait for the end time to pass, then refresh the Auctions page.

**Say:** "The refresh triggers `GET /api/auctions`, which calls `updateAuctionStatuses` first, so the status flips to `completed` immediately rather than waiting up to sixty seconds for the interval."

---

### Step 16 — Show the winner (seller)

**Click:** seller window → Auction Results.

**API:** `GET /api/auctions/:id/winner` for each completed auction.

**Backend:** `Bid.findOne({ auction: id, status: "approved" }).sort({ amount: -1 })`.

**Say:** "Only approved bids are considered. A pending or rejected bid can never win, no matter how high it was. If nothing was approved, this returns 404 and the page shows 'No approved winner'."

**Mention:** "Each winner call is wrapped in its own try/catch inside the `Promise.all`, because a 404 on one auction would otherwise reject the whole batch and blank the page. That was an actual bug I hit."

---

### Step 17 — Prove authorization with Postman

**Click:** Postman → `POST http://localhost:5000/api/products` with a valid body, and the **customer's** token in the Authorization header.

**Result:** 403 "Access denied".

**Then:** swap in the seller's token → 201 Created.

**Then:** remove the header entirely → 401 "No token, authorization denied".

**Say:** "Same request, same body, three different outcomes decided entirely by the token. This is the demonstration that the security is on the server, not in the React interface."

**If you want the strongest version of this:** in the customer's browser, edit localStorage so `user.role` reads `"admin"`, refresh, and show the admin dashboard rendering — then show every one of its API calls returning 403. The UI is fooled; the API is not.

---

### Step 18 — Create the order (admin) and complete it (customer)

**Click:** admin window → Auction Listings → find the completed auction → Create Order.

**API:** `POST /api/orders/from-auction/:auctionId` — admin only.

**Backend:** checks the auction is completed, finds the highest approved bid, checks no order already exists for this auction, then creates one with buyer, seller, product and amount all derived server-side.

**Database:** a document in `orders` with `status: "pending"`.

**Then:** customer window → Won Auctions → Complete Order → `PATCH /api/orders/:id` sets `status: "confirmed"`.

**Say:** "Nothing in the request body decides who the buyer is or what the amount is — both come from the winning bid on the server. A client could not create an order in their own favour."

**Likely question:** "Is there payment?"
**Answer:** "No. 'Complete Order' only changes the status. There's no gateway, no invoice and no transaction record. Adding Razorpay with a server-side webhook to confirm payment is the first item in my future scope."

---

## 42.2 The three-minute version

If they give you three minutes, do steps 2, 10, 12, 16 and 17 — login, bid, approve, winner, and the Postman proof. That covers authentication, the core business rule, the approval workflow, the winner query and the authorization model, which is the whole project in miniature.

---

# PART 43 — PROJECT LIMITATIONS

Everything in the left column is verified in the code. Everything in the right column is a suggestion and is **not part of the current implementation**.

## 43.1 Functional gaps

| # | Current implementation | Possible improvement — not part of the current implementation |
|---|---|---|
| 1 | No image upload. `AddProduct.jsx` carries an explicit note; cards render "No image available". The model already has `images: [String]`. | `multer` for `multipart/form-data`, with Cloudinary or S3 for storage, saving the returned URLs into the existing array. |
| 2 | No payment gateway. "Complete Order" only sets `status: "confirmed"`. | Razorpay or Stripe with a server-side webhook confirming payment before the status changes. |
| 3 | No search or filter on the auctions page. Every auction is fetched and rendered. | A search input driving a backend query with `$regex` on the product name, plus category and status filters and pagination with `skip`/`limit`. |
| 4 | The Discounts page holds coupons in `useState` only. There is no model, controller or route. | A `Discount` model, admin CRUD endpoints, and validation applied at order creation. |
| 5 | No email on bid approval, auction end or order creation. Nodemailer is used only by Contact Us. | Reuse the existing transport in `updateBidStatus` and `createOrderFromAuction`. |
| 6 | No password reset or email verification. | A reset-token flow using the existing Nodemailer setup and a hashed, expiring token on the user document. |
| 7 | No admin Orders page, and `getOrders` gives an admin the buyer branch, so they see nothing. | A three-way condition returning `{}` for admin, plus an Orders page in the admin navigation. |
| 8 | No bid retraction and no auction cancellation by the seller. | A `cancelled` auction status and a soft-delete on bids, both with rules about when they are allowed. |

## 43.2 Correctness and data-integrity gaps

| # | Current implementation | Possible improvement — not part of the current implementation |
|---|---|---|
| 9 | `placeBid` sets `auction.currentBid` before approval, so it means "highest placed". Rejection does not roll it back. | Move the `currentBid` write into `updateBidStatus` so the field only ever reflects approved bids. |
| 10 | The Winning/Outbid label on My Bids compares against that same field, so it is approximate, and rejected bids display "Outbid". | Derive the label from the highest approved bid, which becomes correct automatically once #9 is fixed. |
| 11 | `placeBid` reads, compares and writes as three separate operations — a race condition under simultaneous bids. | `Auction.findOneAndUpdate({ _id, status: "live", currentBid: { $lt: amount } }, { $set: { currentBid: amount } })`, which makes the comparison atomic. |
| 12 | `AddProduct` performs two sequential writes with no rollback, so a failed auction creation leaves an orphan product. | A MongoDB transaction across both writes, which requires a replica set. |
| 13 | The watchlist has no compound unique index, so the same auction can be added twice. | `watchlistSchema.index({ user: 1, auction: 1 }, { unique: true })`. |
| 14 | `updateProduct` uses `Object.assign(product, req.body)`, allowing any field in the body to be written — including `seller`. | Destructure the permitted fields explicitly and assign only those. |
| 15 | `updateAuctionStatuses` is duplicated in `server.js` and `auctionController.js`, and the two copies have drifted apart. | One exported function in a shared utility, imported by both. |
| 16 | `Home.jsx` renders static `data.js` objects through `AuctionCard`, which builds `/auction/${_id}` — so those cards link to `/auction/undefined`. | Fetch real auctions on the home page, or give the demo objects an `_id`. |
| 17 | Reports bar heights are hardcoded at `80%`; only the count of bars and the tooltip are real. | Compute the maximum and set the height proportionally, or use a charting library. |
| 18 | Admin Dashboard "Revenue" is hardcoded `null` and Recent Activity is a static array of four strings. | Fetch `/api/reports` for revenue and build the activity feed from recent bids and orders. |
| 19 | The seller's total sales includes cancelled orders, while the admin report excludes them, so the two figures can disagree. | Apply the same non-cancelled filter in both places. |

## 43.3 Security gaps

| # | Current implementation | Possible improvement — not part of the current implementation |
|---|---|---|
| 20 | A blocked user can still log in. `loginUser` never reads `status`. | Check `user.status === "blocked"` in `loginUser` and return 403, and ideally re-check in `protect`. |
| 21 | Login returns 404 for an unknown email and 401 for a wrong password, which lets an attacker enumerate registered accounts. | Return the same 401 and the same message for both cases. |
| 22 | `JWT_SECRET` is a short, guessable literal in `.env`. | A long random secret generated with `crypto.randomBytes(64).toString("hex")`. |
| 23 | The token lives in localStorage, so any XSS can read it. | An `httpOnly`, `secure`, `sameSite` cookie, which then needs CSRF protection. |
| 24 | `cors()` is called with no options, allowing every origin. | An explicit origin whitelist from an environment variable. |
| 25 | No rate limiting anywhere, including on login. | `express-rate-limit`, applied most tightly to the auth routes. |
| 26 | Tokens last one day and cannot be revoked; logout only clears the client. | Short-lived access tokens plus refresh tokens, with a server-side revocation list. |
| 27 | The AI route concatenates user input into the prompt with no length limit and no per-user throttle. | A length cap, input sanitisation and rate limiting on `/api/ai`. |
| 28 | `.env` was included in the distributed zip even though `.gitignore` excludes it, exposing live credentials. | Ship `.env.example` with empty values and rotate any credential that has been shared. |

## 43.4 Architectural and performance gaps

| # | Current implementation | Possible improvement — not part of the current implementation |
|---|---|---|
| 29 | No indexes beyond `_id` and the two unique constraints, so `Bid.find({ auction })` is a collection scan. | Indexes on `bids.auction`, `bids.bidder`, `products.seller`, `auctions.seller` and `auctions.status`. |
| 30 | Several pages fetch a whole collection and filter in the browser — MyProducts, MyAuctions, the seller filter inside `getAllBids`. | Server-side queries scoped by `req.user.id`, and an aggregation with `$lookup` for the seller's bids. |
| 31 | No pagination anywhere. | `skip` and `limit` with a total count returned alongside. |
| 32 | The same `try/catch` returning `{ message: err.message }` is repeated in roughly thirty-five controller functions. | A global error-handling middleware plus an async wrapper, so controllers call `next(err)`. |
| 33 | No response interceptor, so an expired token produces an alert rather than a redirect to login. | A response interceptor that clears localStorage and redirects on 401. |
| 34 | Around eleven frontend files set the Authorization header manually even though the interceptor already does it. | Remove the duplicates and rely on the interceptor alone. |
| 35 | No real-time updates; a new bid appears only on refresh. | Socket.IO, emitting to an auction-specific room on each accepted bid. |
| 36 | The AI assistant has no access to the database and will invent answers about live auctions. | Query the relevant collections and inject the results into the prompt as context. |
| 37 | `index.html` opens with `<Link>` instead of `<head>`, which browsers recover from but which is invalid markup. | Correct the tag. |
| 38 | The Axios `baseURL` and the Mongo URI are hardcoded to localhost. | Read both from environment variables so the same build works in production. |

---

# PART 44 — FUTURE SCOPE

Ordered by what you should say first if asked "what's next?" — technical correctness before new features.

**1. Atomic bid updates.** The most important one, because it's a correctness issue rather than a missing feature. Replace the read-compare-write in `placeBid` with a single conditional `findOneAndUpdate`, so MongoDB performs the comparison and the update as one operation and two simultaneous bids can never both succeed.

**2. Approval-driven `currentBid`.** Move the `currentBid` write out of `placeBid` and into `updateBidStatus`, so the field means "highest approved bid". This fixes the My Bids labelling as a side effect and makes rejection roll the price back correctly.

**3. Real-time bidding with Socket.IO.** Join a room per auction on the detail page, emit on every accepted bid, and update the current price and bid list without a refresh. This is the single change that would most change how the platform feels to use.

**4. Payment gateway.** Razorpay or Stripe on order completion, with a server-side webhook confirming the payment before the status changes — never trusting a client-side success callback.

**5. Cloud image upload.** `multer` on the backend to accept `multipart/form-data`, Cloudinary or S3 for storage, and the returned URLs written into the existing `images` array. The data layer is already shaped for it.

**6. Search, filtering and pagination.** A backend query supporting a `$regex` name search plus category and status filters, with `skip` and `limit` and a total count. Necessary before the auctions page holds more than a few dozen items.

**7. Database indexes.** On `bids.auction`, `bids.bidder`, `products.seller`, `auctions.seller` and `auctions.status`. Every one of those fields is queried on a hot path and none of them is indexed today.

**8. Email notifications beyond Contact Us.** The Nodemailer transport already exists — reuse it to email a bidder when their bid is approved or rejected, a seller when their auction ends, and a buyer when an order is created.

**9. Refresh tokens and proper session handling.** Short-lived access tokens with refresh tokens in httpOnly cookies, a server-side revocation list, and a response interceptor that redirects to login on 401 rather than showing an alert.

**10. Rate limiting and a CORS whitelist.** `express-rate-limit` applied most tightly to the auth and AI routes, and an explicit origin list read from an environment variable.

**11. Global error handling.** One error-handling middleware plus an async wrapper, removing the same `try/catch` from thirty-five controller functions and giving consistent status codes across the whole API.

**12. A data-aware AI assistant.** Query live auctions, the user's own bids and their order history, and inject that as context into the Gemini prompt. That turns a generic help bot into something that can answer "what am I currently winning?" — and it's a genuine retrieval-augmented generation pattern rather than a gimmick.

**13. Deployment.** Frontend on Vercel or Netlify, backend on Render or Railway, database on MongoDB Atlas, with the three hardcoded values moved to environment variables first.

**14. Admin analytics.** Replace the hardcoded bar heights and the null revenue figure with real aggregations, and add category-wise performance and a seller leaderboard.

**15. Mobile application.** React Native consuming the same REST API without backend changes — one of the practical benefits of having built a stateless JSON API rather than server-rendered pages.

---

# PART 45 — FINAL CHEAT SHEET

Ten lines per topic. Read this on the morning of the viva.

## 45.1 The project

1. Storage Wars is a full-stack MERN online auction platform.
2. Three roles: admin, seller, customer — stored as an enum on the user document.
3. Nine MongoDB collections, twelve route groups, roughly forty-plus endpoints.
4. Backend: Node, Express 5, Mongoose 9, MongoDB at `mongodb://localhost:27017/Storagewars`.
5. Frontend: React 18, React Router 7, Axios, Tailwind, Vite, lucide-react.
6. Core cycle: product → auction → bids → seller approval → winner → order.
7. Bids are `pending` until the seller approves; only approved bids can win.
8. Auctions move `upcoming → live → completed` automatically on a timer.
9. Extras: watchlist, notifications, admin reports, contact-form email, Gemini AI assistant.
10. Everything runs locally; it is not deployed.

## 45.2 Architecture

1. Three tiers: React client, Express API, MongoDB.
2. Client and server are separate processes on ports 5173 and 5000; CORS bridges them.
3. All communication is JSON over REST — no server-rendered HTML.
4. Request path: React → Axios instance → Express route → `protect` → `authorizeRoles` → controller → Mongoose model → MongoDB, and back.
5. Routes only declare paths and middleware; all logic lives in controllers.
6. The one exception is `aiRoutes.js`, which contains its logic inline.
7. Models define schema, validation and relationships; nothing is embedded.
8. Middleware sits between the route match and the controller.
9. The frontend holds no global state — each page fetches what it needs.
10. Node is single-threaded but non-blocking, so one process serves many users.

## 45.3 Authentication

1. Register: `bcrypt.hash(password, 10)`, role sanitised to seller or customer.
2. Login: `bcrypt.compare`, then `jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1d" })`.
3. The payload holds only `id`, `role`, `iat` and `exp` — never the password.
4. A JWT is signed, not encrypted: readable by anyone, forgeable by nobody without the secret.
5. The frontend stores the token and the user object in localStorage.
6. The Axios request interceptor attaches `Authorization: Bearer <token>` when a token exists.
7. `protect` splits the header, calls `jwt.verify`, and sets `req.user = decoded`.
8. Three failure paths, all 401: no header, wrong scheme, invalid or expired token.
9. Logout clears both localStorage keys — the token itself remains valid until it expires.
10. Known gaps: a blocked user can still log in; login returns 404 vs 401, enabling enumeration.

## 45.4 Authorization

1. Two questions, two layers: `protect` asks "who are you?" (401); `authorizeRoles` asks "what may you do?" (403).
2. `authorizeRoles` is a higher-order function using a rest parameter, so it is *called* in the route.
3. `protect` is passed by reference; `authorizeRoles("seller")` is invoked immediately.
4. A third layer lives inside controllers: ownership checks.
5. `String(product.seller) !== String(req.user.id)` — both sides converted, because one is an ObjectId.
6. Being a seller does not make you *the* seller of this product.
7. `req.user` always comes from the verified token, never from the request body.
8. `ProtectedRoute` on the frontend is user experience, not security.
9. Editing localStorage fools the UI; every API call still returns 403.
10. Sellers create products; admins cannot, because `createProduct` sets `seller: req.user.id`.

## 45.5 MongoDB and Mongoose

1. MongoDB is a document database; collections hold BSON documents.
2. `_id` is a 12-byte ObjectId containing a timestamp, so `_id` order roughly equals creation order.
3. Mongoose adds schema, type casting, validation, `populate` and middleware.
4. Every relationship is a stored ObjectId with `ref`, resolved on read.
5. `populate` is not a database join — Mongoose issues a second query with `$in` and merges in Node.
6. `$lookup` inside an aggregation pipeline is the real server-side join.
7. `reportController` is the only place using aggregation: `$match`, `$group`, `$sum`, `$month`.
8. `unique: true` creates a unique index, on `users.email` and `categories.name`.
9. Enums enforce valid values for role, status and order status.
10. No indexes beyond those two and `_id` — a known performance gap.

## 45.6 The auction lifecycle

1. Three statuses: `upcoming`, `live`, `completed`.
2. `updateAuctionStatuses` uses `updateMany` with `$lte` and `$gt` on the current time.
3. It runs on a 60-second `setInterval` in `server.js`.
4. It also runs at the top of every `GET /api/auctions`, so a page refresh forces an update.
5. The function is duplicated in two files and the copies have drifted — a known issue.
6. The frontend `Timer` component is presentational only.
7. The authoritative time check is on the server, inside `placeBid`.
8. Both the status and the end time are checked, because the interval leaves a 60-second window.
9. An auction is created `upcoming` if the start time is in the future.
10. A completed auction with no approved bid has no winner and produces no order.

## 45.7 The bid flow

1. `POST /api/bids` is customer-only.
2. Five validations: auction exists → not your own auction → status live → not ended → amount exceeds `currentBid`.
3. The bid is created with `status: "pending"` and `bidder: req.user.id`.
4. `auction.currentBid` is set immediately — so it means "highest placed", not "highest approved".
5. The seller approves or rejects with `PATCH /api/bids/:bidId/status`.
6. That controller verifies the bid's auction belongs to the requesting seller.
7. On the status change it calls `Notification.create` — the only automatic notification in the app.
8. `GET /api/bids/my` filters by `req.user.id`, so nobody can request another user's bids.
9. The winner is `Bid.findOne({ auction, status: "approved" }).sort({ amount: -1 })`.
10. Known issue: read-compare-write is not atomic, so simultaneous bids race.

## 45.8 Orders

1. The real path is `POST /api/orders/from-auction/:auctionId`, admin only.
2. It requires the auction to be `completed`.
3. Buyer, seller, product and amount are all derived server-side from the winning bid.
4. A duplicate check ensures one auction yields at most one order.
5. Order status is an enum: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`.
6. The customer "completes" an order by patching it to `confirmed`.
7. There is no payment, no invoice and no transaction record.
8. `getOrders` filters by seller for a seller and by buyer otherwise — so an admin sees nothing.
9. Won Auctions and Orders query the same thing and differ only in populated fields.
10. The generic `POST /api/orders` exists but no page in the UI calls it.

## 45.9 The API

1. Base URL `http://localhost:5000/api`, hardcoded in `api/axios.js`.
2. Twelve route files mounted in `server.js` with `app.use(prefix, router)`.
3. Only four endpoints are public: register, login, contact and the AI route.
4. Everything else requires `protect`; most also require `authorizeRoles`.
5. Status codes used: 200, 201, 400, 401, 403, 404, 500.
6. 401 means "not authenticated"; 403 means "authenticated but not permitted".
7. `GET /api/auctions` requires a token, even though `/auctions` is a public React route — a known inconsistency.
8. Route order matters: `/my` is declared before `/:auctionId` in `bidRoutes.js`.
9. Several endpoints exist but are unused by the UI, including generic order creation.
10. Every controller ends with the same `try/catch` returning `{ message: err.message }`.

## 45.10 AI, email and testing

1. `POST /api/ai` takes a message, wraps it in a fixed system prompt, and calls Gemini.
2. It uses `ai.models.generateContent({ model: "gemini-3.6-flash", contents })` and reads `response.text`.
3. `aiRoutes.js` imports no Mongoose model — the assistant is **not** database-aware.
4. The API key stays in `.env` on the server; the browser never sees it.
5. Contact Us saves the document first, then sends via Nodemailer over Gmail SMTP.
6. `replyTo` is set to the visitor's address so a reply from the inbox reaches them.
7. It authenticates with a Gmail App Password, because Google blocks plain-password SMTP.
8. Postman testing: the same request with three different tokens gives 201, 403 and 401.
9. Compass verification: the password is a hash, `seller` matches the token's user id, the notification exists.
10. Debugging order: Network tab → status code → `error.response.data` → Postman → Compass.

---

# PART 46 — ONE-LINE DEFINITIONS

## Stack and runtime

| Term | Definition |
|---|---|
| **MERN** | MongoDB, Express, React, Node — a JavaScript stack covering database, server, client and runtime. |
| **Node.js** | A JavaScript runtime built on the V8 engine that lets JavaScript run outside a browser. |
| **Express** | A minimal web framework for Node that provides routing and middleware. |
| **React** | A component-based JavaScript library for building user interfaces from state. |
| **MongoDB** | A document-oriented NoSQL database that stores BSON documents in collections. |
| **Mongoose** | An ODM for MongoDB adding schemas, validation, casting and `populate`. |
| **Vite** | A build tool and dev server using native ES modules for fast startup and hot reload. |
| **Tailwind CSS** | A utility-first CSS framework where styling is applied through class names. |
| **npm** | Node's package manager, which installs dependencies and runs scripts. |
| **nodemon** | A development tool that restarts the Node process when a source file changes. |

## Server-side concepts

| Term | Definition |
|---|---|
| **Middleware** | A function receiving `(req, res, next)` that runs between the request and the handler. |
| **`next()`** | The call that passes control to the next middleware in the chain. |
| **Router** | An isolated Express mini-application holding its own route stack, mounted at a prefix. |
| **Controller** | A function containing the business logic for one endpoint. |
| **Model** | A Mongoose object defining a collection's schema and providing query methods. |
| **Route** | A mapping of an HTTP method and path to a middleware chain and handler. |
| **REST API** | An HTTP interface where resources have URLs and methods express intent. |
| **Endpoint** | One specific method-and-path combination in an API. |
| **`req.body`** | The parsed request payload, available only because `express.json()` runs first. |
| **`req.params`** | The named values captured from dynamic URL segments such as `/:id`. |
| **`req.user`** | A custom property set by `protect` holding the decoded token payload. |
| **CORS** | A browser mechanism controlling which origins may call an API. |
| **Environment variable** | A configuration value read from `process.env`, kept out of source code. |
| **`dotenv`** | A package that loads key-value pairs from a `.env` file into `process.env`. |
| **Event loop** | Node's mechanism for handling many concurrent operations on a single thread. |
| **Non-blocking I/O** | Input and output that does not halt execution while waiting for a result. |
| **Higher-order function** | A function that takes or returns another function — for example `authorizeRoles`. |
| **Rest parameter** | The `...args` syntax collecting remaining arguments into an array. |

## Database concepts

| Term | Definition |
|---|---|
| **Collection** | A group of MongoDB documents, roughly equivalent to a SQL table. |
| **Document** | A single BSON record, roughly equivalent to a SQL row. |
| **BSON** | MongoDB's binary JSON format, supporting extra types such as ObjectId and Date. |
| **ObjectId** | A 12-byte unique identifier, displayed as 24 hex characters, containing a timestamp. |
| **Schema** | A Mongoose definition of a document's fields, types and rules. |
| **`ref`** | Schema metadata naming the model an ObjectId points to, enabling `populate`. |
| **`populate`** | Replacing a stored ObjectId with the referenced document at read time. |
| **`$lookup`** | MongoDB's aggregation-stage server-side join. |
| **Aggregation pipeline** | An ordered sequence of stages transforming documents, used in `reportController`. |
| **`$match`** | A pipeline stage that filters documents. |
| **`$group`** | A pipeline stage that groups documents and computes accumulators such as `$sum`. |
| **Index** | A data structure that speeds up queries on a field. |
| **`unique: true`** | A schema option that creates a unique index and rejects duplicates. |
| **Enum** | A schema constraint restricting a field to a fixed list of values. |
| **`timestamps: true`** | A schema option adding `createdAt` and `updatedAt` automatically. |
| **Referencing** | Storing a pointer to another document rather than copying its contents. |
| **Embedding** | Storing a sub-document inside its parent — not used in this project. |
| **Atomic operation** | An operation that completes entirely or not at all, with no visible intermediate state. |
| **Race condition** | A bug where the outcome depends on the timing of concurrent operations. |
| **CastError** | A Mongoose error raised when a value cannot be converted to the schema's type. |

## Security concepts

| Term | Definition |
|---|---|
| **Authentication** | Establishing who a user is. |
| **Authorization** | Determining what an authenticated user is permitted to do. |
| **JWT** | A signed, self-contained token carrying claims in three Base64 parts. |
| **Payload** | The claims section of a JWT — here `id`, `role`, `iat` and `exp`. |
| **Signature** | The HMAC of the header and payload, verifying integrity. |
| **`jwt.sign`** | Creates and signs a token. |
| **`jwt.verify`** | Checks the signature and expiry, throwing on failure. |
| **Bearer token** | An HTTP auth scheme where possessing the token grants access. |
| **Hashing** | A one-way transformation that cannot be reversed to recover the input. |
| **Salt** | Random data mixed into a hash so identical inputs produce different outputs. |
| **bcrypt** | A deliberately slow salted hashing algorithm designed for passwords. |
| **Cost factor** | Bcrypt's work parameter — 10 here, meaning 2¹⁰ rounds. |
| **Stateless authentication** | Verification requiring no server-side session store. |
| **Ownership check** | Confirming the requesting user owns the specific resource being modified. |
| **Mass assignment** | A vulnerability where unvetted request fields are written to a document. |
| **XSS** | Cross-site scripting — injected script running in the user's browser. |
| **Rate limiting** | Capping how many requests a client may make in a period. |
| **App Password** | A revocable 16-character Google credential for a single application. |

## Frontend concepts

| Term | Definition |
|---|---|
| **Component** | A reusable function returning JSX. |
| **JSX** | JavaScript syntax that looks like HTML and compiles to `React.createElement`. |
| **Props** | Read-only data passed from a parent component to a child. |
| **State** | Data owned by a component that triggers a re-render when it changes. |
| **`useState`** | The hook returning a value and its setter. |
| **`useEffect`** | The hook for side effects such as data fetching. |
| **Dependency array** | The second argument to `useEffect` controlling when it re-runs. |
| **Hook** | A function letting a functional component use React features. |
| **Key** | A stable identifier helping React match list elements across renders. |
| **Controlled input** | An input whose value comes from state and writes back on change. |
| **Conditional rendering** | Showing markup based on a condition, typically with `&&` or a ternary. |
| **Spread operator** | `...` — copies properties into a new object, used for immutable state updates. |
| **Computed property name** | `[expression]` as an object key, evaluated at runtime. |
| **Lifting state up** | Moving state to a common parent so siblings can share it. |
| **SPA** | Single-page application — one HTML document with client-side routing. |
| **Client-side routing** | Changing views without a full page reload. |
| **`BrowserRouter`** | The router using the HTML5 History API. |
| **`Outlet`** | The placeholder where a layout route renders its matched child. |
| **Layout route** | A parent route with no path, used to wrap several children. |
| **`Navigate`** | A component that redirects when rendered. |
| **`useNavigate`** | The hook for programmatic navigation. |
| **`useParams`** | The hook reading dynamic URL segments. |
| **`useLocation`** | The hook returning the current location object. |
| **Axios** | A promise-based HTTP client supporting interceptors and instances. |
| **Interceptor** | A function running on every request or response passing through an Axios instance. |
| **`baseURL`** | A prefix prepended to every relative request path in an Axios instance. |
| **localStorage** | Synchronous, string-only, origin-scoped browser storage that persists across sessions. |
| **`JSON.stringify` / `JSON.parse`** | Convert a JavaScript value to a JSON string and back. |
| **`Promise.all`** | Runs promises concurrently and rejects if any one rejects. |
| **`Promise.allSettled`** | Runs promises concurrently and always resolves with each outcome. |
| **Optional chaining** | `?.` — safely accesses a property that may be `undefined`. |
| **Template literal** | Backtick string syntax supporting `${}` interpolation. |

---

# PART 47 — INTERVIEW SIMULATION

Fifty questions in the order a real interview tends to move: warm-up, then frontend, then backend, then the hard ones. The answers are written the way a candidate should actually speak — first person, specific, and honest about limits.

---

**1. Introduce yourself and your project.**
"I'm a final-year student and my project is Storage Wars, a full-stack online auction platform on the MERN stack. It has three roles — admin, seller and customer — and it covers the complete cycle: a seller lists a product and opens an auction on it, customers bid within a time window, the seller approves or rejects each bid, and the highest approved bid becomes the winner, which an admin converts into an order. I built the frontend, the backend and the database design myself."

**2. Why did you name it Storage Wars?**
"It's inspired by storage-unit auctions, where people bid on a locker without fully knowing what's inside. That uncertainty is what makes an auction interesting, and it gave me a clear domain to model."

**3. What is the MERN stack?**
"MongoDB for the database, Express as the web framework, React for the interface and Node as the runtime. The appeal for me was one language across all four layers — I write the same async/await and the same array methods on both sides of the request."

**4. How many collections do you have?**
"Nine: users, categories, products, auctions, bids, orders, watchlists, notifications and contacts. Everything relates through stored ObjectIds, nothing is embedded."

**5. Walk me through your folder structure.**
"The backend has config, models, controllers, routes and middlewares, with `server.js` at the root wiring them together. The frontend has pages for public routes, component for shared UI, and dashboards split into admin, bidder and customer folders. One thing I'd rename: the seller dashboard folder is called 'bidder', which is confusing — it was a naming decision I made early and didn't correct."

**6. Class components or functional?**
"Functional throughout, with hooks. `useState` and `useEffect` cover everything I needed, and the router hooks handle navigation. There isn't a single class component in the project."

**7. Which hooks did you use?**
"`useState`, `useEffect`, `useNavigate`, `useParams` and `useLocation`. I didn't use `useContext`, `useMemo`, `useCallback` or `useReducer` — no component tree got deep enough to need Context, and nothing does computation expensive enough to justify memoisation."

**8. How do you fetch data in a component?**
"`useEffect` with an empty dependency array, and an async function defined inside it that I call immediately. The effect itself can't be async because React expects its return value to be a cleanup function, not a promise."

**9. What happens if you leave out the dependency array?**
"The effect runs after every render. Since my effects set state, that would trigger another render, which runs the effect again — an infinite loop that hammers the API."

**10. Why do lists need keys?**
"So React can tell which element is which between renders. I use the MongoDB `_id`, which is stable and unique. Without keys, React re-renders by position, and if you delete an item from the middle, the wrong rows update."

**11. Show me a component you're proud of.**
"`DataTable`. It takes headers, rows and an `actions` render function, and it's used on ten different pages across all three dashboards. Each page supplies its own buttons through that render prop, but the table markup exists once."

**12. How is routing set up?**
"`BrowserRouter` wraps the app in `main.jsx`, and the whole route table is in `App.jsx` — eight public routes, three protected groups and a catch-all. I use `Link` for navigation and `useNavigate` when I need to redirect in code, like after login."

**13. How do protected routes work?**
"A layout route with no path, whose element is my `ProtectedRoute` component. It reads the token and user from localStorage. No token means `<Navigate to='/login' />`. A token with the wrong role means a redirect to that user's own dashboard. Otherwise it returns `<Outlet />`, which is where the matched child route renders."

**14. Is that secure?**
"No, and I want to be clear about that. Anyone can open DevTools and change `role` to `admin` in localStorage — the admin UI would render. But every API call it makes still carries the original signed token, which says customer, so they all return 403. The frontend guard is about user experience; the security is on the server."

**15. Why Axios instead of fetch?**
"The interceptor. One function in `api/axios.js` reads the token and sets the Authorization header on every request. With `fetch` I'd be writing that in about forty places, and forgetting it once produces a silent 401 that's annoying to trace."

**16. Walk me through your interceptor.**
"It's registered on an Axios instance with `baseURL` set to `http://localhost:5000/api`. On each request it reads `localStorage.getItem('token')`, and if a token exists it sets `config.headers.Authorization = 'Bearer ' + token`, then returns config. The `if` matters — register, login and contact are public, and sending `Bearer null` would make `jwt.verify` throw."

**17. Do you have a response interceptor?**
"No, and that's a gap I'd fix first. Right now an expired token shows an alert on whatever page you're on. It should clear localStorage and redirect to login."

**18. What is middleware in Express?**
"A function with `(req, res, next)` that runs between the route matching and the controller. It either calls `next()` to pass control on, or ends the request with a response. I have two custom ones — `protect` and `authorizeRoles`."

**19. Explain your `protect` middleware.**
"It reads the Authorization header, checks it starts with 'Bearer', splits on the space to get the token, calls `jwt.verify` with the secret, and sets `req.user` to the decoded payload before calling `next()`. Three things return 401: no header, wrong scheme, or a verify failure — which covers both a tampered token and an expired one."

**20. Explain `authorizeRoles`.**
"It's a higher-order function. It takes a rest parameter of allowed roles and returns the actual middleware, which checks whether `req.user.role` is in that list and returns 403 if not. That's why in the route I write `authorizeRoles('seller')` with parentheses but `protect` without — one is called immediately to produce a middleware, the other is already one."

**21. Why must `protect` run before `authorizeRoles`?**
"Because `authorizeRoles` reads `req.user.role`, and `req.user` only exists after `protect` sets it. Reversed, it would throw on `undefined.role`."

**22. Difference between 401 and 403?**
"401 is 'I don't know who you are' — no token or a bad one. 403 is 'I know exactly who you are and you're not allowed' — a valid customer token hitting a seller-only route."

**23. Walk me through registration.**
"The controller checks whether the email already exists, hashes the password with `bcrypt.hash(password, 10)`, sanitises the role with a ternary that only ever yields 'seller' or 'customer', creates the document, and returns the user without the password field."

**24. So how do you create an admin?**
"Manually, in MongoDB Compass. That ternary means there's no request body that produces an admin through the API. It's deliberate — self-registering admins would be an obvious hole."

**25. Walk me through login.**
"Find the user by email, `bcrypt.compare` the submitted password against the stored hash, then `jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1d' })`. I return the token plus a user object, and the frontend stores both and navigates by role."

**26. Why bcrypt rather than SHA-256?**
"Two reasons. Bcrypt salts automatically, so two users with the same password get different hashes and rainbow tables don't help. And it's deliberately slow — the cost factor of 10 means 2¹⁰ rounds — so brute-forcing a leaked database is expensive. SHA-256 is fast, which is exactly the wrong property for a password hash."

**27. What's in your JWT?**
"`id`, `role`, and the automatic `iat` and `exp`. Nothing else. The payload is Base64-encoded, not encrypted — you can paste any of my tokens into jwt.io and read it — so it holds the minimum needed for authorization and nothing sensitive."

**28. If it's readable, why is it safe?**
"Because it's signed. The signature is an HMAC of the header and payload using my secret. Change one character of the payload and the recomputed signature no longer matches, so `jwt.verify` throws. Forging one would require `JWT_SECRET`, which only exists in `.env` on the server."

**29. What if the token expires?**
"`jwt.verify` throws `TokenExpiredError`, the catch in `protect` returns 401, and the controller never runs. Mine last a day. Being honest, my frontend handles that badly — it just alerts. Refresh tokens plus a response interceptor is the proper answer."

**30. How does logout work?**
"It removes both localStorage keys and navigates to login. There's no API call, because there's no server-side session to destroy. The token stays technically valid until it expires — that's the trade-off of stateless auth, and revocation would need a server-side denylist."

**31. Why MongoDB rather than MySQL?**
"The data is document-shaped — a product has an array of image URLs, which MongoDB stores natively without a join table. And my schema changed during development; I added status fields partway through, and there were no migrations to write. The honest trade-off is no foreign-key enforcement — nothing at the database level stops a bid referencing a deleted auction, so my controllers guard defensively."

**32. What does Mongoose actually give you?**
"Structure. Raw MongoDB would happily store `amount: 'hello'` on a bid. My schema declares it as a Number with a minimum of zero, so that's rejected. Plus enums on role and status, `populate` for relationships, and the aggregation helpers I use in reports."

**33. Is `populate` a join?**
"Not at the database level. Mongoose runs my main query, collects the ObjectIds it found, issues a second query with `$in`, and merges the results in Node. MongoDB's actual server-side join is `$lookup` in an aggregation pipeline."

**34. Where do you use aggregation?**
"Only in `reportController`. There's a `$match` filtering out cancelled orders, then `$group` with `_id: null` and `$sum` on amount for total sales, and a second pipeline grouping by `$month` for the monthly breakdown."

**35. Walk me through placing a bid.**
"`POST /api/bids`, customer only. Five validations run in order: the auction exists, the bidder isn't the auction's seller, the status is live, the end time hasn't passed, and the amount is higher than the current bid. Then it creates the bid with `status: 'pending'` and `bidder: req.user.id`, and updates the auction's `currentBid`."

**36. Why check both the status and the end time?**
"Because the status updater runs on a 60-second interval, so an auction can still read 'live' for up to a minute after it actually ended. The explicit clock comparison closes that window."

**37. Why is `currentBid` updated before the seller approves?**
"That's an implementation flaw and I'd rather name it than have you find it. It means the field tracks the highest bid *placed*, not the highest *approved*. So rejecting a bid doesn't roll the price back, and my My Bids page can label a bid 'Outbid' when it's actually still the top approved one. The winner query is unaffected because it filters on approved status directly. The fix is to move that write into `updateBidStatus`."

**38. Two customers bid at the same instant. What happens?**
"There's a race condition. `placeBid` reads the auction, compares, then writes — three separate steps. If a second request reads between the first one's read and write, it validates against a stale `currentBid` and both get accepted. The fix is to make it one atomic operation: `findOneAndUpdate` with a filter of `currentBid: { $lt: amount }`, so MongoDB does the comparison and the update together and the loser just gets `null` back."

**39. How is the winner determined?**
"`Bid.findOne({ auction: id, status: 'approved' }).sort({ amount: -1 })`. Highest approved bid, one query. If no bid was approved it returns 404 and the seller's results page shows 'No approved winner'."

**40. Why does a bid need approval at all?**
"It gives the seller control over who they transact with. In a physical auction the auctioneer can refuse a bidder. It was a deliberate business rule from my design document, and it's why the bid model has a status enum rather than just an amount."

**41. What if a seller never approves anything?**
"The auction ends with no winner, and no order can be created. That's the intended consequence, but it does mean an inattentive seller can waste an auction with ten bids on it. A reasonable improvement would be auto-approving the highest bid at the end unless the seller explicitly rejected it."

**42. Where do notifications come from?**
"Exactly one place — `updateBidStatus` calls `Notification.create` after saving the new status. Nothing else in the application creates one. There are no notifications for an auction going live or an order being created, and I'd add those."

**43. How are orders created?**
"`POST /api/orders/from-auction/:auctionId`, admin only. It checks the auction is completed, finds the highest approved bid, checks no order already exists for that auction, and creates one with the buyer, seller, product and amount all derived server-side from that bid. Nothing in the request body influences who wins or what they pay."

**44. Can an admin see all orders?**
"No, and it's a bug. `getOrders` uses a two-way condition — sellers get their own, everyone else gets orders where they're the buyer. So an admin falls into the buyer branch and normally sees an empty list. A three-way condition returning an empty filter for admin would fix it in one line."

**45. Is there a payment gateway?**
"No. 'Complete Order' changes the status from pending to confirmed and nothing else — no payment, no invoice, no transaction record. Adding Razorpay with a server-side webhook is the first thing on my future scope, and the webhook matters because you can't trust a client-side success callback."

**46. Tell me about the AI assistant.**
"There's a floating chat on every page. It posts to my own `/api/ai` endpoint, which wraps the message in a system prompt and calls Gemini Flash through the official SDK. The key lives in `.env` on the server so it can't be taken from the browser. What I'll say clearly is that it isn't database-aware — `aiRoutes.js` doesn't import a single model. It can explain how bidding works; ask it what's live right now and it will make something up. Making it real would mean querying the auctions collection and injecting that into the prompt."

**47. How does the contact form send email?**
"It saves the document to MongoDB first, then creates a Nodemailer transport for Gmail using credentials from `.env` and sends. `from` and `to` are both my account, with `replyTo` set to the visitor's address, so hitting reply in the inbox actually reaches them. Saving before sending means a message is never lost if SMTP fails — though I don't currently tell the user that the email part failed, which I should."

**48. Describe a bug you spent real time on.**
"The one that cost me the most was an `id` versus `_id` mismatch. My login response returns `user.id`, but every document coming back from a populated query uses `_id`. So my 'my products' filter was comparing a real value against `undefined` and returning an empty list, with no error anywhere. I found it by logging both sides of the comparison. The lesson was that a silent empty result is harder to debug than a crash, and I started logging both operands whenever a filter returns nothing."

**49. What are the main limitations of your project?**
"Four that matter. `currentBid` updating before approval, which makes one UI label unreliable. The bid race condition. A blocked user can still log in, because `loginUser` never reads the status field. And there's no image upload — the model has an `images` array ready for it, but there's no multer or cloud storage, so the cards show a placeholder. Beyond those it's not deployed, has no indexes, no rate limiting and no pagination."

**50. If you had two more weeks, what would you build?**
"I'd spend the first few days on correctness rather than features — atomic bid updates, moving `currentBid` to approval, the blocked-user check, and indexes on the fields I query on every request. Then Socket.IO for real-time bidding, because that's the change that would most affect how the platform actually feels. Then image upload, since the data model is already shaped for it. Features are easy to add later; a race condition in the core business rule is the thing I'd want fixed first."

---

## 47.1 How to handle the three hardest moments

**When you don't know something.** Say so, then show your reasoning: "I haven't used transactions in this project, but my understanding is they need a replica set, and I'd use one around the two writes in Add Product because that's where I currently have an orphan-record risk." An honest answer with a direction beats a confident wrong one every time.

**When they find a bug you didn't mention.** Don't defend it. "You're right, that's a real problem — here's why it happens and here's what I'd change." An examiner testing whether you understand your own code will be satisfied by that; they will not be satisfied by an excuse.

**When they push on something you already admitted.** Stay consistent. If you said `currentBid` is a flaw, don't drift into defending it two questions later. The whole value of volunteering a limitation is that it demonstrates you know your code — contradicting yourself undoes that.

---

# PART 48 — PRESENTATION AND DELIVERY NOTES

## 48.1 How to speak about the project

Use the first person and be specific. "I built" and "I chose" carry more weight than "the system provides". When you name a technology, immediately say what it does *in your project*: not "I used JWT for authentication", but "I used JWT because my API is stateless — the token carries the user id and role, so verifying a request is a signature check with no session lookup."

Name real files. "That check is in `productController.js`, in `updateProduct`" is far stronger than "there's a check in the backend". It signals that you wrote the code rather than assembled it.

Give a number wherever one exists. Nine collections. Three roles. Five validations on a bid. Ten salt rounds. One-day token expiry. Sixty-second status interval. Numbers are memorable and they are checkable, which is exactly why they read as credible.

## 48.2 Answer structure

For a "what" question, one sentence then the detail. For a "why" question, state the reason, then the alternative you rejected, then the trade-off you accepted. That three-part shape is what distinguishes someone who made a decision from someone who followed a tutorial.

For a "what if" question, answer with the actual behaviour first — the status code, the message, what the user sees — and only then discuss what you would change.

Keep the first answer short. Examiners ask follow-ups; a long first answer invites interruption and often answers a question they weren't asking.

## 48.3 On admitting limitations

Volunteer them before they are found. There is a large difference between "I know `currentBid` updates before approval and here's why that's wrong" and being caught by it. The first reads as engineering judgement; the second reads as not understanding your own code.

Always pair a limitation with the fix. "It's a race condition, and `findOneAndUpdate` with a conditional filter would make it atomic" is a complete answer. "It's a race condition" alone sounds like something you were told.

Keep the two categories separate in your language. Say "in my current implementation" for what exists and "a possible improvement, not part of what I built" for what doesn't. Never let a planned feature slide into the present tense.

## 48.4 Practical points for the day

Start the database, then the backend, then the frontend, in that order. Have all three terminal windows visible so a failure is obvious rather than mysterious.

Have your three logins written down. Fumbling a password while an examiner watches costs more composure than it should.

Keep the demo linear. Steps 2, 10, 12, 16 and 17 of Part 42 cover authentication, bidding, approval, the winner and the authorization proof — that is the whole project, and it fits in a few minutes.

Remember the two traps in your own UI: do not click the Home page auction cards, and do not open the Auctions page while logged out.

If something breaks live, narrate the diagnosis rather than clicking randomly. "That's a 401, so the token isn't reaching the server — let me check the request headers" turns a failure into a demonstration of how you debug.

---

# PART 49 — DOCUMENT COVERAGE SUMMARY

| Parts | Coverage |
|---|---|
| 1–4 | Introduction, spoken intros at four lengths, architecture, technology stack, setup |
| 5–11 | Frontend: structure, React fundamentals and intermediate topics, routing, authentication, Axios, authorization |
| 12–13 | Backend architecture, MongoDB and Mongoose |
| 14–25 | Every module traced through real code: users, categories, products, auctions, bids, orders, watchlist, notifications, reports, dashboards, contact, AI |
| 26–28 | Complete API reference, seven request lifecycles, multi-user architecture |
| 29–32 | Security, error handling, Postman testing, Compass verification |
| 33–35 | Real development problems, design decisions, database relationships |
| 36–37 | File-by-file explanation, line-level concept explanation |
| 38–40 | Interview question bank, "why did you use" answers, cross questions |
| 41–42 | 22-slide presentation script, 18-step demonstration script |
| 43–44 | Limitations, future scope |
| 45–47 | Cheat sheet, one-line definitions, 50-question interview simulation |
| 48–50 | Delivery notes, coverage summary, closing note |

## 49.1 The ten facts to be certain of

If you remember nothing else from this document, remember these, because they are the ones most likely to be tested.

1. The JWT payload contains `id` and `role` only, signed with `JWT_SECRET`, expiring in one day.
2. `protect` verifies the token and sets `req.user`; `authorizeRoles` checks the role; controllers check ownership. Three layers.
3. Passwords are hashed with `bcrypt.hash(password, 10)` and never returned in any response.
4. Registration cannot create an admin — the role is sanitised with a ternary.
5. A bid passes five validations, is created as `pending`, and only an approved bid can win.
6. The winner is `Bid.findOne({ auction, status: "approved" }).sort({ amount: -1 })`.
7. Auction statuses change via `updateAuctionStatuses`, on a 60-second interval and on every `GET /api/auctions`.
8. Orders are created by an admin from a completed auction, with every field derived server-side.
9. `ProtectedRoute` is user experience; the server-side middleware is the security.
10. The AI assistant is not database-aware, and `currentBid` reflects the highest *placed* bid, not the highest approved one.

---

# PART 50 — CLOSING NOTE

## 50.1 What this document is

Everything in it was derived by reading the actual source of your project — every controller, model, route, middleware and React component. Where the code does something well, it says so. Where the code has a gap, it says that too, in the same voice, without softening it and without treating it as a disqualification.

Every suggestion is marked as a possible improvement and separated from what exists. That separation is deliberate: the fastest way to lose credibility in a viva is to describe a planned feature in the present tense and then be asked to demonstrate it.

## 50.2 What actually makes a project defence strong

Not the absence of flaws. Every real codebase has them, and an examiner who has read a hundred student projects knows that. What distinguishes a strong defence is that the candidate can point at their own flaws, explain why they exist, and describe the fix in concrete terms.

Storage Wars gives you a lot to be straightforward about. The authorization model is genuinely well-built — three layers, with ownership checks that many student projects skip entirely. Passwords are handled correctly. Secrets are in environment variables. Order creation derives every field server-side, which is exactly right. The bid approval workflow is a real business rule implemented properly, not a CRUD form with extra steps.

And it has real gaps: a race condition in the core bidding path, a field that means something slightly different from what its name suggests, a status field that is set but never enforced, and a chart with hardcoded heights. Knowing all four, and knowing the fix for all four, is what turns a project you built into a project you understand.

## 50.3 One thing to do before you present

The archive you shared contains `backend/.env` with a live Gemini API key and a Gmail App Password. `.gitignore` kept them out of version control, but zipping the folder included them anyway.

Revoke the App Password in your Google account, regenerate the Gemini key, and put a `.env.example` with empty values in the project instead. It takes five minutes, and it is also a good thing to be able to mention if anyone asks how you handle secrets.

---