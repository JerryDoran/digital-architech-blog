'use client';

import Link from 'next/link';
import { useConvexAuth } from 'convex/react';

import { Button, buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <header className='w-full h-16 py-5 flex items-center justify-between'>
      <div className='flex items-center gap-8'>
        <Link href='/'>
          <h1 className='text-2xl font-bold'>
            Digital{' '}
            <span className='bg-linear-to-r from-blue-500 via-indigo-500 to-indigo-400 bg-clip-text text-transparent'>
              Architech
            </span>
          </h1>
        </Link>
        <nav className='flex items-center gap-2'>
          <Link className={buttonVariants({ variant: 'ghost' })} href='/'>
            Home
          </Link>
          <Link className={buttonVariants({ variant: 'ghost' })} href='/blogs'>
            Blogs
          </Link>
          <Link className={buttonVariants({ variant: 'ghost' })} href='/create'>
            Create
          </Link>
        </nav>
      </div>
      <div className='flex items-center gap-2'>
        {isLoading ? null : isAuthenticated ? (
          <Button
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    toast.success('Logged out successfully');
                    router.push('/');
                  },
                  onError: (error) => {
                    toast.error(error.error.message);
                  },
                },
              })
            }
            className='cursor-pointer'
          >
            Logout
          </Button>
        ) : (
          <>
            <Link href='/auth/sign-up' className={buttonVariants()}>
              Sign Up
            </Link>
            <Link
              href='/auth/login'
              className={buttonVariants({ variant: 'outline' })}
            >
              Login
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
