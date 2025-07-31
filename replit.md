# GermaineTutoring.com - Premium LSAT Tutoring Website

## Overview
GermaineTutoring.com is a premium full-stack web application designed for Germaine Washington, a Princeton Logic graduate with a perfect 180 LSAT score, to offer high-end LSAT tutoring services. The platform aims to establish credibility and provide a seamless user experience for prospective LSAT students, offering comprehensive resources from detailed tutoring programs and a learning library to advanced practice tools and test simulations. The business vision is to provide a comprehensive, high-quality online tutoring experience that leverages modern web technologies to deliver an unparalleled learning environment.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (custom theming), Radix UI primitives, shadcn/ui component library
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **UI/UX Decisions**: Clean, modern design with a focus on usability. Features a consolidated Methodology & Results page, clear program comparisons, comprehensive learning library with modal content display, and LawHub-style test simulation interface. Uses Merriweather and Open Sans Google Fonts.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (Neon Database)
- **API Design**: RESTful endpoints with JSON responses
- **Session Management**: Express sessions with PostgreSQL storage

### Key Features
- **Core Pages**: Home, Methodology & Results, Tutoring Programs, Blog (with MDX support), Learning Library, Explore Tests, Test Simulation, 404 Page.
- **Major Sections**: Hero, About (with Calendly integration), Methodology (Define, Demonstrate, Duplicate), Programs (three-tiered pricing), Results (testimonials), FAQ, Guides (subscription-gated), Learning Library (5 main sections), Session Summaries, Explore Tests (unified interface for browsing questions and simulating tests), Test Simulation (LawHub-style for PT 101-158).
- **Authentication**: User authentication system (for student-facing pages like Dashboard, PracticeTest, PracticeRC).
- **Practice Tools**:
    - **LSAT Questions Database**: Comprehensive database of LSAT questions.
    - **Practice Interface**: Configurable settings, question display, filtering by type, skills, difficulty, passage categories.
    - **RC Practice**: Passage-based with specific filters and grouping.
    - **Test Simulation**: Full-length test simulation for PT 101-158 with timing, flagging, and review.
    - **Custom Sets**: Tools for creating and browsing practice sets.
    - **Progress Tracking**: Performance analytics, weakest areas tracking, missed question journal, activity log.

### System Design Choices
- Strict TypeScript mode.
- Use of ESLint for code quality.
- Optimized database tables (lr_questions, rc_questions) for performance.
- Environment configuration via `NODE_ENV` and `DATABASE_URL`.
- Modular file structure (`client/`, `server/`, `shared/`, `migrations/`, `attached_assets/`, `posts/`).

## External Dependencies

### Third-Party Services
- **Neon Database**: Serverless PostgreSQL hosting.
- **Calendly**: Appointment scheduling platform for consultation bookings.
- **LSAC Law Hub**: Referenced for official LSAT materials (content only, not directly integrated as an API).

### Key Libraries
- **React**: Frontend UI library.
- **Radix UI / shadcn/ui**: UI components.
- **Drizzle ORM**: Database ORM.
- **Zod**: Schema validation.
- **Tailwind CSS**: Utility-first CSS framework.
- **React Hook Form**: Form management.
- **date-fns**: Date manipulation utility.
- **Font Awesome**: Icon library.
- **Google Fonts**: Custom fonts (Merriweather, Open Sans).
- **Unsplash**: Image hosting (for guide thumbnails).