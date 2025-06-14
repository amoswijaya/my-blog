import { api } from "../axios";

export const uploadImageApi = async (file: File | undefined) => {
  const formData = new FormData();
  formData.append("image", file as Blob);

  try {
    const res = await api.post<{ imageUrl: string }>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.imageUrl;
  } catch (error) {
    console.error("Failed to upload image:", error);
    throw error;
  }
};
