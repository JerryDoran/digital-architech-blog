import { getToken } from '@/lib/auth-server';
import { fetchQuery, preloadQuery } from 'convex/nextjs';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import CommentSection from '@/components/shared/comment-section';
import PostPresence from '@/components/shared/post-presence';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

type PostIdProps = {
  params: Promise<{
    postId: Id<'posts'>;
  }>;
};

export async function generateMetadata({
  params,
}: PostIdProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await fetchQuery(api.posts.getPostDetails, { postId });

  if (!post) {
    return {
      title: 'Post Not Found | Next.js Convex App',
      description: 'The requested blog post was not found.',
    };
  }

  return {
    title: post.title,
    description: post.content.slice(0, 160),
    keywords: ['Blog Post', `${post.title}`, 'Small business'],
    authors: [
      { name: 'The Web Architech', url: 'https://thewebarchitech.com' },
    ],
  };
}

export default async function PostIdRoute({ params }: PostIdProps) {
  const { postId } = await params;
  const token = await getToken();

  const [post, preloadedComments, userId] = await Promise.all([
    await fetchQuery(api.posts.getPostDetails, { postId }),
    await preloadQuery(api.comments.getCommentsByPostId, { postId }),
    await fetchQuery(api.presence.getUserId, {}, { token }), // Preload user ID for presence
  ]);

  // Multi-layered auth check - checks proxy then per-page
  if (!userId) {
    return redirect('/auth/login');
  }

  if (!post) {
    return (
      <div className=''>
        <h1 className='text-6xl font-bold py-20 text-muted-foreground'>
          No post found
        </h1>
      </div>
    );
  }
  return (
    <div className='max-w-3xl mx-auto py-8 animate-in fade-in duration-1000 relative'>
      <Link
        href='/blogs'
        className={buttonVariants({ variant: 'outline', className: 'mb-6' })}
      >
        <ArrowLeft className='size-4' />
        Back to blogs
      </Link>
      <div className='relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-sm'>
        <Image
          src={
            post.imageUrl ??
            'https://images.unsplash.com/photo-1764377848067-aefbce306f80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8'
          }
          alt={post.title}
          fill
          className='object-cover hover:scale-105 transition-transform duration-300'
        />
      </div>
      <div className='space-y-4 flex flex-col'>
        <h1 className='text-4xl font-bold'>{post.title}</h1>
        <div className='flex items-center gap-4'>
          <p className='text-sm text-muted-foreground'>
            Posted on {new Date(post._creationTime).toLocaleDateString()}
          </p>
          {userId && <PostPresence roomId={post._id} userId={userId} />}
        </div>
      </div>
      <Separator className='my-8' />
      <p className='text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap'>
        {post.content}
      </p>
      <Separator className='my-8' />
      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
}
