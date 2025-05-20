import { useContext, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Settings,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AuthContext } from "@/context/auth-context"

export function InstructorSidebar() {
  const location = useLocation()
  const pathname = location.pathname
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { resetCredentials } = useContext(AuthContext)

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/instructor",
      active: pathname === "/instructor",
    },
    {
      label: "Courses",
      icon: BookOpen,
      href: "/instructor/courses",
      active:
        pathname === "/instructor/courses" ||
        pathname.startsWith("/instructor/courses/"),
    },
    {
      label: "Students",
      icon: Users,
      href: "/instructor/students",
      active: pathname === "/instructor/students",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/instructor/settings",
      active: pathname === "/instructor/settings",
    },
    {
      label: "LogOut",
      icon: LogOut,
      onClick: () => {
        handleLogout();
      }
    }
  ]

  // Handle Logout
  const handleLogout = () => {
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
      <div className="flex h-14 items-center border-b px-3">
        <Link
          to="/instructor"
          className={cn(
            "flex items-center gap-2 font-semibold",
            isCollapsed && "justify-center",
          )}
        >
          {!isCollapsed && <div className="flex gap-1">
            <GraduationCap className="h-6 w-6" />
            <span>Instructor</span>
          </div>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-3"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <PanelLeft className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="flex flex-col gap-1">
          {routes.map((route) => {
            const commonClasses = cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
              route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              isCollapsed && "justify-center px-2",
            );
            // render a button for logout
            if (route.onClick) {
              return (
                <button
                  key="logout"
                  onClick={route.onClick}
                  className={commonClasses}
                >
                  <route.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{route.label}</span>}
                </button>
              );
            }

            // otherwise it’s a normal link
            return (
              <Link
                key={route.href}
                to={route.href}
                className={commonClasses}
              >
                <route.icon className="h-5 w-5" />
                {!isCollapsed && <span>{route.label}</span>}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
