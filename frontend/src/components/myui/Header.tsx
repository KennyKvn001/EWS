
import { SidebarTrigger } from "@/components/ui/sidebar"
import DropdownMenuWithIcon from "@/components/customized/dropdown-menu/dropdown-menu-02"
import { ModeToggle } from "./ThemeToggle"

export default function Header() {
  return (
    <header className="flex justify-between bg-transparent py-4 px-4 border-b">
      {/* Left side - Sidebar trigger and Logo */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-bold">EWS</h1>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4 right-8 relative">
        {/* Theme Toggle */}
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>

        {/* User Avatar with Dropdown */}
        <DropdownMenuWithIcon />
      </div>
    </header>
  )
}
