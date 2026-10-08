# FoodHub — Premium Restaurant Ordering & Real-Time Delivery Tracking Platform

> **Engineered according to IEEE 830 SRS Specification v1.0**  
> Standalone, production-grade restaurant food ordering and real-time delivery tracking platform featuring 4 unified role-based surfaces, modular backend architecture, and high-fidelity motion design.

---

## 🌟 Highlights & Key Features

- **Four Integrated Surfaces in One Codebase**:
  1. **Customer Web App**: Discover iconic Mumbai restaurants, customize dishes, transparent bill breakdowns, 1-click checkout, and real-time satellite delivery tracking.
  2. **Kitchen Manager Dashboard (`/restaurant`)**: Live order Kanban terminal with sound/visual alerts, status progression, stock toggling, operating hour rules, and POS signed HMAC webhooks.
  3. **Delivery Partner App (`/courier`)**: Mobile-first dispatch UI with 30-second task countdowns, GPS route navigation, pickup/delivery handshake, and real-time simulator.
  4. **Admin Console (`/admin`)**: Platform oversight metrics, dispute resolution with 5-day statutory refund SLA clock, and security audit logs.
- **Editorial Brand Aesthetic**: Refined warm food-tech brand with Ember Saffron (`#E8590C`), Espresso Ink (`#14110F`), Herb Green (`#2F6B4F`), and warm off-white surfaces with dark mode.
- **Motion System**: Smooth scrolling powered by **Lenis ↔ GSAP ScrollTrigger**, alongside **Framer Motion** state transitions and micro-interactions.
- **Real-Time WebSockets**: Socket.IO authenticated rooms for 10-second GPS courier streaming, status progression, and in-app masked chat.
- **Bilingual Internationalization**: Instant English (`en`) and Hindi (`hi`) localization across all screens.
- **Zero-Dependency Quickstart**: Built-in SQLite local database and in-memory cache/queues with zero external service signup requirements, portable to PostgreSQL and Redis in Docker/production.

---

## 🚀 Quickstart (Running in Under 2 Minutes)

### Prerequisites
- **Node.js**: v20 or higher
- **npm**: v10 or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Rich Mumbai Dataset
Seeds ~30 Mumbai kitchens, authentic dishes, demo accounts, and an active live demo order:
```bash
npm run seed
```

### 3. Launch Development Servers
Starts both API (port `4000`) and React frontend (port `5173`):
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Documented Demo Credentials

All accounts use the password: `FoodHub@2026` (or use the 1-Click Quick Access panel on the `/account` page):

| Role | Email Identifier | Phone | Purpose |
|---|---|---|---|
| **Customer** | `customer@foodhub.in` | `9820044444` | Patron ordering, cart, live tracking, reviews |
| **Restaurant Owner** | `owner@foodhub.in` | `9820022222` | Kitchen Kanban, menu stock, analytics, webhooks |
| **Delivery Partner** | `courier@foodhub.in` | `9820033333` | Mobile delivery tasks, pickup & delivery confirm |
| **Administrator** | `admin@foodhub.in` | `9820011111` | Platform GMV, 5-day refund SLA tracker, audit logs |

---

## 🧪 Testing & Verification

Run the comprehensive test suite across shared, API, and web workspaces:
```bash
npm run test
```

Build the production bundles:
```bash
npm run build
```

---

## 📂 Repository Structure

```
foodhub/
├─ apps/
│  ├─ web/                      # React 18 + Vite + Tailwind + GSAP + Lenis + Leaflet
│  │  └─ src/
│  │     ├─ app/                # Router, Navbar, Footer, Providers
│  │     ├─ design-system/      # Button, Input, OTPInput, Badge, RatingStars, etc.
│  │     ├─ features/           # Discovery, Restaurant, Cart, Checkout, Tracking, Dashboard, etc.
│  │     ├─ lib/                # API client, Socket.io, Zustand stores, i18n
│  │     └─ motion/             # SmoothScrollProvider, presets, Reveal component
│  └─ api/                      # Modular Express + Socket.IO Monolith
│     ├─ prisma/                # Schema (SQLite dev & PostgreSQL prod)
│     └─ src/
│        ├─ adapters/           # Cache, PaymentGateway, SMS, Email, Geo, Webhooks
│        ├─ middleware/         # Auth JWT, RBAC ownership, Rate limiter, Error envelope
│        ├─ modules/            # Auth, Me, Restaurants, Cart, Orders, Tracking, Courier, Admin
│        ├─ sockets/            # Socket.IO room subscriptions & event broadcasting
│        └─ jobs/               # Nightly 7-day location purge & OTP cleanup crons
├─ packages/
│  └─ shared/                   # Zod schemas, TypeScript types, Haversine/Bill utils
├─ docs/                        # PLAN, DECISIONS, ARCHITECTURE, TRACEABILITY, USER_GUIDE, PERFORMANCE, DR
├─ k8s/                         # Production Kubernetes manifests
├─ docker-compose.yml           # Multi-container orchestration (api, web, postgres, redis)
└─ .github/workflows/ci.yml     # Automated CI pipeline
```

---

## 📋 SRS Requirements Traceability

Every IEEE 830 functional requirement (`REQ-1.1` through `REQ-6.3`) is verified and documented in [docs/TRACEABILITY.md](file:///c:/Users/amudh/Desktop/projects/se%20mini%20project/docs/TRACEABILITY.md).
