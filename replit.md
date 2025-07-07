# GermaineTutoring.com - Premium LSAT Tutoring Website

## Overview

GermaineTutoring.com is a premium LSAT tutoring website for Germaine Washington, a Princeton Logic graduate with a perfect 180 LSAT score. The application is a full-stack web solution built with modern technologies to establish credibility and provide a seamless user experience for prospective LSAT students.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with custom theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful endpoints with JSON responses
- **Session Management**: Express sessions with PostgreSQL storage

### Development Environment
- **Package Manager**: npm with lockfile version 3
- **Development Server**: Vite dev server with HMR
- **TypeScript**: Strict mode with modern ES features
- **Linting**: ESLint integration (implied by shadcn/ui setup)

## Key Components

### Core Pages
1. **Home Page** (`/`) - Main landing page with hero, about, methodology, programs, results, CTA, and FAQ sections
2. **Methodology & Results** (`/methodology`, `/results`) - Consolidated page combining teaching methodology and student success stories
3. **Tutoring Programs** (`/programs`) - Detailed program comparison and pricing information
4. **Blog** (`/blog`) - LSAT strategy blog listing
5. **Blog Post** (`/blog/:slug`) - Individual blog post pages with MDX support
6. **404 Page** - Custom not found page

### Major Sections
- **Hero Section**: Credibility establishment with key stats and CTA
- **About Section**: Personal introduction with Calendly integration
- **Methodology Section**: Three-step approach explanation (Define, Demonstrate, Duplicate)
- **Programs Section**: Three-tiered pricing structure with feature comparison
- **Results Section**: Student testimonials and success statistics
- **FAQ Section**: Collapsible answers to common questions
- **Guides Section**: Lead magnet with subscription-gated PDF downloads

### Database Schema
- **Users**: Basic user authentication (template remnant)
- **Subscribers**: Email subscription tracking for lead generation
- **Consultations**: Consultation booking requests with contact details and LSAT goals

## Data Flow

### User Interactions
1. **Email Subscription**: Form submission → validation → database storage → confirmation
2. **Consultation Booking**: Calendly integration for scheduling initial consultations
3. **Guide Downloads**: Email subscription required → popup modal → lead capture
4. **Blog Reading**: Static content served via API endpoints

### External Integrations
- **Calendly**: Widget-based scheduling system for consultation bookings
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Merriweather and Open Sans font families
- **Unsplash**: Image hosting for guide thumbnails

## External Dependencies

### Third-Party Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Calendly**: Appointment scheduling platform
- **LSAC Law Hub**: Referenced for official LSAT materials (content only)

### Key Libraries
- **UI Framework**: React + Radix UI + shadcn/ui components
- **Database**: Drizzle ORM + Neon Database driver
- **Validation**: Zod schemas for type-safe data validation
- **Styling**: Tailwind CSS with custom color scheme
- **Forms**: React Hook Form with resolver integration
- **Date Handling**: date-fns library

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations in `migrations/` directory
- **Environment**: Production/development configuration via NODE_ENV

### File Structure
```
├── client/           # Frontend React application
├── server/           # Backend Express server
├── shared/           # Shared schemas and types
├── migrations/       # Database migration files
├── attached_assets/  # Content specifications and requirements
└── posts/           # Blog content (MDX files)
```

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Development vs production builds with different optimizations
- TypeScript path aliases for clean imports

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
- July 03, 2025. Consolidated Methodology and Results pages into single cohesive page
- July 03, 2025. Updated header navigation - changed "Student Dashboard" to "Student Log-In" with prominence
- July 03, 2025. Added Home button to header navigation
- July 03, 2025. Removed all references to "Logic Games" throughout the application
- July 04, 2025. Added complete authentication system with PostgreSQL database storage
- July 04, 2025. Implemented two-column Dashboard layout with Account Summary, Session History, and large action buttons
- July 04, 2025. Added Problem Log with auto-save inline editing and delete functionality
- July 04, 2025. Created LSAT questions database with 6,008 questions imported from CSV metadata
- July 04, 2025. Built Practice Test interface with configurable settings and question display system
- July 04, 2025. Connected Dashboard Practice button to new testing interface
- July 04, 2025. Split Practice into two separate dashboard sections: "Practice Logical Reasoning" and "Practice Reading Comprehension"
- July 04, 2025. Redesigned Practice interface with free browsing as default and smart drilling option for LR only
- July 04, 2025. Removed Reading Comprehension section generator and "never attempted questions" targeting criteria
- July 04, 2025. Added comprehensive question filtering by type, skills, difficulty, and passage categories
- July 05, 2025. Updated Reading Comprehension to be passage-based with RC-specific filters (passage categories, question categories)
- July 05, 2025. Implemented proper RC filtering backend with passage grouping and ordering by passage structure
- July 05, 2025. Fixed RC Practice Mode to properly load Reading Comprehension questions instead of Logical Reasoning
- July 05, 2025. Added pagination system (50 questions per page) with Previous/Next navigation and page numbers
- July 05, 2025. Added "Create Set from Selections" feature with checkboxes on question cards and selection counter
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```