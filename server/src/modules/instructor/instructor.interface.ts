export interface IInstructorDashboardStats {
  totalStudents: number;
  avgRating: number;
  totalRevenue: number;
  totalCourses: number;
  revenueTrend: { name: string; revenue: number }[];
}

export interface IInstructorCourseStats {
  id: string;
  title: string;
  thumbnail: string | null;
  price: number;
  status: string;
  enrolledStudents: number;
  revenue: number;
  rating: number;
}

export interface IInstructorStudent {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  courseTitle: string;
  progress: number;
  status: string;
  enrolledAt: Date;
  lastActive: Date;
}
