'use server';

import { api } from '@/convex/_generated/api';
import { getToken } from '@/lib/auth-server';
import { blogSchema } from '@/schemas/blog';
import { fetchMutation } from 'convex/nextjs';
import { revalidatePath, updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import z from 'zod';

// This is treated like a public api endpoint
export async function createBlogAction(values: z.infer<typeof blogSchema>) {
  try {
    // validate data
    const parsed = blogSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error('Something went wrong');
    }

    // make sure to add authentication logic and validation logic
    const token = await getToken();

    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token }
    );

    console.log('IMAGE URL', imageUrl);

    const uploadResult = await fetch(imageUrl, {
      method: 'POST',
      headers: {
        'Content-Type': parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      return {
        error: 'Failed to upload image',
      };
    }

    const { storageId } = await uploadResult.json();
    await fetchMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        content: parsed.data.content,
        imageStorageId: storageId,
      },
      { token }
    );
  } catch (error) {
    console.log(error);
    return {
      error: 'Failed to create post',
    };
  }

  // revalidate cache
  updateTag('blogs');

  return redirect('/blogs');
}
