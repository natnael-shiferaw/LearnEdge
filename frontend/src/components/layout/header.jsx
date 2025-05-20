import { GraduationCap } from 'lucide-react'
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const { pathname } = useLocation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const routes = [
    { href: "/",          label: "Home",       active: pathname === "/" },
    { href: "/courses",   label: "Courses",    active: pathname === "/courses" },
    { href: "/categories",label: "Categories", active: pathname === "/categories" },
    { href: "/about",     label: "About",      active: pathname === "/about" },
  ]

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
          {isSearchOpen ? (
            <div className="relative flex items-center">
              <Input type="search" placeholder="Search courses..." className="w-[200px] lg:w-[300px]" />
              <Button variant="ghost" size="icon" className="absolute right-0" onClick={() => setIsSearchOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <div className="hidden sm:flex gap-2">
            <Link to="/auth/">
              <Button size="sm">Log in</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

