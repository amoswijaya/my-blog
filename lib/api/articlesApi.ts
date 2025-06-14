import { api } from "../axios";
export interface ArticlesParams {
  articleId?: string;
  userId?: string;
  title?: string;
  category?: string;
  createdAtStart?: string; // Format 'YYYY-MM-DD'
  createdAtEnd?: string; // Format 'YYYY-MM-DD'
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ArticlesApiResponse {
  data: any;
  total: number;
  page: number;
  limit: number;
}

export const getArticlesApi = async (params: ArticlesParams) => {
  try {
    const res = await api.get<ArticlesApiResponse>("/articles", {
      params: params,
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    throw error;
  }
};
export const getArticleByIdApi = async (id: string) => {
  const res = await api.get(`/articles/${id}`);
  return res.data;
};
export const createArticleApi = async (data: {
  title: string;
  content: string;
  imageUrl?: string;
  categoryId: string;
}) => {
  const res = await api.post("/articles", data);
  return res.data;
};
export const updateArticleApi = async (
  id: string,
  data: {
    title: string;
    content: string;
    imageUrl?: string;
    categoryId: string;
  }
) => {
  const res = await api.put(`/articles/${id}`, data);
  return res.data;
};
export const deleteArticleApi = async (id: string) => {
  const res = await api.delete(`/articles/${id}`);
  return res.data;
};
