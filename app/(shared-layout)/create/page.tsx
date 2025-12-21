'use client';

import { useTransition } from 'react';
import { Blog, blogSchema } from '@/schemas/blog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createBlogAction } from '@/actions';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function CreatePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const mutation = useMutation(api.posts.createPost); // automatically sends auth token to server for authentication
  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      content: '',
      image: undefined,
    },
  });

  function onSubmit(values: Blog) {
    // call convex mutation function
    startTransition(async () => {
      // using convex call from client
      // mutation({
      //   title: values.title,
      //   content: values.content,
      // });

      // using server action
      await createBlogAction(values);
      toast.success('Blog created successfully');

      // using api call from client
      // await fetch('/api/create-blog', {
      //   method: 'POST',
      // });

      // router.push('/');
    });
  }

  return (
    <div className='py-12'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl'>
          Create Post
        </h1>
        <p className='text-xl text-muted-foreground pt-4'>
          Share your thoughts...
        </p>
      </div>
      <Card className='w-full max-w-xl mx-auto'>
        <CardHeader>
          <CardTitle>Create Blog Article</CardTitle>
          <CardDescription>
            Start crafting your next compelling piece
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className='gap-y-4'>
              <Controller
                name='title'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Blog Title</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      {...field}
                      placeholder='My blog title'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='content'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      {...field}
                      placeholder='Compelling blog article'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='image'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Image</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder='Compelling blog article'
                      type='file'
                      accept='image/*'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button disabled={isPending} className='cursor-pointer'>
                {isPending ? (
                  <>
                    <Loader2 className='size-4 animate-spin' />
                    <span>Creating post...</span>
                  </>
                ) : (
                  <span>Create Post</span>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
