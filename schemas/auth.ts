import z from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  email: z.email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export const signInSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});
