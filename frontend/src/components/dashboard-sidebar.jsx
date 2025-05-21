import { useContext, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Book,
  LayoutDashboard,
  LogOut,
  PanelLeft,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AuthContext } from "@/context/auth-context"

export function DashboardSidebar() {
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { resetCredentials } = useContext(AuthContext)

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/student/dashboard",
      active: pathname === "/student/dashboard",
    },
    {
      label: "My Courses",
      icon: Book,
      href: "/student/my-courses",
      active: pathname === "/student/my-courses",
    },
    {
      label: "Log Out",
      icon: LogOut,
      onClick: () => {
        handleLogOut();
      },
    },
  ]
  // Handle LogOut
  const handleLogOut = () => {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[240px]",
      )}
    >
      <div className="flex h-14 items-center justify-end border-b px-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsCollapsed(!isCollapsed)}>
          <PanelLeft className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <div className="flex flex-col gap-1">
          {routes.map((route, index) => {
            const isLogout = typeof route.onClick === "function";

            return isLogout ? (
              <button
                key={index}
                onClick={route.onClick}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  "text-muted-foreground",
                  isCollapsed && "justify-center px-2",
                )}
              >
                <route.icon className={cn("h-5 w-5", isCollapsed && "h-5 w-5")} />
                {!isCollapsed && <span>{route.label}</span>}
              </button>
            ) : (
              <Link
                key={route.href}
                to={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  isCollapsed && "justify-center px-2",
                )}
              >
                <route.icon className={cn("h-5 w-5", isCollapsed && "h-5 w-5")} />
                {!isCollapsed && <span>{route.label}</span>}
              </Link>
            );
          })}

        </div>
      </ScrollArea>
    </div>
  )
}
