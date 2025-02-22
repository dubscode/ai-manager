import {
  UserButton as ClerkUserButton,
  SignInButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';

export function UserButton() {
  return (
    <div className='flex items-center'>
      <SignedOut>
        <SignInButton mode='modal'>
          <button className='text-white hover:text-slate-200'>Sign In</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <ClerkUserButton
          appearance={{
            elements: {
              userButtonAvatarBox: 'h-8 w-8',
              userButtonTrigger:
                'focus:shadow-none focus:ring-2 focus:ring-slate-500',
            },
          }}
        />
      </SignedIn>
    </div>
  );
}
