import { Metadata } from "next";
import AnalyticsClient from "./AnalyticsClient";

export const metadata: Metadata = {
  title: "Instructor Analytics | LearnFlow",
  description:
    "Analyze your course performance, track student enrollment trends, and monitor completion rates with in-depth data visualizations.",
  openGraph: {
    title: "Instructor Analytics | LearnFlow",
    description:
      "Deep dive into your content engagement and reach on LearnFlow.",
    type: "website",
  },
};

export default function InstructorAnalyticsPage() {
  return <AnalyticsClient />;
}
