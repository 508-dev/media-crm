import { z } from "zod";

export const UserSignup = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z.string().optional(),
});
export type UserSignup = z.infer<typeof UserSignup>;

export const UserLogin = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type UserLogin = z.infer<typeof UserLogin>;

export const User = z.object({
  id: z.number(),
  email: z.string(),
  displayName: z.string().nullable(),
  createdAt: z.string(),
});
export type User = z.infer<typeof User>;
