import { Metadata } from "next";
import CoursesClient from "./CoursesClient";

export const metadata: Metadata = {
  title: "Course Management | Admin | LMS Platform",
  description:
    "Manage platform courses, review submissions, and monitor enrollment status.",
};

export default function CoursesPage() {
  return <CoursesClient />;
}
