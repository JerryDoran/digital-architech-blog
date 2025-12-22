import CommentSection from '@/components/shared/comment-section';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { fetchQuery, preloadQuery } from 'convex/nextjs';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type PostIdProps = {
  params: Promise<{
    postId: Id<'posts'>;
  }>;
};

export default async function PostIdRoute({ params }: PostIdProps) {
  const { postId } = await params;

  const [post, preloadedComments] = await Promise.all([
    await fetchQuery(api.posts.getPostDetails, { postId }),
    await preloadQuery(api.comments.getCommentsByPostId, { postId }),
  ]);

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
        <p className='text-sm text-muted-foreground'>
          Posted on {new Date(post._creationTime).toLocaleDateString()}
        </p>
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
