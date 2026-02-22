export interface IEnrollmentGrowth {
  date: string;
  count: number;
}

export interface ITopCourse {
  id: string;
  title: string;
  instructorName: string;
  enrollmentCount: number;
  revenue: number;
}

export interface IRevenuePerCourse {
  courseId: string;
  title: string;
  revenue: number;
}

export interface IInstructorCompletionRate {
  instructorId: string;
  instructorName: string;
  averageCompletionRate: number;
}

export interface IPlatformAnalytics {
  totalCourses: number;
  totalActiveStudents: number;
  enrollmentGrowth: IEnrollmentGrowth[];
  topCourses: ITopCourse[];
  revenuePerCourse: IRevenuePerCourse[];
  instructorCompletionRates: IInstructorCompletionRate[];
}
