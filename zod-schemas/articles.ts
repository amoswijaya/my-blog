import { z } from "zod";
export const schemaArticles = z.object({
  title: z.string().min(1, "Title is required"),
  categoryId: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content cannot be empty"),
  imageUrl: z.any().optional(),
});
