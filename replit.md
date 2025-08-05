# TrailGuide Mobile App

## Overview

TrailGuide is a mobile-first trail discovery and hiking companion application built with React and Express. The app provides hikers with trail information, real-time event reporting, activity tracking, and community features. It follows a nature-inspired design system with earth tones and focuses on providing an intuitive hiking experience through a clean, mobile-optimized interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Custom component library based on Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with custom nature-themed color palette
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Data Layer**: Drizzle ORM with PostgreSQL dialect
- **Storage**: In-memory storage implementation for development with interface for database switching
- **Middleware**: Custom logging, error handling, and request parsing

### Data Storage Solutions
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Shared schema definitions between client and server
- **Migrations**: Drizzle Kit for database migrations and schema management

### Key Data Models
- **Users**: Authentication and profile management
- **Trails**: Trail information with geolocation, difficulty ratings, and metadata
- **Activities**: User hiking sessions with tracking capabilities
- **Trail Events**: Community-reported events (wildlife, hazards, weather, photos)
- **Reviews**: Trail ratings and user feedback
- **Trail Alerts**: Safety and condition notifications

### Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices with max-width constraints
- **Touch Interactions**: Touch-friendly UI components and navigation
- **Progressive Enhancement**: Works across different device capabilities
- **Performance**: Optimized bundle sizes and lazy loading

### Development Environment
- **Hot Reload**: Vite dev server with HMR
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Code Quality**: ESLint and TypeScript compiler checks
- **Path Aliases**: Absolute imports for cleaner code organization

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Neon Database serverless driver for PostgreSQL
- **express**: Web application framework for Node.js
- **drizzle-orm**: TypeScript ORM for SQL databases
- **@tanstack/react-query**: Data synchronization for React

### UI Component Libraries
- **@radix-ui/***: Unstyled, accessible UI primitives (20+ components)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Static type checking
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production builds

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **react-hook-form**: Form state management
- **zod**: Schema validation
- **wouter**: Lightweight React router
- **embla-carousel-react**: Carousel component

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tooling (conditional)

### Database and Session Management
- **connect-pg-simple**: PostgreSQL session store
- **drizzle-kit**: Database toolkit for migrations and introspection