# LMS Frontend Architecture - Deployment Guide

This project is optimized for deployment on **Vercel**.

## Environment Variables

Create a project on Vercel and add the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API | `https://api.lms-portal.com/api` |
| `NEXT_PUBLIC_SITE_URL` | Base URL for the frontend | `https://lms-portal.com` |

## Local Setup

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a `.env.local` file with the variables above.
4. Run development server: `npm run dev`.

## Production Build

The project uses Next.js App Router with optimized code splitting and dynamic imports for heavy dashboard components.

```bash
npm run build
```

## Folder Structure Principles

- **Features**: Everything related to a specific business domain (auth, courses) is encapsulated in `src/features`.
- **UI Architecture**: Primitive components live in `src/components/ui`, while complex layouts live in `src/components/layout`.
- **State Management**: Redux Toolkit is used for global client-state, and TanStack Query is used for server-state caching.
