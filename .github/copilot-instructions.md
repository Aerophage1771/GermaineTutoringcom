# GitHub Copilot Instructions for GermaineTutoring.com

## Project Overview

GermaineTutoring.com is a premium LSAT tutoring platform built as a full-stack TypeScript application. The application serves:
- **Prospective students**: Marketing site with blog, methodology, programs, and Calendly scheduling
- **Enrolled students**: Authenticated dashboard with session tracking, LSAT practice, analytics
- **Admin**: Management panel for students, sessions, blog posts, and problem logs

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Routing**: Wouter (client-side routing)
- **Styling**: Tailwind CSS 3 with custom theme using CSS variables
- **UI Components**: Radix UI / shadcn/ui (30+ accessible component primitives)
- **State Management**: TanStack Query v5 for server state
- **Forms**: React Hook Form + Zod validation
- **Rich Text**: TipTap editor for blog CMS
- **Animations**: Framer Motion
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js + Express
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM with Drizzle Kit
- **Authentication**: express-session + Passport Local strategy
- **Validation**: Zod schemas
- **File Uploads**: multer + sharp for image processing
- **Security**: bcrypt for password hashing, sanitize-html for blog content

## Project Structure

```
GermaineTutoringcom/
├── client/               # React frontend application
│   ├── src/
│   │   ├── components/   # UI components
│   │   │   └── ui/       # shadcn/ui components (30+)
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities (cn helper, etc.)
│   │   ├── App.tsx       # Root component with providers
│   │   └── main.tsx      # React entry point
│   └── index.html        # HTML entry
├── server/               # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes (~1,050 lines)
│   ├── storage.ts        # Data access layer (~750 lines)
│   ├── db.ts             # Database connection
│   ├── blog.ts           # Blog-specific logic
│   └── vite.ts           # Vite dev middleware
├── shared/               # Shared between client & server
│   └── schema.ts         # Drizzle ORM schema + Zod types
├── scripts/              # Utility scripts
│   ├── migrate-blog-posts.ts  # MDX to DB migration
│   └── import-lsat-questions.ts
└── posts/                # Legacy MDX blog posts
```

## Code Conventions & Best Practices

### TypeScript
- **Strict mode enabled**: All TypeScript strict checks are active
- **Module system**: ES modules (`"type": "module"` in package.json)
- **Path aliases**: 
  - `@/*` → `./client/src/*`
  - `@shared/*` → `./shared/*`
- **No explicit types for inferred values**: Let TypeScript infer when obvious
- **Use Drizzle inference**: `typeof table.$inferSelect` and `typeof table.$inferInsert`

### Styling
- **Tailwind utility classes**: Use Tailwind for all styling
- **CSS variables for theming**: Colors defined as HSL CSS variables (e.g., `hsl(var(--primary))`)
- **cn() helper**: Use `import { cn } from "@/lib/utils"` for conditional class merging
- **Responsive design**: Mobile-first approach with Tailwind breakpoints

### Components
- **shadcn/ui patterns**: Follow shadcn/ui conventions for component structure
- **Composition over props**: Use slot patterns and component composition
- **Accessible by default**: Leverage Radix UI primitives for accessibility
- **Client components location**: All UI components in `client/src/components/`

### Database & API
- **Schema location**: All database schemas in `shared/schema.ts` using Drizzle ORM
- **Validation**: Create Zod schemas from Drizzle schemas using `createInsertSchema()`
- **Type safety**: Export and use inferred types: `type User = typeof users.$inferSelect`
- **Relations**: Define Drizzle relations for joins (see schema.ts examples)
- **Database connection**: Always use environment variable `DATABASE_URL` or `SUPABASE_DB_URL`

### API Routes Pattern
- All API routes defined in `server/routes.ts`
- Business logic in `server/storage.ts` (data access layer)
- Use Zod for request validation
- Session-based authentication via express-session
- Return JSON responses with appropriate status codes

### Forms & Validation
- Use React Hook Form with `@hookform/resolvers/zod`
- Define Zod schemas in shared/schema.ts when used by both client and server
- Use form components from `components/ui/form.tsx`
- Validate on both client and server

## Development Workflow

### Commands
```bash
npm run dev       # Start dev server (tsx + Vite hot reload at :5000)
npm run build     # Production build (Vite client + esbuild server)
npm start         # Run production build
npm run check     # TypeScript type checking (use before commits)
npm run db:push   # Push Drizzle schema to database
npm run blog:migrate  # Import legacy MDX posts to database
```

### Database Setup
1. Set `DATABASE_URL` or `SUPABASE_DB_URL` environment variable (direct Postgres connection string)
2. Run `npm run db:push` to create/update tables
3. Schema changes: Edit `shared/schema.ts` then run `npm run db:push`

### Testing
- **Currently no automated tests**: Validation relies on TypeScript type checking (`npm run check`)
- Validate changes by running the dev server and manually testing features

### Building
- Frontend: Vite builds to `dist/public/`
- Backend: esbuild bundles server to `dist/index.js`
- Both run with single `npm run build` command

## Key Patterns

### Path Aliases Usage
```typescript
import { Button } from "@/components/ui/button"
import { users } from "@shared/schema"
```

### Database Query Pattern
```typescript
import { db } from "./db";
import { users } from "@shared/schema";

const user = await db.query.users.findFirst({
  where: eq(users.id, userId)
});
```

### Component Pattern (shadcn/ui style)
```typescript
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
}

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return <button className={cn("base-classes", className)} {...props} />
}
```

### Form Pattern
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { insertUserSchema } from "@shared/schema"

const form = useForm({
  resolver: zodResolver(insertUserSchema)
})
```

## Environment Variables

Required:
- `DATABASE_URL` or `SUPABASE_DB_URL`: Direct PostgreSQL connection string (not HTTPS URL)
- `SESSION_SECRET`: Secret for express-session cookie signing

Optional:
- `NODE_ENV`: `development` or `production` (defaults to `development`)

## Common Gotchas

1. **Database URL format**: Must be a direct Postgres connection string (`postgresql://...`), not a Supabase project URL (`https://...`)
2. **Path aliases**: Must use `@/` for client code and `@shared/` for shared schemas
3. **Import extensions**: TypeScript config allows `.ts` extensions in imports
4. **No test suite**: Currently no automated tests; rely on TypeScript checking and manual validation
5. **Static files**: Server serves Vite's build output from `dist/public/`

## Deployment

- **Platform**: Netlify (see `netlify.toml`)
- **Build**: `npm run build`
- **Output**: `dist/public/` (SPA with fallback routing)
- **Database**: Neon serverless PostgreSQL

## When Adding Features

1. **Database changes**: Update `shared/schema.ts`, then `npm run db:push`
2. **New components**: Place in `client/src/components/` (UI primitives in `ui/` subdirectory)
3. **New pages**: Add to `client/src/pages/` and update router in `App.tsx`
4. **New API endpoints**: Add to `server/routes.ts`, business logic in `server/storage.ts`
5. **Validation**: Create Zod schemas in `shared/schema.ts` for shared validation
6. **Types**: Let TypeScript infer from Drizzle schemas when possible
7. **Styling**: Use Tailwind utilities and CSS variables for theming
8. **Always run**: `npm run check` before considering work complete
