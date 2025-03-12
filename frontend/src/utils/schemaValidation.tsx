import { z } from "zod";

export const signupSchema = z.object({
  userName: z.string().min(1, "UserName is Required"),
  email: z
    .string()
    .nonempty("Email Id Required")
    .email("Invalid email address"),
  password: z.string().min(6, "minimum six Character is Required"),
});

export const logInpSchema = z.object({
  email: z
    .string()
    .nonempty("Email Id Required")
    .email("Invalid email address"),
  password: z.string().min(6, "minimum six Character is Required"),
});
