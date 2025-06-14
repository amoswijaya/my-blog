import { api } from "../axios";

export interface CategoryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getCategoriesApi = async (params: CategoryParams) => {
  try {
    const res = await api.get("/categories", {
      params: params,
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};

export const postCategoryApi = async (data: { name: string }) => {
  try {
    const res = await api.post("/categories", data);
    return res.data;
  } catch (error) {
    console.error("Failed to create category:", error);
    throw error;
  }
};
export const updateCategoryApi = async (
  id: string,
  data: {
    name: string;
  }
) => {
  try {
    const res = await api.put(`/categories/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Failed to update category:", error);
    throw error;
  }
};
export const deleteCategoryApi = async (id: string) => {
  try {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete category:", error);
    throw error;
  }
};
