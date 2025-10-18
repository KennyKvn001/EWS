import { Outlet } from 'react-router'
import { useCallback, useState } from 'react'
import Header from '@/components/myui/Header'
import AppSidebar from '@/components/myui/AppSidebar'

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed)
  }, [sidebarCollapsed])

  return (
    <div className="h-full w-full bg-[#f5f5f7] dark:bg-gray-950 p-3 flex gap-4">
      {/* Floating Sidebar */}
      <AppSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Header inside main content */}
        <Header onToggleSidebar={toggleSidebar} />
        
        {/* Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
