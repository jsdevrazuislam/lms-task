import { instructorRepository } from './instructor.repository.js';

const getDashboardStats = async (instructorId: string) => {
  return instructorRepository.getStats(instructorId);
};

const getInstructorCourses = async (instructorId: string) => {
  return instructorRepository.getCourses(instructorId);
};

const getInstructorStudents = async (instructorId: string) => {
  return instructorRepository.getStudents(instructorId);
};

export const instructorService = {
  getDashboardStats,
  getInstructorCourses,
  getInstructorStudents,
};
