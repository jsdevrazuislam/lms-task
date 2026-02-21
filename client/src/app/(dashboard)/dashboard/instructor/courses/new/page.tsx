import { Metadata } from "next";
import AddCourseClient from "./AddCourseClient";

export const metadata: Metadata = {
  title: "Create New Course | LearnFlow Instructor",
  description:
    "Launch your teaching journey on LearnFlow. Use our comprehensive course builder to structure your curriculum, upload content, and reach students worldwide.",
  openGraph: {
    title: "Create New Course | LearnFlow Instructor",
    description:
      "Transform your knowledge into a world-class course on LearnFlow.",
    type: "website",
  },
};

export default function AddCoursePage() {
  return <AddCourseClient />;
}
