export interface ILesson {
  id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  order: number;
  moduleId: string;
  duration?: string;
  isFree: boolean;
  isCompleted?: boolean;
  contentType?: "video" | "text" | "quiz";
  preview?: boolean;
}

export interface IModule {
  id: string;
  title: string;
  order: number;
  courseId: string;
  duration?: string;
  lessons: ILesson[];
}

export interface ICurriculumItem {
  id: string;
  title: string;
  duration: string;
  isFree: boolean;
  contentType?: "video" | "text" | "quiz";
  order: number;
}

export interface ICurriculumSection {
  id: string;
  title: string;
  duration: string;
  lessons: number;
  order: number;
  items: ICurriculumItem[];
}

export interface ICourse {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  price: number;
  originalPrice?: number;
  thumbnail?: string;
  instructorId: string;
  categoryId: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  rating: number;
  reviews?: number;
  students: number;
  duration: string;
  lessons: number;
  modulesCount?: number;
  gradient?: string;
  language?: string;
  tags?: string[];
  whatYouLearn?: string[];
  requirements?: string[];
  tag?: string;
  tagColor?: string;
  curriculum?: ICurriculumSection[];
  modules?: IModule[];
  metaDescription?: string;
  instructor?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    title?: string;
    bio?: string;
    rating?: number;
    reviews?: number;
    students?: number;
    courses?: number;
  };
  category?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CoursesResponse {
  success: boolean;
  data: ICourse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    nextCursor?: string | null;
    hasNextPage?: boolean;
  };
}

export interface CourseResponse {
  success: boolean;
  data: ICourse;
}

export interface CreateCoursePayload {
  title: string;
  subtitle?: string;
  description: string;
  thumbnail?: string;
  price: number;
  originalPrice?: number;
  duration: string;
  level: ICourse["level"];
  isFree: boolean;
  categoryId: string;
  tags?: string[];
  whatYouLearn?: string[];
  requirements?: string[];
  metaDescription?: string;
  status: ICourse["status"];
  modules: {
    title: string;
    order: number;
    lessons: {
      title: string;
      order: number;
      contentType: ILesson["contentType"];
      content?: string;
      videoUrl?: string;
      isPreview: boolean;
    }[];
  }[];
}
