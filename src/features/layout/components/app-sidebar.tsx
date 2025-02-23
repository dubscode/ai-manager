import { BarChart3, Calendar, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import Image from 'next/image';
import Link from 'next/link';
import logo from '@/images/logo-icon.svg';

export function AppSidebar() {
  return (
    <Sidebar className='border-r border-slate-800'>
      <SidebarHeader className='border-b border-slate-800 p-4'>
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
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className='w-full text-slate-200'
              asChild
            >
              <Link href='/dashboard'>
                <Calendar className='mr-2 h-4 w-4' />
                <span>Standups</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className='w-full text-slate-200'
              asChild
            >
              <Link href='/dashboard/reports'>
                <BarChart3 className='mr-2 h-4 w-4' />
                <span>Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className='w-full text-slate-200'
              asChild
            >
              <Link href='/dashboard/settings'>
                <Settings className='mr-2 h-4 w-4' />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
