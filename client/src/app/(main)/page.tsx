import type { Metadata } from "next";

import { CTA } from "@/components/landing/CTA";
import { CourseSection } from "@/components/landing/CourseSection";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Pricing } from "@/components/landing/Pricing";
import { Stats } from "@/components/landing/Stats";
import { Testimonials } from "@/components/landing/Testimonials";

export const metadata: Metadata = {
  title: "LearnFlow | AI-Powered Learning Management System",
  description:
    "Master any skill with LearnFlow. AI-powered personalized learning paths, expert-led courses, and industry-recognized certificates. Join 120,000+ learners today.",
  keywords: [
    "LMS",
    "Learning Management System",
    "Online Courses",
    "AI Learning",
    "Professional Development",
    "Education Technology",
    "TypeScript Courses",
    "React Courses",
  ],
  authors: [{ name: "LearnFlow Team" }],
  openGraph: {
    title: "LearnFlow | AI-Powered Learning Management System",
    description:
      "Transform your career with AI-driven education. Expert-led courses designed for modern professionals.",
    url: "https://learnflow.edu",
    siteName: "LearnFlow",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnFlow | AI-Powered Learning Management System",
    description:
      "Personalized education powered by AI. Learn faster, grow better.",
  },
};

export default function Landing() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <CourseSection />
      <Testimonials />
      <Pricing />
      <CTA />
    </>
  );
}
