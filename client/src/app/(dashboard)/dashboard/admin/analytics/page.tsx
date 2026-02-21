import { Metadata } from "next";
import AnalyticsClient from "./AnalyticsClient";

export const metadata: Metadata = {
  title: "Analytics & Insights | Admin | LMS Platform",
  description:
    "Deep dive into student engagement, course completion rates, and platform growth analytics.",
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
