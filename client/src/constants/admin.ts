export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "instructor" | "student";
  joinDate: string;
  status: "active" | "suspended" | "deactivated";
  avatar: string;
}

export interface AdminCourse {
  id: string;
  title: string;
  instructorName: string;
  category: string;
  status: "published" | "draft" | "archived";
  enrolledStudents: number;
  thumbnail: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  courseCount: number;
}

export const adminUsers: AdminUser[] = [
  {
    id: "u1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "instructor",
    joinDate: "2024-11-02",
    status: "active",
    avatar: "SJ",
  },
  {
    id: "u2",
    name: "Mark Rivera",
    email: "mark@example.com",
    role: "student",
    joinDate: "2024-12-15",
    status: "active",
    avatar: "MR",
  },
  {
    id: "u3",
    name: "Emily Chen",
    email: "emily@example.com",
    role: "instructor",
    joinDate: "2024-09-20",
    status: "active",
    avatar: "EC",
  },
  {
    id: "u4",
    name: "James Wilson",
    email: "james@example.com",
    role: "student",
    joinDate: "2025-01-03",
    status: "suspended",
    avatar: "JW",
  },
  {
    id: "u5",
    name: "Priya Patel",
    email: "priya@example.com",
    role: "student",
    joinDate: "2024-10-18",
    status: "active",
    avatar: "PP",
  },
  {
    id: "u6",
    name: "Alex Turner",
    email: "alex@example.com",
    role: "instructor",
    joinDate: "2024-08-05",
    status: "active",
    avatar: "AT",
  },
  {
    id: "u7",
    name: "Mia Lopez",
    email: "mia@example.com",
    role: "student",
    joinDate: "2025-01-20",
    status: "active",
    avatar: "ML",
  },
  {
    id: "u8",
    name: "Daniel Kim",
    email: "daniel@example.com",
    role: "student",
    joinDate: "2024-11-30",
    status: "deactivated",
    avatar: "DK",
  },
  {
    id: "u9",
    name: "Rachel Green",
    email: "rachel@example.com",
    role: "instructor",
    joinDate: "2024-07-12",
    status: "active",
    avatar: "RG",
  },
  {
    id: "u10",
    name: "Omar Hassan",
    email: "omar@example.com",
    role: "student",
    joinDate: "2025-02-01",
    status: "active",
    avatar: "OH",
  },
  {
    id: "u11",
    name: "Nina Torres",
    email: "nina@example.com",
    role: "student",
    joinDate: "2024-12-22",
    status: "active",
    avatar: "NT",
  },
  {
    id: "u12",
    name: "Liam Brooks",
    email: "liam@example.com",
    role: "instructor",
    joinDate: "2024-06-14",
    status: "suspended",
    avatar: "LB",
  },
];

export const adminCourses: AdminCourse[] = [
  {
    id: "ac1",
    title: "Advanced React Patterns",
    instructorName: "Sarah Johnson",
    category: "Web Development",
    status: "published",
    enrolledStudents: 342,
    thumbnail: "/placeholder.svg",
  },
  {
    id: "ac2",
    title: "Machine Learning Fundamentals",
    instructorName: "Emily Chen",
    category: "Data Science",
    status: "published",
    enrolledStudents: 518,
    thumbnail: "/placeholder.svg",
  },
  {
    id: "ac3",
    title: "UI/UX Design Masterclass",
    instructorName: "Alex Turner",
    category: "Design",
    status: "published",
    enrolledStudents: 276,
    thumbnail: "/placeholder.svg",
  },
  {
    id: "ac4",
    title: "Python for Beginners",
    instructorName: "Rachel Green",
    category: "Programming",
    status: "draft",
    enrolledStudents: 0,
    thumbnail: "/placeholder.svg",
  },
  {
    id: "ac5",
    title: "Cloud Architecture with AWS",
    instructorName: "Sarah Johnson",
    category: "Cloud Computing",
    status: "published",
    enrolledStudents: 189,
    thumbnail: "/placeholder.svg",
  },
  {
    id: "ac6",
    title: "Digital Marketing 101",
    instructorName: "Alex Turner",
    category: "Marketing",
    status: "archived",
    enrolledStudents: 95,
    thumbnail: "/placeholder.svg",
  },
  {
    id: "ac7",
    title: "Node.js Backend Development",
    instructorName: "Emily Chen",
    category: "Web Development",
    status: "published",
    enrolledStudents: 410,
    thumbnail: "/placeholder.svg",
  },
  {
    id: "ac8",
    title: "Data Visualization with D3",
    instructorName: "Rachel Green",
    category: "Data Science",
    status: "published",
    enrolledStudents: 156,
    thumbnail: "/placeholder.svg",
  },
  {
    id: "ac9",
    title: "Mobile App with Flutter",
    instructorName: "Liam Brooks",
    category: "Mobile Development",
    status: "draft",
    enrolledStudents: 0,
    thumbnail: "/placeholder.svg",
  },
  {
    id: "ac10",
    title: "Cybersecurity Essentials",
    instructorName: "Sarah Johnson",
    category: "Security",
    status: "published",
    enrolledStudents: 231,
    thumbnail: "/placeholder.svg",
  },
];

