export const dynamic = "force-dynamic";

import type { Metadata } from "next";

import nextDynamic from "next/dynamic";
import { CourseSection } from "@/components/landing/CourseSection";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";

// Below-the-fold components are loaded dynamically
const Features = nextDynamic(() =>
  import("@/components/landing/Features").then((mod) => mod.Features),
);
const Testimonials = nextDynamic(() =>
  import("@/components/landing/Testimonials").then((mod) => mod.Testimonials),
);
const Pricing = nextDynamic(() =>
  import("@/components/landing/Pricing").then((mod) => mod.Pricing),
);
const CTA = nextDynamic(() =>
  import("@/components/landing/CTA").then((mod) => mod.CTA),
);

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
