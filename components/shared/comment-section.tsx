'use client';

import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
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
import { start } from 'repl';

export default function CommentSection() {
  const [isPending, startTransition] = useTransition();

  const params = useParams<{ postId: Id<'posts'> }>();
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
        toast.success('Comment created successfully');
        form.reset();
      } catch {
        toast.error('Failed to create comment');
      }
    });
  }

  return (
    <Card>
      <CardHeader className='flex items-center gap-2 border-b'>
        <MessageSquare className='mr-2 size-5' />
        <h2 className='text-xl font-bold'>5 comments</h2>
      </CardHeader>
      <CardContent className='space-y-2'>
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
      </CardContent>
    </Card>
  );
}
