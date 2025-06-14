import { api } from "../axios";

export const loginApi = async (data: {
  username: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerApi = async (data: {
  role: string;
  username: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const getProfileApi = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};
