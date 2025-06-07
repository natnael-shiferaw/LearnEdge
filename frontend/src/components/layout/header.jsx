// src/components/Header.jsx
import { GraduationCap, Menu, Sun, Moon } from "lucide-react"
import { useContext } from "react"
import { Link, useLocation } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AuthContext } from "@/context/auth-context"
import { useTheme } from "@/components/theme-provider"

export default function Header() {
  const { pathname } = useLocation()
  const { auth } = useContext(AuthContext)
  const { theme, setTheme } = useTheme()

  const routes = [
    { href: "/",           label: "Home",       active: pathname === "/" },
    { href: "/courses",    label: "Courses",    active: pathname === "/courses" },
    { href: "/categories", label: "Categories", active: pathname === "/categories" },
  ]

  // toggle between 'light' and 'dark'
  const toggle = () => {
    if (theme === "dark") setTheme("light")
    else setTheme("dark")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-6">
              {routes.map(({ href, label, active }) => (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex items-center gap-2 mr-6">
          <GraduationCap className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">LearnEdge</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {routes.map(({ href, label, active }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                "font-medium transition-colors hover:text-primary",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center ml-auto gap-2">
          {/* Light/Dark Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="text-muted-foreground hover:text-primary"
          >
            {theme === "dark" ? (
              <Sun className="h-8 w-8" />
            ) : (
              <Moon className="h-8 w-8" />
            )}
            <span className="sr-only">
              Switch to {theme === "dark" ? "light" : "dark"} mode
            </span>
          </Button>

          <div className="hidden sm:flex gap-2">
            <Link to="/auth/">
              <Button size="sm">
                {auth?.user ? "Dashboard" : "Log in"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
