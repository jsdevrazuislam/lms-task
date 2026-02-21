import apiClient from "@/lib/apiClient";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  courseCount?: number;
}

export const categoryService = {
  getAllCategories: async () => {
    const response = await apiClient.get<{ data: Category[] }>("/categories");
    return response.data;
  },
  createCategory: async (data: {
    name: string;
    slug: string;
    description?: string;
  }) => {
    const response = await apiClient.post<{ data: Category }>(
      "/categories",
      data,
    );
    return response.data;
  },
  updateCategory: async (
    id: string,
    data: { name: string; slug: string; description?: string },
  ) => {
    const response = await apiClient.patch<{ data: Category }>(
      `/categories/${id}`,
      data,
    );
    return response.data;
  },
  deleteCategory: async (id: string) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
};
