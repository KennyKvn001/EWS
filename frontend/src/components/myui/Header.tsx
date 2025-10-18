
import DropdownMenuWithIcon from "@/components/customized/dropdown-menu/dropdown-menu-02"
import { ModeToggle } from "./ThemeToggle"
import { Bell, PanelLeft } from "lucide-react"

interface HeaderProps {
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between bg-white dark:bg-gray-900 rounded-xl py-5 px-8 shadow-sm">
      {/* Left side - Sidebar Toggle */}
      <div className="flex items-center">
        <button 
          onClick={onToggleSidebar}
          className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          title="Toggle Sidebar"
        >
          <PanelLeft className="size-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
          <Bell className="size-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
        <ModeToggle />
        <DropdownMenuWithIcon />
      </div>
    </header>
  )
}
