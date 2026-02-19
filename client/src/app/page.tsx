"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  ShieldCheck,
  BarChart3,
  Users,
  Zap,
  ChevronRight,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// --- Components ---

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600">
          EduFlow Pro
        </span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <Link href="#features" className="hover:text-blue-600 transition">
          Features
        </Link>
        <Link href="#roles" className="hover:text-blue-600 transition">
          Roles
        </Link>
        <Link href="#enterprise" className="hover:text-blue-600 transition">
          Enterprise
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-semibold text-slate-700">
          Sign in
        </Link>
        <Link
          href="/register"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Get Started
        </Link>
      </div>
    </div>
  </nav>
);

const FeatureCard = ({ icon: Icon, title, desc }: FeatureCardProps) => (
  <div className="p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-xl transition-shadow group">
    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
      <Icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

// --- Main Page ---

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold tracking-wide uppercase">
              v2.0 is now live
            </span>
            <h1 className="mt-8 text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight">
              Scale your knowledge <br />
              <span className="text-blue-600">Enterprise Grade.</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A high-performance LMS built with Next.js, TypeScript, and Prisma.
              Designed for Super Admins, Instructors, and Students to thrive in
              a seamless ecosystem.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition">
                Explore Demo <ChevronRight size={18} />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition">
                View Documentation
              </button>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-16 relative mx-auto max-w-5xl"
          >
            <div className="rounded-2xl border-8 border-slate-900/5 overflow-hidden shadow-2xl relative aspect-video">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070"
                alt="LMS Dashboard"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Architecture Highlights */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">
              Built for Production
            </h2>
            <p className="text-slate-500 mt-4">
              Advanced tech stack ensuring 99.9% uptime and scalability.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={ShieldCheck}
              title="RBAC Security"
              desc="Role-Based Access Control integrated at the middleware level. Secure JWT flows with session persistence."
            />
            <FeatureCard
              icon={BarChart3}
              title="Real-time Analytics"
              desc="Comprehensive dashboards for Super Admins and Instructors using optimized Prisma aggregation queries."
            />
            <FeatureCard
              icon={Zap}
              title="Progress Engine"
              desc="Automated lesson tracking and course completion logic with atomic database transactions."
            />
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Multi-Tenant <br />
                Role Governance
              </h2>
              <div className="space-y-6">
                {[
                  {
                    r: "Super Admin",
                    d: "Global governance, revenue tracking, and account management.",
                  },
                  {
                    r: "Instructor",
                    d: "Course creation, lesson ordering, and student analytics.",
                  },
                  {
                    r: "Student",
                    d: "Interactive learning, progress tracking, and certification.",
                  },
                ].map((role, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 className="text-blue-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900">{role.r}</h4>
                      <p className="text-slate-600">{role.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-600 rounded-3xl p-12 text-white">
              <Users className="w-12 h-12 mb-6 opacity-80" />
              <h3 className="text-3xl font-bold mb-4">
                Scalable User Management
              </h3>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Our architecture supports millions of concurrent users with
                optimized PostgreSQL indexing and cursor-based pagination for
                high-performance data fetching.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold">100ms</div>
                  <div className="text-blue-200 text-sm">Avg. API Response</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">Zod</div>
                  <div className="text-blue-200 text-sm">
                    Type-Safe Validation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Ready to deploy your LMS?
          </h2>
          <p className="text-slate-600 mb-10">
            Download the source code or start with our managed cloud hosting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              Get Started Now
            </button>
            <button className="px-10 py-4 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
