import { Metadata } from "next";
import CategoriesClient from "./CategoriesClient";

export const metadata: Metadata = {
  title: "Category Management | Admin | LMS Platform",
  description:
    "Organize and manage course categories, tags, and classification systems.",
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
