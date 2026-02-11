# GermaineTutoring.com - Premium LSAT Tutoring Website

## Overview
GermaineTutoring.com is a premium full-stack web application for Germaine Washington, an LSAT tutor with a perfect 180 score. The platform establishes credibility for prospective students and provides authenticated students with comprehensive practice tools, session tracking, and progress monitoring.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3 with custom theming and tailwindcss-animate
- **UI Components**: Radix UI primitives and shadcn/ui
- **State Management**: TanStack Query v5 for server state
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React, React Icons
- **Markdown**: react-markdown with remark-frontmatter

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules via tsx)
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with memorystore
- **API Design**: RESTful with JSON
- **Blog**: MDX files parsed with gray-matter

### Project Structure
```
client/
  src/
    components/       # Shared UI and section components
      ui/             # shadcn/ui component library
    hooks/            # Custom React hooks (use-auth-redirect, use-mobile, use-toast)
    lib/              # Utilities (auth context, blog helpers, query client)
    pages/            # Route-level page components
    index.css         # Global styles and Tailwind theme
    main.tsx          # App entry point
    App.tsx           # Router and providers
server/
  index.ts            # Express server entry point
  routes.ts           # API route definitions (~645 lines)
  storage.ts          # Database storage layer (~746 lines)
  db.ts               # Drizzle database connection
  blog.ts             # MDX blog post loader
  vite.ts             # Vite dev server integration (do not modify)
shared/
  schema.ts           # Drizzle ORM schema and Zod validation types
posts/                # MDX blog articles (6 posts)
public/               # Static assets (tutor photo)
scripts/              # Data import utilities
```

### Pages & Routes
- `/` — Home (Hero, About, Methodology, Programs, Results, FAQ, Guides, CTA, Footer)
- `/methodology` — Methodology & Results (Define, Demonstrate, Duplicate approach)
- `/results` — Results (redirects to methodology page)
- `/programs` — Tutoring Programs (4-Hour/$639, 12-Hour/$1,599, 36-Hour/$3,359)
- `/login` — Student login
- `/dashboard` — Authenticated student dashboard (sessions, time tracking, add-ons)
- `/train-me` — Practice hub with training options
- `/explore-questions` — Browse LSAT questions with filters
- `/explore-tests` — Browse prep tests
- `/simulate-tests` — Test simulation selection
- `/simulate-test/:testNumber` — LawHub-style timed test simulation
- `/practice-test` — LR question practice
- `/practice-rc` — RC passage practice
- `/question-practice` — Filtered question practice mode
- `/create-set` — Custom question set builder
- `/custom-sets` — Saved custom question sets
- `/problem-log` — Student problem log (track mistakes and reasoning)
- `/progress` — Practice activity history and performance stats
- `/learning-library` — Study resource library
- `/blog` — Blog listing
- `/blog/:slug` — Individual blog post

### Database Schema (PostgreSQL via Drizzle ORM)
- **users** — Student accounts with session counts and time tracking
- **sessions** — Tutoring session records (date, summary, duration, video link)
- **problem_log** — Student mistake tracking (correct reasoning, flaws, rules)
- **practice_sets** — Custom question sets created by students
- **question_details** — Full question content (text, choices, answers, explanations)
- **practice_activities** — Practice/test result records with scoring
- **time_addons** — Purchased tutoring time add-ons
- **subscribers** — Email newsletter sign-ups
- **consultations** — Consultation booking requests
- **lsat_questions** — Combined LSAT question metadata
- **lr_questions** — Logical Reasoning questions (optimized, separated table)
- **rc_questions** — Reading Comprehension questions (optimized, separated table)

### API Routes

**Authentication**
- `POST /api/auth/login` — Student login
- `POST /api/auth/logout` — Student logout
- `GET /api/auth/me` — Current authenticated user info (with time tracking)

**Public**
- `POST /api/subscribe` — Newsletter email subscription
- `POST /api/consultation` — Book a consultation request

**Dashboard (authenticated)**
- `GET /api/dashboard/sessions` — Get user's tutoring sessions
- `POST /api/dashboard/sessions` — Create tutoring session
- `GET /api/dashboard/problem-log` — Get user's problem log entries
- `POST /api/dashboard/problem-log` — Create problem log entry
- `PUT /api/dashboard/problem-log/:id` — Update problem log entry
- `DELETE /api/dashboard/problem-log/:id` — Delete problem log entry
- `GET /api/dashboard/practice-activities` — Get user's practice history
- `POST /api/dashboard/practice-activities` — Record practice activity
- `GET /api/dashboard/time-addons` — Get user's time add-ons
- `POST /api/dashboard/time-addons` — Purchase time add-on (updates user balance)

**LSAT Questions**
- `GET /api/lsat/questions` — Browse questions with details, filters, search, and pagination (public)
- `GET /api/lsat/lr-questions` — Browse Logical Reasoning questions with filters
- `GET /api/lsat/rc-questions` — Browse Reading Comprehension questions with filters
- `GET /api/lsat/random` — Get random LSAT questions (count, sectionType, difficulty params)
- `GET /api/lsat/prep-test/:prepTest` — Get all questions for a prep test
- `GET /api/lsat/prep-test/:prepTest/section/:section` — Get questions for a specific section
- `GET /api/lsat/browse` — Legacy browse endpoint (redirects to LR/RC tables)

**Practice (authenticated)**
- `GET /api/practice/sets` — Get user's custom practice sets
- `POST /api/practice/sets` — Create custom practice set
- `GET /api/practice/set/:id` — Get a specific practice set
- `POST /api/practice/smart-drill` — Create AI-generated smart drill set
- `POST /api/practice/activity` — Log a practice activity

**Blog (public)**
- `GET /api/blog/posts` — List all blog posts
- `GET /api/blog/posts/:slug` — Get single blog post by slug

### Key Features
- **Public-Facing Website**: Professional landing page with hero section, about (Calendly integration), methodology breakdown (Define/Demonstrate/Duplicate), 4-Hour/12-Hour/36-Hour program pricing, testimonials/results, FAQ accordion, study guide lead magnets, and CTA
- **Student Authentication**: Email/password login with Express sessions
- **Student Dashboard**: Session history, time remaining tracker, bonus test review time, time add-on purchases
- **LSAT Question Database**: 6,000+ questions across Logical Reasoning and Reading Comprehension with metadata (difficulty, type, skills, passage categories)
- **Practice Tools**: Filtered question browsing, custom set creation, LR and RC practice modes
- **Test Simulation**: LawHub-style timed test interface for PrepTests with section navigation and answer review
- **Problem Log**: Track mistakes with correct reasoning, student flaws, and rules for the future
- **Progress Tracking**: Practice activity history with performance statistics and charts
- **Learning Library**: Organized study resources
- **Blog**: MDX-powered articles on LSAT strategy and preparation
- **Responsive Design**: Mobile, tablet, and desktop layouts with custom Tailwind theme

## External Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **Scheduling**: Calendly (embedded widget)
- **Fonts**: Google Fonts (Merriweather, Open Sans)
- **Key Libraries**: React 18, Radix UI, shadcn/ui, Drizzle ORM, Zod, Tailwind CSS 3, React Hook Form, Framer Motion, Recharts, TanStack Query v5, Wouter, date-fns, react-markdown, gray-matter
