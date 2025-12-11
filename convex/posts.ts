import { ConvexError, v } from 'convex/values';
import { mutation } from './_generated/server';
import { authComponent } from './auth';

export const createPost = mutation({
  args: { title: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError('Unauthorized');
    }
    const blogArticle = await ctx.db.insert('posts', {
      title: args.title,
      content: args.content,
      authorId: user._id,
    });

    return blogArticle;
  },
});
