# GermaineTutoring.com - Premium LSAT Tutoring Website

## Overview
GermaineTutoring.com is a premium full-stack web application designed for Germaine Washington, an LSAT tutor with a perfect 180 score. The platform aims to establish credibility and provide a seamless experience for prospective LSAT students, offering comprehensive tutoring programs, study materials, and practice tools.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theming
- **UI Components**: Radix UI primitives and shadcn/ui
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful with JSON
- **Session Management**: Express sessions with PostgreSQL storage

### Key Features
- **Core Pages**: Home, Methodology & Results, Tutoring Programs, Blog, Blog Post, Learning Library, Explore Tests, Test Simulation, 404 Page.
- **Major Sections**: Hero, About (with Calendly), Methodology (Define, Demonstrate, Duplicate), Programs (three-tiered pricing), Results (testimonials), FAQ, Guides (lead magnet), Learning Library (5 sections), Session Summaries, Explore Tests (question browsing/simulations), Test Simulation (LawHub-style for PT 101-158).
- **UI/UX**: Emphasis on credibility, seamless user experience, custom Tailwind theming, Radix UI/shadcn/ui for components. Color scheme and typography (Merriweather, Open Sans) chosen for a professional look.
- **Technical Implementations**: MDX support for blog posts, comprehensive LSAT questions database (6,008 questions), LawHub-style test simulation with timing and review, advanced question filtering by type, skills, difficulty, and passage categories for Logical Reasoning and Reading Comprehension. Dynamic pagination for practice questions.
- **System Design**: Client-side routing for SPA experience. RESTful API for data interaction. Strict TypeScript for type safety. Modular file structure (`client/`, `server/`, `shared/`). Authentication system for student-facing content. Streamlined 4-part tab structure (Train Me, Explore Sets, Simulate Test, Progress) for practice modules.

## External Dependencies
- **Database**: Neon Database (PostgreSQL)
- **Scheduling**: Calendly
- **Icon Library**: Font Awesome
- **Fonts**: Google Fonts (Merriweather, Open Sans)
- **Image Hosting**: Unsplash (for guide thumbnails)
- **Content Reference**: LSAC Law Hub (for official LSAT materials)
- **Key Libraries**: React, Radix UI, shadcn/ui, Drizzle ORM, Zod, Tailwind CSS, React Hook Form, date-fns.