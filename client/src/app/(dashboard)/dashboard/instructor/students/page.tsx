import { Metadata } from "next";
import StudentsClient from "./StudentsClient";

export const metadata: Metadata = {
  title: "Student Management | LearnFlow Instructor",
  description:
    "Track enrollment progress, monitor student engagement, and manage your learner community with the LearnFlow Instructor Dashboard.",
  openGraph: {
    title: "Student Management | LearnFlow Instructor",
    description:
      "Comprehensive tools for tracking and supporting your students on LearnFlow.",
    type: "website",
  },
};

export default function InstructorStudentsPage() {
  return <StudentsClient />;
}
