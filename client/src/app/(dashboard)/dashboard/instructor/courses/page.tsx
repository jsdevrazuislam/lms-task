import { Metadata } from "next";
import CoursesClient from "./CoursesClient";

export const metadata: Metadata = {
  title: "Course Management | LearnFlow Instructor",
  description:
    "Manage your online courses, track student enrollment, and monitor performance metrics for all your educational content on LearnFlow.",
  openGraph: {
    title: "Course Management | LearnFlow Instructor",
    description:
      "Full control over your curriculum and student reach on LearnFlow.",
    type: "website",
  },
};

export default function InstructorCoursesPage() {
  return <CoursesClient />;
}
