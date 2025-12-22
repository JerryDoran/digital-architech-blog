'use client';

import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { Preloaded, useMutation, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Comment, commentSchema } from '@/schemas/comment';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MessageSquare } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function CommentSection(props: {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}) {
  const params = useParams<{ postId: Id<'posts'> }>();

  const data = usePreloadedQuery(props.preloadedComments);

  const [isPending, startTransition] = useTransition();

  const createComment = useMutation(api.comments.createComment);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      postId: params.postId,
      comment: '',
    },
  });

  function onSubmit(data: Comment) {
    startTransition(async () => {
      try {
        await createComment(data);
        form.reset();
        toast.success('Comment created successfully');
      } catch {
        toast.error('Failed to create comment');
      }
    });
  }

  if (data === undefined) {
    return <Loader2 className='size-4 animate-spin' />;
  }

  return (
    <Card>
      <CardHeader className='flex items-center gap-2 border-b'>
        <MessageSquare className='mr-2 size-5' />
        <h2 className='text-xl font-bold'>{data?.length} Comments</h2>
      </CardHeader>
      <CardContent className='space-y-8'>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name='comment'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Comment</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  {...field}
                  placeholder='Share your thoughts'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            disabled={isPending}
            className='cursor-pointer hover:bg-white/70 transition'
          >
            {isPending ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                <span>Creating comment...</span>
              </>
            ) : (
              <span>Submit</span>
            )}
          </Button>
        </form>
        {data?.length > 0 && <Separator />}
        <section className='space-y-6'>
          {data?.map((comment) => (
            <div key={comment._id} className='flex gap-4 items-center'>
              <Avatar className='size-10 shrink-0'>
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 space-y-1'>
                <div className='flex items-center justify-between'>
                  <p className='font font-semibold text-sm'>
                    {comment.authorName}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {new Date(comment._creationTime).toLocaleDateString(
                      'en-US'
                    )}
                  </p>
                </div>
                <p className='text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed'>
                  {comment.comment}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
