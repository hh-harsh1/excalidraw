import z, { string } from "zod";

export const signupSchema = z.object({
  name: string().min(3).max(20),
  email: string().min(3).max(20),
  password: z
    .string()
    .min(8, "password length should at least 8 character long"),
});

export const signinSchema = z.object({
  name: string().min(3).max(20),
  password: z
    .string()
    .min(8, "password length should at least 8 character long"),
});

export const createRoomSchema = z.object({
  room: string().min(3).max(20),
});
