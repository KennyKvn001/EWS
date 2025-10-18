import { NavLink } from "react-router"
import {
  SquareChartGantt,
  BrainCircuit,
  TriangleAlertIcon,
  LayoutDashboardIcon,
  GraduationCap,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react"

// Menu items
const menuItems = [
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

const generalItems = [
  {
    title: "Settings",
    icon: Settings,
    onClick: () => console.log('Settings'),
  },
  {
    title: "Help",
    icon: HelpCircle,
    onClick: () => console.log('Help'),
  },
  {
    title: "Logout",
    icon: LogOut,
    onClick: () => console.log('Logout'),
  },
]

interface AppSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function AppSidebar({ collapsed }: AppSidebarProps) {
  return (
    <aside 
      className={`bg-gradient-to-b from-[#1a5f56] via-[#16a085] to-[#0e6f5f] rounded-xl p-4 flex flex-col shadow-xl transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 mb-8 ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shrink-0">
          <GraduationCap className="size-7 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">EWS</span>
            <span className="text-xs text-white/70">Early Warning System</span>
          </div>
        )}
      </div>

      {/* MENU Section */}
      <div className="flex flex-col flex-1">
        {!collapsed && (
          <div className="mb-4">
            <p className="text-white/50 text-xs uppercase tracking-wider font-semibold px-3">MENU</p>
          </div>
        )}
        
        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#0d4d45] text-white shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
              title={collapsed ? item.title : undefined}
            >
              <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                <item.icon className="size-5 shrink-0" />
                {!collapsed && <span className="font-medium text-sm">{item.title}</span>}
              </div>
            </NavLink>
          ))}
        </nav>

        {/* GENERAL Section */}
        <div className="mt-6 pt-6 border-t border-white/10">
          {!collapsed && (
            <p className="text-white/50 text-xs uppercase tracking-wider font-semibold px-3 mb-3">GENERAL</p>
          )}
          <div className="space-y-1">
            {generalItems.map((item) => (
              <button
                key={item.title}
                onClick={item.onClick}
                className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-white/80 hover:bg-white/10 hover:text-white`}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="size-5 shrink-0" />
                {!collapsed && <span className="font-medium text-sm">{item.title}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
