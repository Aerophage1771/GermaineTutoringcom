# GermaineTutoring.com — Premium LSAT Tutoring Website

> A full-stack web application for **Germaine Washington's LSAT Tutoring** practice — featuring a public marketing site, an authenticated student dashboard, an LSAT question practice platform, a blog CMS, and an admin management panel.

![TypeScript](https://img.shields.io/badge/TypeScript-95.3%25-blue)
![MDX](https://img.shields.io/badge/MDX-4%25-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
  - [Public Marketing Site](#public-marketing-site)
  - [Student Dashboard](#student-dashboard)
  - [LSAT Practice Platform](#lsat-practice-platform)
  - [Blog CMS](#blog-cms)
  - [Admin Panel](#admin-panel)
- [Pages & Routes](#pages--routes)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [External Integrations](#external-integrations)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)

---

## Overview

GermaineTutoring.com is a premium LSAT tutoring website built for Germaine Washington, a perfect 180 LSAT scorer. The application serves two primary audiences:

1. **Prospective students** — A polished marketing site that showcases tutoring methodology, programs, results, a strategy blog, and Calendly-integrated scheduling.
2. **Enrolled students** — An authenticated dashboard with session tracking, time management, LSAT question practice, test simulation, progress analytics, and a problem log.

The site also includes a full **admin panel** for managing students, sessions, problem logs, and blog content.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite 5** | Build tool & dev server |
| **Wouter** | Client-side routing |
| **Tailwind CSS 3** | Utility-first styling with custom theme |
| **Radix UI / shadcn/ui** | Accessible component primitives |
| **TanStack Query v5** | Server state management & caching |
| **React Hook Form + Zod** | Form handling & validation |
| **Framer Motion** | Animations & transitions |
| **Recharts** | Data visualization & charts |
| **TipTap** | Rich text editor (blog CMS) |
| **Lucide React / React Icons** | Iconography |
| **react-markdown** | Markdown rendering with remark plugins |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js + Express** | HTTP server & API |
| **TypeScript** | Type safety |
| **Drizzle ORM** | Database ORM & query builder |
| **Neon Database** | Serverless PostgreSQL |
| **express-session** | Session-based authentication |
| **bcrypt** | Password hashing |
| **Zod** | Input validation |
| **multer** | File uploads (blog images) |
| **sharp** | Image processing & optimization |
| **sanitize-html** | HTML sanitization for blog content |

---

## Project Structure

```
GermaineTutoringcom/
├── client/                     # Frontend React application
│   ├── index.html              # HTML entry point (Calendly widget, Font Awesome, Google Fonts)
│   └── src/
│       ├── main.tsx            # React DOM render entry
│       ├── App.tsx             # Root component — providers & router
│       ├── index.css           # Global styles & Tailwind theme configuration
│       ├── components/         # Shared UI & section components
│       │   ├── ui/             # shadcn/ui component library (30+ components)
│       │   ├── Header.tsx      # Site header with navigation & Calendly integration
│       │   ├── Footer.tsx      # Site footer
│       │   ├── HeroSection.tsx # Landing page hero
│       │   ├── AboutSection.tsx
│       │   ├── MethodologySection.tsx
│       │   ├── ProgramsSection.tsx
│       │   ├── ResultsSection.tsx
│       │   ├── CTASection.tsx
│       │   ├── FAQSection.tsx
│       │   ├── MainNavigation.tsx  # Authenticated sidebar navigation
│       │   └── ScrollToTop.tsx
│       ├── hooks/              # Custom React hooks
│       │   ├── use-auth-redirect.ts
│       │   ├── use-mobile.ts
│       │   ├── use-toast.ts
│       │   └── use-seo.ts
│       ├── lib/                # Utility modules
│       │   ├── auth.tsx        # AuthProvider context & authentication logic
│       │   ├── queryClient.ts  # TanStack Query client & apiRequest helper
│       │   └── utils.ts        # General utilities (cn, etc.)
│       └── pages/              # Route-level page components
│           ├── Home.tsx
│           ├── Blog.tsx
│           ├── BlogPost.tsx
│           ├── MethodologyResults.tsx
│           ├── Programs.tsx
│           ├── Login.tsx
│           ├── Dashboard.tsx
│           ├── TrainMe.tsx
│           ├── ExploreTests.tsx
│           ├── ExploreQuestions.tsx
│           ├── SimulateTests.tsx
│           ├── SimulateTestInterface.tsx
│           ├── PracticeTest.tsx
│           ├── PracticeRC.tsx
│           ├── QuestionPractice.tsx
│           ├── QuestionSetCreator.tsx
│           ├── CustomSets.tsx
│           ├── ProblemLog.tsx
│           ├── LearningLibrary.tsx
│           ├── Progress.tsx
│           ├── AdminDashboard.tsx
│           ├── AdminBlog.tsx
│           └── not-found.tsx
├── server/                     # Backend Express application
│   ├── index.ts                # Server entry point, middleware setup, port binding
│   ├── routes.ts               # All API route definitions (~1,050 lines)
│   ├── storage.ts              # Database storage layer / data access (~750 lines)
│   ├── db.ts                   # Drizzle + Neon database connection
│   ├── blog.ts                 # Legacy MDX blog post loader (superseded by DB CMS)
│   └── vite.ts                 # Vite dev server integration
├── shared/                     # Shared between client & server
│   └── schema.ts               # Drizzle ORM schema definitions & Zod validation types
├── posts/                      # Legacy MDX blog posts
├── public/                     # Static assets (favicon, images)
├── attached_assets/            # Uploaded/attached media assets
├── scripts/                    # Utility scripts (DB seeding, data import)
├── package.json                # Dependencies & npm scripts
├── vite.config.ts              # Vite configuration with path aliases
├── tailwind.config.ts          # Tailwind CSS theme & plugin configuration
├── tsconfig.json               # TypeScript configuration
├── drizzle.config.ts           # Drizzle Kit configuration for DB migrations
├── postcss.config.js           # PostCSS configuration
└── components.json             # shadcn/ui component configuration
```

---

## Features

### Public Marketing Site

- **Landing Page** — Hero section, About (tutor bio), Methodology ("Define, Demonstrate, Duplicate"), Programs, Results/testimonials, FAQ, CTA, and Footer
- **Methodology & Results** — Detailed teaching philosophy with proven score improvement data
- **Programs** — Three tiered tutoring packages:
  - 4-Hour Starter ($639)
  - 12-Hour Standard ($1,599)
  - 36-Hour Intensive ($3,359)
- **Blog** — SEO-optimized LSAT strategy blog with category filtering, tag system, search, comments, social sharing, and estimated read times
- **Calendly Integration** — Embedded popup widget for scheduling free initial consultations and booking tutoring sessions (60-min, 90-min, 2-hour options)
- **Email Subscription** — Newsletter sign-up form
- **Consultation Requests** — Lead capture form with score goals and test date

### Student Dashboard

- **Session Management** — View past tutoring sessions with dates, summaries, durations, and video links
- **Time Tracking** — Monitor remaining tutoring hours, bonus test review time
- **Time Add-Ons** — Purchase additional tutoring hours
- **Quick Actions** — One-click session booking via Calendly, access to practice tools, learning library, and problem log
- **Practice Activity Log** — History of all practice sessions with scores and details

### LSAT Practice Platform

- **Train Me** — Smart practice mode with AI-generated drill sets based on performance and weak areas
- **Explore Questions** — Browse and filter the entire LSAT question database by type, difficulty, prep test, section, and more
- **Explore Tests** — Browse available prep tests
- **Simulate Tests** — Full-length timed test simulation with a LawHub-style interface including:
  - Section-by-section navigation
  - Countdown timer
  - Question flagging
  - Answer grid overview
  - Score calculation
- **Practice Test (LR)** — Dedicated Logical Reasoning question practice
- **Practice RC** — Dedicated Reading Comprehension passage practice
- **Question Set Creator** — Build custom question sets from the database
- **Custom Sets** — Manage and review saved question sets
- **Problem Log** — Track mistakes with fields for correct reasoning, student flaws, and rules for future reference
- **Progress** — Analytics dashboard with performance charts and trend tracking
- **Learning Library** — Organized study resources and concept materials

### Blog CMS

- **Rich Text Editor** — TipTap-powered editor with toolbar for formatting, headings, lists, blockquotes, links, image uploads, and more
- **Draft/Publish/Scheduled Workflow** — Posts support `draft`, `published`, and `scheduled` statuses with automatic publishing
- **SEO Fields** — Custom slugs, meta descriptions, excerpts, and featured images
- **Image Uploads** — Multer-based image upload with Sharp optimization
- **HTML Sanitization** — All blog content is sanitized via `sanitize-html` before storage
- **Comments** — Public commenting system on blog posts
- **Social Sharing** — Share buttons for Twitter/X, Facebook, LinkedIn, and copy link

### Admin Panel

- **Student Management** — Create, edit, and delete student accounts; reset passwords; adjust time balances
- **Session Management** — Create, edit, and delete tutoring session records for any student
- **Problem Log Management** — View and manage student problem log entries
- **Blog Management** — Full CRUD for blog posts, including image uploads and scheduled publishing
- **Role-Based Access** — Admin middleware protects all admin routes; auto-seeded admin account on first run

---

## Pages & Routes

### Public Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing page with all marketing sections |
| `/methodology` | MethodologyResults | Teaching methodology & results |
| `/results` | MethodologyResults | Results (shared component with methodology) |
| `/programs` | Programs | Tutoring program packages & pricing |
| `/blog` | Blog | Blog listing with category filters & search |
| `/blog/:slug` | BlogPost | Individual blog post with comments & sharing |
| `/login` | Login | Student/admin login form |

### Authenticated Student Routes

| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard | Student home — sessions, time, quick actions |
| `/train-me` | TrainMe | Smart practice hub with training options |
| `/explore-questions` | ExploreQuestions | Browse LSAT questions with filters |
| `/explore-tests` | ExploreTests | Browse available prep tests |
| `/simulate-tests` | SimulateTests | Test simulation selection |
| `/simulate-test/:testNumber` | SimulateTestInterface | LawHub-style timed test simulation |
| `/practice-test` | PracticeTest | Logical Reasoning question practice |
| `/practice-rc` | PracticeRC | Reading Comprehension passage practice |
| `/question-practice` | QuestionPractice | General question practice mode |
| `/create-set` | QuestionSetCreator | Build custom question sets |
| `/custom-sets` | CustomSets | Manage saved question sets |
| `/problem-log` | ProblemLog | Mistake tracking & reflection |
| `/learning-library` | LearningLibrary | Study resources & concepts |
| `/progress` | Progress | Performance analytics & charts |

### Admin Routes

| Route | Page | Description |
|---|---|---|
| `/admin/dashboard` | AdminDashboard | Student, session, and problem log management |
| `/admin/blog` | AdminBlog | Blog post listing & management |
| `/admin/blog/new` | AdminBlog | Create new blog post |
| `/admin/blog/edit/:id` | AdminBlog | Edit existing blog post |

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login with email/username & password |
| `POST` | `/api/auth/logout` | Destroy session |
| `GET` | `/api/auth/me` | Get current authenticated user |

### Dashboard (Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/sessions` | Get user's tutoring sessions |
| `POST` | `/api/dashboard/sessions` | Create a new session record |
| `GET` | `/api/dashboard/problem-log` | Get user's problem log entries |
| `POST` | `/api/dashboard/problem-log` | Create a problem log entry |
| `DELETE` | `/api/dashboard/problem-log/:id` | Delete a problem log entry |
| `GET` | `/api/dashboard/practice-activities` | Get user's practice activities |
| `POST` | `/api/dashboard/practice-activities` | Record a practice activity |
| `GET` | `/api/dashboard/time-addons` | Get user's time add-ons |
| `POST` | `/api/dashboard/time-addons` | Purchase a time add-on |

### LSAT Questions (Public/Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/lsat/questions` | Browse questions with filters, search & pagination |
| `GET` | `/api/lsat/lr-questions` | Browse Logical Reasoning questions |
| `GET` | `/api/lsat/rc-questions` | Browse Reading Comprehension questions |
| `GET` | `/api/lsat/random` | Get random questions (count, sectionType, difficulty) |
| `GET` | `/api/lsat/prep-test/:prepTest` | Get all questions for a prep test |
| `GET` | `/api/lsat/prep-test/:prepTest/section/:section` | Get questions for a specific section |
| `GET` | `/api/lsat/browse` | Legacy browse endpoint |

### Practice Sets (Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/practice/sets` | Get user's custom practice sets |
| `POST` | `/api/practice/sets` | Create a custom practice set |
| `GET` | `/api/practice/set/:id` | Get a specific practice set |
| `POST` | `/api/practice/smart-drill` | Generate AI-based smart drill set |
| `POST` | `/api/practice/activity` | Log a practice activity result |

### Blog (Public)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/blog/posts` | List all published blog posts |
| `GET` | `/api/blog/posts/:slug` | Get a single published post by slug |
| `GET` | `/api/blog/posts/:slug/comments` | Get comments for a post |
| `POST` | `/api/blog/posts/:slug/comments` | Submit a comment on a post |

### Blog Admin (Admin Only)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/blog/posts` | List all posts (including drafts) |
| `GET` | `/api/admin/blog/posts/:id` | Get a post by ID for editing |
| `POST` | `/api/admin/blog/posts` | Create a new blog post |
| `PUT` | `/api/admin/blog/posts/:id` | Update a blog post |
| `DELETE` | `/api/admin/blog/posts/:id` | Delete a blog post |
| `POST` | `/api/admin/upload` | Upload an image for blog content |

### Admin Management (Admin Only)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/users` | List all students |
| `POST` | `/api/admin/users` | Create a student account |
| `PUT` | `/api/admin/users/:id` | Update student details & time balance |
| `DELETE` | `/api/admin/users/:id` | Delete a student account |
| `PUT` | `/api/admin/users/:id/password` | Reset a student's password |
| `GET` | `/api/admin/users/:id/sessions` | Get sessions for a specific student |
| `POST` | `/api/admin/sessions` | Create a session for a student |
| `PUT` | `/api/admin/sessions/:id` | Update a session |
| `DELETE` | `/api/admin/sessions/:id` | Delete a session |
| `GET` | `/api/admin/users/:id/problem-log` | Get problem log for a student |

### Public Lead Capture

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/subscribe` | Email newsletter subscription |
| `POST` | `/api/consultation` | Consultation booking request |

### Database Schema

The application uses **PostgreSQL** (via Neon serverless) with **Drizzle ORM**. All schemas are defined in `shared/schema.ts`.

| Table | Description |
|---|---|
| `users` | Student/admin accounts with session counts, time tracking (remaining hours, bonus test review time) |
| `sessions` | Tutoring session records — date, summary, duration, optional video link |
| `problem_log` | Student mistake tracking — prep test, section, question, correct reasoning, flaw analysis, rules |
| `practice_sets` | Custom question sets created by students — name, type (LR/RC), question IDs (JSON) |
| `question_details` | Full LSAT question content — stimulus text, answer choices, correct answer, explanations |
| `practice_activities` | Practice/test result records — type, scores, time spent, detailed answer data, filters used |
| `time_addons` | Purchased tutoring time add-ons — hours added, type, price paid |
| `subscribers` | Email newsletter sign-ups — name, email |
| `consultations` | Consultation booking requests — contact info, current/goal scores, test date |
| `blog_posts` | Blog CMS — title, slug, HTML content, excerpt, featured image, meta description, tags, status (draft/published/scheduled), timestamps |
| `blog_comments` | Blog post comments — post slug, author name, comment text, timestamps |
| `lsat_questions` | Combined LSAT question metadata (all section types) |
| `lr_questions` | Optimized Logical Reasoning questions — question type, skills, difficulty |
| `rc_questions` | Optimized Reading Comprehension questions — passage data, categories, difficulty |

### Entity Relationships

- `users` → has many `sessions`, `problem_log`, `practice_activities`, `time_addons`, `practice_sets`
- `blog_posts` → has many `blog_comments` (linked via `post_slug`)

---

## External Integrations

| Service | Purpose |
|---|---|
| **Neon / Supabase Postgres** | Serverless PostgreSQL hosting |
| **Calendly** | Embedded scheduling widget for consultations & session booking |
| **Google Fonts** | Typography — Merriweather (headings) & Open Sans (body) |
| **Font Awesome 6** | Additional iconography |
| **Cloudflare CDN** | Font Awesome delivery |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**
- **PostgreSQL** database (Neon or Supabase recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/Aerophage1771/GermaineTutoringcom.git
cd GermaineTutoringcom

# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env

# Push database schema
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`. Both the API and client are served from the same port.

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start development server with hot reload (tsx + Vite) |
| `build` | `npm run build` | Build for production (Vite client build + esbuild server bundle) |
| `start` | `npm start` | Run production build |
| `check` | `npm run check` | TypeScript type checking |
| `db:push` | `npm run db:push` | Push Drizzle schema to database |

---

## Netlify Deployment

This repository includes a `netlify.toml` configuration so Netlify can build and publish the client app:

- **Build command:** `npm run build`
- **Publish directory:** `dist/public`
- **SPA routing fallback:** `/*` redirects to `/index.html`

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅* | PostgreSQL connection string (Neon format recommended) |
| `SUPABASE_DB_URL` | ✅* | Supabase PostgreSQL connection string (used when `DATABASE_URL` is not set) |
| `SESSION_SECRET` | ✅ | Secret key for express-session cookie signing |
| `NODE_ENV` | — | `development` or `production` (defaults to `development`) |

\* At least one of `DATABASE_URL` or `SUPABASE_DB_URL` must be set.

---

## License

This project is licensed under the **MIT License**. See `package.json` for details.
