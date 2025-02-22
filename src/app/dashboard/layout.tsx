import { SidebarProvider } from '@/components/ui/sidebar';

import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';
import { AppSidebar } from '@/features/layout/components/app-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
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
