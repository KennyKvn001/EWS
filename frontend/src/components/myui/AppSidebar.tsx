import * as React from "react"
import { NavLink } from "react-router"
import {
  SquareChartGantt,
  BrainCircuit,
  TriangleAlertIcon,
  LayoutDashboardIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Menu items
const items = [
  {
    title: "Overview",
    url: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Predictions",
    url: "/predictions",
    icon: BrainCircuit,
  },
  {
    title: "At-Risk Students",
    url: "/at-risk-view",
    icon: TriangleAlertIcon,
  },
  {
    title: "Simulations",
    url: "/simulation",
    icon: SquareChartGantt,
  },
]

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            L
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">EWS App</span>
            <span className="truncate text-xs">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="cursor-pointer">
                  <NavLink to={item.url}>
                    {({ isActive }) => (
                      <SidebarMenuButton 
                        tooltip={item.title} 
                        isActive={isActive}
                        className={isActive ? "bg-primary border-b-2 text-primary-foreground shadow-sm" : "cursor-pointer;.'=-"}
                      >
                        <item.icon/>
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarRail />
    </Sidebar>
  )
}
