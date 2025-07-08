"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FolderOpen, Code, Briefcase, Mail, Settings, Menu, X, Home, UserCircle, Share2, Layers, Layers2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"




export function AdminSidebar({userId}:{userId?: string}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
  { name: "Dashboard", href: `/dashboard/${userId}`, icon: BarChart3 },
  { name: "Projects", href: `/dashboard/projects/${userId}` , icon: FolderOpen },
  { name: "Skills", href: `/dashboard/skills/${userId}`, icon: Code },
  { name: "Experience", href: `/dashboard/experience/${userId}`, icon: Briefcase },
  { name: "Messages", href:  `/dashboard/messages/${userId}`, icon: Mail },
  { name: "Hero", href: `/dashboard/hero/${userId}`, icon: UserCircle },
  { name: "Main Header", href: `/dashboard/main-header/${userId}`, icon: Layers },
  { name: "Main Footer", href: `/dashboard/main-footer/${userId}`, icon: Layers2 },
  { name: "Social Account", href: `/dashboard/social-account/${userId}`, icon: Share2 },
  { name: "Settings", href: `/dashboard/settings/${userId}`, icon: Settings },
]

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Portfolio</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-6 py-6">
        <ul className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-colors",
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500",
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Bottom Links */}
        <div className="mt-auto space-y-2">
          <Link
            href={`/user/${userId}`}
            className="group flex gap-x-3 rounded-md p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Home className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-500" />
            View Portfolio
          </Link>
        </div>
      </nav>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-white hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white">
                <SidebarContent />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)} className="text-gray-700">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
      </div>
    </>
  )
}
