import express from 'express';

import { authRoutes } from '../modules/auth/auth.routes.js';
import { CourseRoutes } from '../modules/course/course.routes.js';

const router: express.Router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
