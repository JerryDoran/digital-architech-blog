'use server';

import { api } from '@/convex/_generated/api';
import { getToken } from '@/lib/auth-server';
import { Blog, blogSchema } from '@/schemas/blog';
import { fetchMutation } from 'convex/nextjs';
import { redirect } from 'next/navigation';

// This is treated like a public api endpoint
export async function createBlogAction(values: Blog) {
  // validate data
  const parsed = blogSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  // make sure to add authentication logic and validation logic
  const token = await getToken();

  await fetchMutation(
    api.posts.createPost,
    {
      title: parsed.data.title,
      content: parsed.data.content,
    },
    { token }
  );

  return redirect('/');
}
