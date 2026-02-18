'use client';

import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    LogOut,
    BarChart3,
    GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { UserRole } from '@/features/auth/types';
import { useAppSelector } from '@/store';

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

const roleNavItems: Record<UserRole, NavItem[]> = {
    [UserRole.SUPER_ADMIN]: [
        { label: 'System Stats', href: '/super-admin/stats', icon: BarChart3 },
        { label: 'Manage Admins', href: '/super-admin/admins', icon: Users },
        { label: 'Settings', href: '/settings', icon: Settings },
    ],
    [UserRole.ADMIN]: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Instructors', href: '/admin/instructors', icon: Users },
        { label: 'Courses', href: '/admin/courses', icon: BookOpen },
        { label: 'Settings', href: '/settings', icon: Settings },
    ],
    [UserRole.INSTRUCTOR]: [
        { label: 'My Courses', href: '/instructor/courses', icon: BookOpen },
        { label: 'Students', href: '/instructor/students', icon: Users },
        { label: 'Analytics', href: '/instructor/analytics', icon: BarChart3 },
        { label: 'Settings', href: '/settings', icon: Settings },
    ],
    [UserRole.STUDENT]: [
        { label: 'My Learning', href: '/student/my-courses', icon: GraduationCap },
        { label: 'Browse Courses', href: '/student/browse', icon: BookOpen },
        { label: 'Settings', href: '/settings', icon: Settings },
    ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAppSelector((state) => state.auth);
    const role = user?.role || UserRole.STUDENT;
    const navItems = roleNavItems[role];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-white dark:bg-zinc-900 overflow-y-auto">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-primary">LMS Portal</h1>
                </div>
                <nav className="mt-4 px-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                    <button className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-8">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 border-b bg-white dark:bg-zinc-900 flex items-center px-8 justify-between">
                    <h2 className="text-lg font-semibold capitalize">{role.toLowerCase()} Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {user?.firstName?.[0]}
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
