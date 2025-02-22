import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { BarChart3, Calendar, Settings } from 'lucide-react';

import logo from '@/images/logo-icon.svg';
import Image from 'next/image';
import Link from 'next/link';

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
            <SidebarMenuButton className='w-full text-slate-200'>
              <Calendar className='mr-2 h-4 w-4' />
              <span>Standups</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className='w-full text-slate-200'>
              <BarChart3 className='mr-2 h-4 w-4' />
              <span>Reports</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className='w-full text-slate-200'>
              <Settings className='mr-2 h-4 w-4' />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
