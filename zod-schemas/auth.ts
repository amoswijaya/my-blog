import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username field cannot be empty"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const registerSchema = z.object({
  username: z.string().nonempty("Username field cannot be empty"),
  password: z
    .string()
    .nonempty("Password field connot be empty")
    .min(8, "Password must be at least 8 characters long"),
  role: z.enum(["Admin", "User"], {
    required_error: "Role wajib dipilih.",
  }),
});
