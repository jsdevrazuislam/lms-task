import { Metadata } from "next";
import EditCourseClient from "./EditCourseClient";

export const metadata: Metadata = {
  title: "Edit Course | LearnFlow Instructor",
  description: "Update your course content, modules, and lessons.",
};

export default function EditCoursePage() {
  return <EditCourseClient />;
}
