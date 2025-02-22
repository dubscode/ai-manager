import { UserButton } from '@/components/auth/user-button';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function DashboardHeader() {
  return (
    <header className='border-b border-slate-800 bg-[#1a1f36] p-4'>
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