export const categories: Category[] = [
  {
    id: "cat1",
    name: "Web Development",
    slug: "web-development",
    description: "Frontend and backend web technologies",
    courseCount: 12,
  },
  {
    id: "cat2",
    name: "Data Science",
    slug: "data-science",
    description: "ML, AI, and data analytics",
    courseCount: 8,
  },
  {
    id: "cat3",
    name: "Design",
    slug: "design",
    description: "UI/UX, graphic, and product design",
    courseCount: 6,
  },
  {
    id: "cat4",
    name: "Programming",
    slug: "programming",
    description: "General programming languages and concepts",
    courseCount: 15,
  },
  {
    id: "cat5",
    name: "Cloud Computing",
    slug: "cloud-computing",
    description: "AWS, GCP, Azure cloud services",
    courseCount: 4,
  },
  {
    id: "cat6",
    name: "Marketing",
    slug: "marketing",
    description: "Digital and content marketing",
    courseCount: 3,
  },
  {
    id: "cat7",
    name: "Mobile Development",
    slug: "mobile-development",
    description: "iOS, Android, and cross-platform apps",
    courseCount: 5,
  },
  {
    id: "cat8",
    name: "Security",
    slug: "security",
    description: "Cybersecurity and information security",
    courseCount: 3,
  },
];

export const enrollmentTrend = [
  { date: "Feb 11", students: 42 },
  { date: "Feb 12", students: 58 },
  { date: "Feb 13", students: 45 },
  { date: "Feb 14", students: 71 },
  { date: "Feb 15", students: 63 },
  { date: "Feb 16", students: 89 },
  { date: "Feb 17", students: 76 },
  { date: "Feb 18", students: 94 },
  { date: "Feb 19", students: 82 },
  { date: "Feb 20", students: 105 },
];

export const revenueSummary = [
  { month: "Sep", revenue: 12400 },
  { month: "Oct", revenue: 18200 },
  { month: "Nov", revenue: 15800 },
  { month: "Dec", revenue: 22100 },
  { month: "Jan", revenue: 19600 },
  { month: "Feb", revenue: 24300 },
];

export const topCourses = [
  {
    title: "Machine Learning Fundamentals",
    enrollments: 518,
    instructor: "Emily Chen",
  },
  {
    title: "Node.js Backend Development",
    enrollments: 410,
    instructor: "Emily Chen",
  },
  {
    title: "Advanced React Patterns",
    enrollments: 342,
    instructor: "Sarah Johnson",
  },
  {
    title: "UI/UX Design Masterclass",
    enrollments: 276,
    instructor: "Alex Turner",
  },
  {
    title: "Cybersecurity Essentials",
    enrollments: 231,
    instructor: "Sarah Johnson",
  },
];

export const completionStats = [
  { course: "Advanced React", rate: 78 },
  { course: "ML Fundamentals", rate: 62 },
  { course: "UI/UX Design", rate: 85 },
  { course: "Cloud AWS", rate: 71 },
  { course: "Node.js Backend", rate: 58 },
  { course: "Cybersecurity", rate: 74 },
  { course: "Data Viz D3", rate: 69 },
];
