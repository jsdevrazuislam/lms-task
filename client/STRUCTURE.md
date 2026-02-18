# LMS Feature-Based Folder Structure

```text
src/
├── app/                  # Next.js App Router folders
│   ├── (auth)/           # Authentication group (login, register)
│   ├── (dashboard)/      # Protected dashboard group
│   └── layout.tsx        # Global layout
├── components/           # Shared UI components
│   ├── layout/           # DashboardLayout, Sidebar, Navbar
│   └── ui/               # Primitive Shadcn components
├── features/             # Business logic modules
│   ├── auth/             # Authentication feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── types/
│   ├── courses/          # Course management feature
│   ├── dashboard/        # Dashboard analytics feature
│   └── enrollment/       # Student enrollment feature
├── hooks/                # Global custom hooks
├── lib/                  # Library configurations (apiClient, utils)
├── providers/            # Context providers (Redux, QueryClient)
├── store/                # Global Redux store & root reducer
└── types/                # Global TypeScript definitions
```
