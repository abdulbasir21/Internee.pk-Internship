<div align="center">

# 🎓 Coursebound

**Learn something worth finishing.**

A full-stack MERN Learning Management System with free & premium courses,
unlocked through real Stripe Checkout payments.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?logo=stripe&logoColor=white)](https://stripe.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

</div>

---

## ✨ Overview

**Coursebound** is a two-role learning platform:

- 🧑‍🎓 **Students** sign up, browse a public course catalog, and unlock premium courses with a one-time Stripe payment.
- 🛠️ **Admins** (seeded, not self-registered) create, edit, and delete courses, and track orders and revenue from a dashboard.

The core engineering problem it solves is **content gating** — anyone can browse the catalog, but a course's real lesson content is only released once a student is authenticated *and* proven to own it (free course, or a Stripe payment confirmed via webhook).

---

## 🚀 Features

| | |
|---|---|
| 🔐 **JWT Authentication** | Stateless auth for students and admins, with bcrypt-hashed passwords |
| 🎯 **Role-based Access** | Students vs. Admins, enforced entirely server-side |
| 💳 **Stripe Checkout** | Real one-time payments for premium courses, hosted on Stripe's page |
| 🪝 **Verified Webhooks** | Course access is unlocked only after Stripe's signed webhook confirms payment |
| 🔒 **Content Gating** | Premium lesson content is excluded at the database-query level unless the requester owns it |
| 🖥️ **Admin Dashboard** | Create/edit/delete courses, view live stats: total courses, revenue, orders paid |
| 📱 **Responsive UI** | Tailwind CSS, mobile-first tables/cards, skeleton loading states |

---

## 🧱 Tech Stack

**Frontend**
`React 18` · `Vite` · `React Router v6` · `Tailwind CSS` · `Axios` · `lucide-react`

**Backend**
`Node.js` · `Express` · `MongoDB` + `Mongoose` · `JWT` · `bcryptjs` · `Stripe SDK`

---

## 🏗️ Architecture

```
┌─────────────┐        REST / JSON        ┌──────────────┐        ┌─────────────┐
│   React      │ ───────────────────────▶  │   Express     │ ─────▶ │   MongoDB    │
│   (Vite)     │ ◀───────────────────────  │   API         │ ◀───── │   (Atlas)    │
└─────────────┘                            └──────┬───────┘        └─────────────┘
                                                    │
                                                    ▼
                                            ┌───────────────┐
                                            │  Stripe        │
                                            │  Checkout +    │
                                            │  Webhooks      │
                                            └───────────────┘
```

**Payment unlock flow:**

```
Student clicks Unlock
        │
        ▼
POST /api/payment/stripe/create-session  →  Stripe Checkout Session created
        │                                    (Order saved as "pending")
        ▼
Redirect to Stripe's hosted checkout page
        │
        ▼
Stripe → POST /api/webhooks/stripe (signed event)
        │
        ▼
Signature verified → Order marked "paid" → course added to
                       student's purchasedCourses
```

> 🔑 The course is unlocked by the **verified webhook**, never by the browser simply landing on the success page.

---

## 📂 Project Structure

```
client/
├─ src/
│  ├─ components/
│  │  ├─ admin/        # CourseForm, CourseTable, DeleteConfirmModal, StatsCard
│  │  ├─ courses/      # CourseCard, CourseGrid, PaymentModal, PremiumBadge
│  │  ├─ layout/       # Navbar, Footer, ProtectedRoute
│  │  └─ ui/           # Button, Card, Input, Modal, Loader, Skeleton, EmptyState
│  ├─ context/          # AuthContext.jsx
│  ├─ pages/            # Home, CourseDetail, Login, Signup, MyCourses,
│  │                     # AdminDashboard, PaymentSuccess, PaymentCancel, NotFound
│  ├─ services/api.js   # all backend calls (Axios instance)
│  ├─ App.jsx
│  └─ main.jsx
└─ package.json

server/
├─ config/db.js          # MongoDB connection
├─ controllers/          # auth, course, payment controllers
├─ middleware/           # protect, isAdmin, hasPurchased
├─ models/                # User, Course, Order
├─ routes/                # auth, course, payment, webhook, admin
├─ utils/validators.js
├─ index.js               # app entry point
├─ seed.js                # seeds demo courses
├─ adminSeed.js           # seeds the one admin account
└─ package.json
```

---

## 🔌 API Reference

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| `POST` | `/api/auth/signup` | Public | Register a student |
| `POST` | `/api/auth/login` | Public | Log in (student or admin) |
| `GET` | `/api/courses` | Public | List all courses *(no content)* |
| `GET` | `/api/courses/:id` | Public / conditional | Course detail; content if owned or free |
| `POST` | `/api/courses` | Admin | Create a course |
| `PATCH` | `/api/courses/:id` | Admin | Update a course |
| `DELETE` | `/api/courses/:id` | Admin | Delete a course |
| `POST` | `/api/payment/stripe/create-session` | Student | Start Stripe Checkout |
| `POST` | `/api/webhooks/stripe` | Stripe only | Confirm payment, unlock course |
| `GET` | `/api/admin/orders` | Admin | List all orders & revenue |

---

## 🗄️ Data Models

<details>
<summary><b>User</b></summary>

```js
{
  name: String,
  email: String,        // unique
  password: String,     // bcrypt hash
  role: 'admin' | 'student',
  purchasedCourses: [ObjectId → Course],
  createdAt: Date
}
```
</details>

<details>
<summary><b>Course</b></summary>

```js
{
  title: String,
  description: String,
  category: String,
  price: Number,
  isFree: Boolean,
  content: [String],    // one paragraph per array entry
  previewImage: String, // external URL
  createdBy: ObjectId → User,
  createdAt: Date
}
```
</details>

<details>
<summary><b>Order</b></summary>

```js
{
  studentId: ObjectId → User,
  courseId: ObjectId → Course,
  amountPaid: Number,
  paymentId: String,    // Stripe session id
  status: 'pending' | 'paid' | 'failed',
  createdAt: Date
}
```
</details>

---

## ⚙️ Getting Started

### Prerequisites
- Node.js
- A MongoDB connection string (e.g. MongoDB Atlas)
- A Stripe account (test mode keys are fine)

### 1. Clone & install

```bash
git clone <repo-url>
cd coursebound

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

**`server/.env`**
```env
PORT=5000
CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

**`client/.env`**
```env
VITE_API_BASE_URL=http://localhost:5000
```

> ⚠️ Never commit real `.env` values. Use `.env.example` as a template and rotate any keys that were exposed.

### 3. Seed the database

```bash
cd server
npm run seed:admin   # creates the one admin account
npm run seed         # seeds demo courses
```

### 4. Run it

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Visit **http://localhost:5173** 🎉

### 5. Test the payment flow

Use [Stripe test cards](https://stripe.com/docs/testing) (e.g. `4242 4242 4242 4242`) and forward webhooks locally with the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

---

## 🔒 Security Notes

- Passwords hashed with **bcrypt** (10 salt rounds) — never stored in plaintext.
- JWTs signed server-side; role is never trusted from client input.
- No admin signup route — the only admin account is created by `adminSeed.js`.
- Premium `content` is excluded at the **database query level**, not just in the response.
- Stripe webhook signatures are verified against the raw request body before any data is trusted.
- Course access is granted via `$addToSet` — idempotent even if Stripe redelivers an event.

---

## 🗺️ Roadmap

- [ ] Dedicated "my purchased courses" endpoint
- [ ] Automated tests (Jest + Supertest)
- [ ] Real image upload support (S3 / Cloudinary)
- [ ] Pagination & search on the course catalog
- [ ] Rate limiting on auth routes
- [ ] Refund handling via additional Stripe webhook events

---

<div align="center">

Built as part of **Internee.pk** — Task 6

</div>
