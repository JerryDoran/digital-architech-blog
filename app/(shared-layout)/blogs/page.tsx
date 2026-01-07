// 'use client';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { Metadata } from 'next';
// import { useQuery } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export const dynamic = 'force-static';
export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: 'Blogs | Next.js Convex App',
  description: 'Read our latest articles and insights',
  keywords: ['Blogs', 'Web Development', 'Next.js', 'Convex', 'React'],
  authors: [{ name: 'The Web Architech', url: 'https://thewebarchitech.com' }],
};

export default async function BlogsPage() {
  // const data = useQuery(api.posts.getPosts);  // for client side data fetching

  return (
    <div className='py-12'>
      <div className='text-center pb-12'>
        <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl'>
          Our Blog
        </h1>
        <p className='pt-4 max-w-2xl mx-auto text-xl text-muted-foreground'>
          Insights, thoughts and trends from our team!
        </p>
      </div>
      <Suspense fallback={<BlogSkeletonLoader />}>
        <LoadBlogsList />
      </Suspense>
    </div>
  );
}

async function LoadBlogsList() {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const data = await fetchQuery(api.posts.getPosts);

  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {data?.map((post) => {
        return (
          <Card key={post._id} className='pt-0'>
            <div className='h-48 w-full overflow-hidden relative'>
              <Image
                src={
                  post.imageUrl ??
                  'https://images.unsplash.com/photo-1764377848067-aefbce306f80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8'
                }
                alt={post.title}
                fill
                className='object-cover rounded-t-lg'
              />
            </div>
            <CardContent>
              <Link href={`/blogs/${post._id}`}>
                <h2 className='text-2xl font-bold hover:text-primary transition-colors'>
                  {post.title}
                </h2>
              </Link>
              <p className='text-muted-foreground line-clamp-3'>
                {post.content}
              </p>
            </CardContent>
            <CardFooter>
              <Link
                href={`/blogs/${post._id}`}
                className={buttonVariants({
                  className: 'w-full',
                })}
              >
                Read more
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

function BlogSkeletonLoader() {
  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className='animate-pulse'>
          <div className='h-48 w-full bg-muted rounded-lg' />
          <div className='h-4 w-1/3 bg-muted rounded-lg mt-4' />
          <div className='h-4 w-1/2 bg-muted rounded-lg mt-2' />
          <div className='h-4 w-1/4 bg-muted rounded-lg mt-2' />
        </div>
      ))}
    </div>
  );
}
