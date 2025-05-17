import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  BarChart,
  BookOpen,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PanelLeft,
  Settings,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function InstructorSidebar() {
  const location = useLocation()
  const pathname = location.pathname
  const [isCollapsed, setIsCollapsed] = useState(false)

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
      label: "Analytics",
      icon: BarChart,
      href: "/instructor/analytics",
      active: pathname === "/instructor/analytics",
    },
    {
      label: "Reviews",
      icon: MessageSquare,
      href: "/instructor/reviews",
      active: pathname === "/instructor/reviews",
    },
    {
      label: "Announcements",
      icon: FileText,
      href: "/instructor/announcements",
      active: pathname === "/instructor/announcements",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/instructor/settings",
      active: pathname === "/instructor/settings",
    },
    {
      label: "Help & Support",
      icon: HelpCircle,
      href: "/instructor/support",
      active: pathname === "/instructor/support",
    },
  ]

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
          <GraduationCap className="h-6 w-6" />
          {!isCollapsed && <span>Instructor</span>}
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
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                route.active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
                isCollapsed && "justify-center px-2",
              )}
            >
              <route.icon className={cn("h-5 w-5", isCollapsed && "h-5 w-5")} />
              {!isCollapsed && <span>{route.label}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto border-t p-3">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            isCollapsed && "justify-center px-2",
          )}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Back to Site</span>}
        </Link>
      </div>
    </div>
  )
}
