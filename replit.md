# Overview

YouBBle Records is a modern music label website built with React, TypeScript, and Express.js. The platform serves as a digital hub for the label's brand identity, showcasing music releases, artist collaborations, social impact projects, and merchandising. The website features a bold, edgy design inspired by the music industry aesthetic and provides interactive engagement points for artists (demo submissions, collaborations) and fans (merchandise, podcasts).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built using React with TypeScript, leveraging modern React patterns and hooks. The UI is constructed with shadcn/ui components built on top of Radix UI primitives, providing a consistent design system. The application uses Wouter for lightweight client-side routing and TanStack Query for server state management and data fetching.

**Key Design Decisions:**
- **Component Library**: shadcn/ui with Radix UI primitives for accessibility and customization
- **Styling**: Tailwind CSS with custom CSS variables for theming and dark mode support
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for minimal bundle size compared to React Router
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
The server is built with Express.js using TypeScript and follows a RESTful API design. The application uses a modular route structure with separate storage abstraction layer currently implemented as in-memory storage but designed for easy database integration.

**Key Design Decisions:**
- **Runtime**: Node.js with Express.js for simplicity and ecosystem compatibility
- **Storage Pattern**: Interface-based storage abstraction allowing easy swapping between implementations
- **Validation**: Zod schemas shared between client and server for consistent validation
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

## Data Storage Solutions
The application is configured to use PostgreSQL with Drizzle ORM for database operations. The schema is defined using Drizzle's PostgreSQL dialect and includes tables for users, demo submissions, collaboration requests, releases, merchandise, and podcast episodes.

**Key Design Decisions:**
- **ORM**: Drizzle ORM for type-safe database queries and migrations
- **Database**: PostgreSQL for relational data and ACID compliance
- **Schema Definition**: Co-located with TypeScript types for better developer experience
- **Migrations**: Drizzle Kit for database schema migrations

## Authentication and Authorization
The current implementation includes user schema definition but authentication is not yet fully implemented. The system is designed to support session-based authentication with PostgreSQL session storage.

**Planned Implementation:**
- Session-based authentication using connect-pg-simple for PostgreSQL session storage
- User registration and login functionality
- Role-based access control for admin features

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database queries and schema management (drizzle-orm, drizzle-kit)

### UI and Design System
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Radix UI**: Low-level UI primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

### Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds

### Form and Data Management
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Schema validation library shared between client and server
- **TanStack Query**: Powerful data synchronization for React

### Fonts and Typography
- **Google Fonts**: Montserrat, Inter, Oswald, and other web fonts
- **Custom font loading**: Optimized font loading for performance