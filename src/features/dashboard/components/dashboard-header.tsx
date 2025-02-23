import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserButton } from '@/components/auth/user-button';

export function DashboardHeader() {
  return (
    <header className='sticky top-0 z-50 border-b border-slate-800 bg-background p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <SidebarTrigger />
          <h1 className='text-xl font-bold text-white'>Dashboard</h1>
        </div>
        <UserButton />
      </div>
    </header>
  );
}
