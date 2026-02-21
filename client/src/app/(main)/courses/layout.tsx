import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Catalog | LearnFlow - AI-Powered Education",
  description:
    "Explore our vast collection of expert-led courses in development, design, data science, and more. Find the perfect path to master your next skill.",
  keywords: [
    "Catalog",
    "Courses",
    "Online Learning",
    "Skills",
    "Certification",
  ],
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
