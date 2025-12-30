## Project Overview

This is a Next.js web application that uses Convex for the backend. The application is a blog platform that allows users to create, read, and comment on blog posts.

**Main Technologies:**

*   **Framework:** Next.js
*   **Backend:** Convex (database, serverless functions)
*   **Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui
*   **Authentication:** Convex Auth

## Building and Running

### Running the development server

To run the development server, use the following command:

```bash
pnpm dev
```

### Building for Production

To build the application for a production environment, use the following command:

```bash
pnpm run build
```

## SEO Optimization

All pages should be optimized for SEO. Here is a minimum example of metadata that should be included on each page:

```typescript
export const metadata: Metadata = {
  title: 'Blogs | Next.js Convex App',
  description: 'Read our latest articles and insights',
  keywords: ['Blogs', 'Web Development', 'Next.js', 'Convex', 'React'],
  authors: [{ name: 'The Web Architech', url: 'https://thewebarchitech.com' }],
};
```

## Additional Coding Preferences

- Always use tailwind css for styling
- Use Shadcn component library and all the necessary dependencies
