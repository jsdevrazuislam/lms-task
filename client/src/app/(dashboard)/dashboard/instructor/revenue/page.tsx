import { Metadata } from "next";
import RevenueClient from "./RevenueClient";

export const metadata: Metadata = {
  title: "Revenue Analysis | LearnFlow Instructor",
  description:
    "Track your earnings, monitor sales volume, and analyze revenue trends for all your courses on LearnFlow.",
  openGraph: {
    title: "Revenue Analysis | LearnFlow Instructor",
    description:
      "Comprehensive financial breakdown and performance metrics for instructors.",
    type: "website",
  },
};

export default function InstructorRevenuePage() {
  return <RevenueClient />;
}
