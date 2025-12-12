'use client';

import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogsPage() {
  const data = useQuery(api.posts.getPosts);

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
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {data?.map((post) => (
          <Link href={`/blogs/${post._id}`} key={post._id} className='group'>
            <Card>
              <div className='h-48 w-full overflow-hidden relative'>
                <Image
                  src='https://images.unsplash.com/photo-1764377848067-aefbce306f80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8'
                  alt={post.title}
                  fill
                  className='object-cover'
                />
              </div>
              <CardContent>
                <h2 className='text-2xl font-bold group-hover:text-primary transition-colors'>
                  {post.title}
                </h2>
              </CardContent>
            </Card>{' '}
          </Link>
        ))}
      </div>
    </div>
  );
}
