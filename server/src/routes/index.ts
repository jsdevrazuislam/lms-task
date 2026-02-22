import express from 'express';

import { AdminRoutes } from '../modules/admin/admin.routes.js';
import { AnalyticsRoutes } from '../modules/analytics/analytics.routes.js';
import { AuthRoutes } from '../modules/auth/auth.routes.js';
import { CategoryRoutes } from '../modules/category/category.routes.js';
import { CourseRoutes } from '../modules/course/course.routes.js';
import { EnrollmentRoutes } from '../modules/enrollment/enrollment.routes.js';
import { InstructorRoutes } from '../modules/instructor/instructor.routes.js';
import { ProgressRoutes } from '../modules/lesson/progress.routes.js';
import { NotificationRoutes } from '../modules/notification/notification.routes.js';
import { SuperAdminRoutes } from '../modules/super-admin/super-admin.routes.js';
import { UploadRoutes } from '../modules/upload/upload.routes.js';
import { UserRoutes } from '../modules/user/user.routes.js';

const router: express.Router = express.Router();

const moduleRoutes = [
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/super-admin',
    route: SuperAdminRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/enrollments',
    route: EnrollmentRoutes,
  },
  {
    path: '/upload',
    route: UploadRoutes,
  },
  {
    path: '/instructor',
    route: InstructorRoutes,
  },
  {
    path: '/student',
    route: ProgressRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/analytics',
    route: AnalyticsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
