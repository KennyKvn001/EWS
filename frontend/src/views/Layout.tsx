import { Outlet } from 'react-router'
import Header from '@/components/myui/Header'

import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import AppSidebar from '@/components/myui/AppSidebar'

export default function Layout() {
  return (
    <SidebarProvider className="h-full w-full">
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <div className="flex flex-col h-full w-full">
          <Header />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-x-auto overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
