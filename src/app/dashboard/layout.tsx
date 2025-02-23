import { AppSidebar } from '@/features/layout/components/app-sidebar';
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className='flex min-h-screen w-full bg-[#1a1f36]'>
        <AppSidebar />
        <div className='flex-1'>
          <DashboardHeader />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
