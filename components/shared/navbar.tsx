'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useConvexAuth } from 'convex/react';

import { Button, buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet';
import { Menu } from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false); // Add open state for Sheet
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <header className='w-full h-16 py-5 flex items-center justify-between relative'>
      <div className='flex items-center gap-8'>
        <Link href='/'>
          <h1 className='text-2xl font-bold'>
            Digital{' '}
            <span className='bg-linear-to-r from-blue-500 via-indigo-500 to-indigo-400 bg-clip-text text-transparent'>
              Architech
            </span>
          </h1>
        </Link>
        <nav className='gap-2'>
          <div className='flex items-center'>
            <Link className={buttonVariants({ variant: 'ghost' })} href='/'>
              Home
            </Link>
            <Link
              className={buttonVariants({ variant: 'ghost' })}
              href='/blogs'
            >
              Blogs
            </Link>
            <Link
              className={buttonVariants({ variant: 'ghost' })}
              href='/create'
            >
              Create
            </Link>
          </div>

          {/* <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className=''>
              <Menu className='md:hidden cursor-pointer absolute right-4 top-8' />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className='mt-6'>
                Logo goes here
                {/* <Logo /> */}
          {/* </SheetHeader> */}

          {/* <ul className='items-start text-sm flex flex-col gap-6 p-4 pl-10'>
                <li className='transition-colors hover:bg-accent py-1.5 px-3 rounded-md'>
                  <Link href='/' onClick={() => setOpen(false)}>
                    Home
                  </Link>
                </li>
                <li className='transition-colors hover:bg-accent py-1.5 px-3 rounded-md'>
                  <Link href='/about' onClick={() => setOpen(false)}>
                    About
                  </Link>
                </li>
                <li className='transition-colors hover:bg-accent py-1.5 px-3 rounded-md'>
                  <Link href='/blogs' onClick={() => setOpen(false)}>
                    Blogs
                  </Link>
                </li>
                <li className='transition-colors hover:bg-accent py-1.5 px-3 rounded-md mr-4'>
                  <Link href='/contact' onClick={() => setOpen(false)}>
                    Contact
                  </Link>
                </li>
              </ul> */}
          {/* </SheetContent> */}
          {/* </Sheet> */}
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
