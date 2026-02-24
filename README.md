# Learning Management System (LMS) 🎓

A professional, enterprise-grade Learning Management System designed for scale, stability, and a premium user experience. This project leverages a modern full-stack architecture to provide a robust platform for instructors and students.

## 🔗 Live Resources

- **Frontend Application**: [lms-task-client.vercel.app](https://lms-task-client.vercel.app/)
- **API Documentation (Swagger)**: [lms-task-2jhl.onrender.com/api-docs](https://lms-task-2jhl.onrender.com/api-docs/)

---

## 🏗️ Architecture & Tech Stack

The project is built using a monorepo structure (pnpm workspaces) with a clear separation between the client and server.

### 💻 Client (Frontend)
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**:
  - **Global/UI**: [Redux Toolkit](https://redux-toolkit.js.org/)
  - **Server Cache**: [TanStack Query v5](https://tanstack.com/query/latest)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Motion**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

### ⚙️ Server (Backend)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT-based with Access/Refresh token rotation
- **Real-time**: [Socket.io](https://socket.io/)
- **Documentation**: [Swagger / OpenAPI 3.0](https://swagger.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Logging**: [Winston](https://github.com/winstonjs/winston)

---

## ✨ Key Features

- **🛡️ Role-Based Access Control (RBAC)**: Personalized dashboards for Super Admin, Admin, Instructor, and Student.
- **📚 Course Discovery**: Advanced filtering, search, and detailed course catalogs.
- **📖 Learning Experience**: Interactive lesson management and progress tracking.
- **💳 Enrollment System**: Secure course enrollment and student management.
- **🔔 Real-time Notifications**: Instant updates via Socket.io and in-app notification center.
- **📊 Analytics**: Comprehensive insights for instructors and admins.
- **📧 Automated Emails**: Transactional emails for verification and password resets.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v20+)
- pnpm (v10+)
- PostgreSQL (or use a hosted instance)

### 1. Clone & Install
```bash
git clone https://github.com/jsdevrazuislam/lms-task.git
cd lms-task
pnpm install
```

### 2. Environment Configuration
Navigate to both `client` and `server` directories and set up your environment variables:

**Server (`/server`)**:
```bash
cp .env.example .env
# Update DATABASE_URL, JWT secrets, and API keys in .env
```

**Client (`/client`)**:
```bash
cp .env.example .env.local
# Update NEXT_PUBLIC_API_URL if necessary
```

### 3. Database Initialization
```bash
cd server
pnpm exec prisma migrate dev
pnpm exec prisma db seed
```

### 4. Run the Project
From the root directory:
```bash
pnpm dev
```
The Frontend will be available at `http://localhost:3000` and the Backend at `http://localhost:5000`.

---

## 🛠️ Production & Deployment

### Backend (Docker & Render)
The server is optimized for containerized environments.
- **Dockerfile**: Implements a multi-stage build, non-root user security, and dependency pruning.
- **Build Context**: Must be built from the root to ensure workspace integrity.
```bash
docker build -t lms-server -f server/Dockerfile .
```

### Frontend (Vercel)
Optimized for Vercel with automatic deployments from the `main` branch.

---

## 🛡️ Engineering Standards

We maintain high code quality through:
- **Husky & lint-staged**: Automated linting and type-checking before every commit.
- **Conventional Commits**: Standardized commit messages for clear history.
- **CI/CD**: Automatic build verification on Pull Requests.

---

## 📋 Evaluation Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@learnflow.com` | `password123` |
| **Admin** | `admin@learnflow.com` | `password123` |
| **Instructor** | `instructor1@learnflow.com` | `password123` |
| **Student** | `roy.nikolaus@gmail.com` | `password123` |

---
*Developed with focus on performance, security, and developer experience.*
