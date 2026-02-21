import { Metadata } from "next";
import InstructorDashboardClient from "./InstructorDashboardClient";

export const metadata: Metadata = {
  title: "Instructor Dashboard | LearnFlow",
  description:
    "Manage your courses, track student progress, and monitor your revenue and analytics with the LearnFlow Instructor Dashboard.",
  openGraph: {
    title: "Instructor Dashboard | LearnFlow",
    description:
      "Powerful insights and management tools for LearnFlow instructors.",
    type: "website",
  },
};

export default function InstructorDashboardPage() {
  return <InstructorDashboardClient />;
}
