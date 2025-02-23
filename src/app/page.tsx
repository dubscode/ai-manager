import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { UserButton } from '@/components/auth/user-button';
import logo from '@/images/logo-icon.svg';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b border-slate-800 p-4'>
        <div className='container mx-auto flex items-center justify-between'>
          <Link
            href='/'
            className='flex items-center gap-2'
          >
            <Image
              src={logo}
              alt='logo'
              width={30}
              height={30}
            />
            <h2 className='text-lg font-semibold text-white'>AI Manager</h2>
          </Link>
          <UserButton />
        </div>
      </header>
      <div className='container mx-auto px-4 py-24'>
        <div className='flex flex-col items-center text-center'>
          <h1 className='mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl'>
            AI-Powered Standup Management
          </h1>
          <p className='mb-12 max-w-2xl text-lg text-slate-300'>
            Streamline your daily standups with AI assistance. Get insights,
            track progress, and keep your team aligned with our intelligent
            standup management platform.
          </p>
          <SignedOut>
            <SignInButton mode='modal'>
              <Button className='bg-cyan-500 text-lg text-white hover:bg-cyan-600'>
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href='/dashboard'>
              <Button className='bg-cyan-500 text-lg text-white hover:bg-cyan-600'>
                Go to Dashboard
              </Button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
