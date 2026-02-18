# LMS (Learning Management System) 🎓

An enterprise-grade, production-ready Learning Management System built with Next.js, Node.js, and Prisma.

## 🏗️ Workspace Architecture

This repository follows a clean **Client–Server Separation** model:

- **`/client`**: Next.js 15+ (App Router), TypeScript, Tailwind CSS, Redux Toolkit, TanStack Query.
- **`/server`**: Node.js, Express, Prisma (PostgreSQL), TypeScript.

## 🛡️ Code Quality & Production Readiness

We enforce strict engineering standards to ensure the codebase remains maintainable and error-free:

### Quality Gates
- **ESLint**: Strictly configured across both applications. Commit/Push will fail if any errors exist.
- **Git Hooks**: Managed by **Husky**.
  - `pre-commit`: Runs `lint-staged` to check only your changes.
  - `commit-msg`: Enforces **Conventional Commits** (feat, fix, refactor, etc.).
- **TypeScript**: Full type safety with zero tolerance for `any` in production code.

### Core Implementation
- **RBAC**: Multi-role security (Super Admin, Admin, Instructor, Student) handled via Next.js Middleware and custom HOCs.
- **State Management**: Dual-layer state (Global UI via Redux, Server-state via React Query).
- **API Strategy**: Centralized Axios client with automatic JWT rotation/injection.

## 🚀 Getting Started

### Local Setup

1. **Root Installation**:
   ```bash
   npm install
   ```

2. **Frontend Setup**:
   ```bash
   cd client
   npm install
   cp .env.example .env.local
   npm run dev
   ```

3. **Backend Setup**:
   ```bash
   cd server
   npm install
   cp .env.example .env
   npx prisma generate
   npm run dev
   ```

## 📊 Evaluation Credentials

- **Super Admin**: `superadmin@lms.com` / `password123`
- **Instructor**: `instructor@lms.com` / `password123`
- **Student**: `student@lms.com` / `password123`

---
*Built for scale, stability, and premium user experience.*


