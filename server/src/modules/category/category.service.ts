import prisma from '../../config/prisma.js';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    courses: number;
  };
}

const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });
};

const createCategory = async (data: {
  name: string;
  slug: string;
  description?: string;
}) => {
  return await prisma.category.create({
    data,
  });
};

const updateCategory = async (
  id: string,
  data: { name: string; slug: string; description?: string }
) => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};

export const CategoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
