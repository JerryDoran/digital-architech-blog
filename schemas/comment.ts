import { Id } from '@/convex/_generated/dataModel';
import z from 'zod';

export const commentSchema = z.object({
  comment: z
    .string()
    .min(3, { message: 'Comment must be at least 3 characters' }),
  postId: z.custom<Id<'posts'>>(),
});

export type Comment = z.infer<typeof commentSchema>;
