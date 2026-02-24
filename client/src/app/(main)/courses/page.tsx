export const dynamic = "force-dynamic";

import { courseService } from "@/features/course/services/course.service";
import CoursesCatalogClient from "./CoursesCatalogClient";

export default async function CoursesCatalog() {
  // Fetch initial data on the server for instant rendering
  const [coursesResponse, categoriesResponse] = await Promise.all([
    courseService.getCourses({ limit: 9 }),
    courseService.getCategories(),
  ]);

  return (
    <CoursesCatalogClient
      initialCourses={coursesResponse}
      initialCategories={categoriesResponse.data}
    />
  );
}
