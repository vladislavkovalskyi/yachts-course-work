"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Anchor, LayoutDashboard, Ship, MapPin, Calendar, Menu, X, LogOut, Settings, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authApi } from "@/lib/api"

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/bookings", icon: Calendar, label: "Bookings" },
  { href: "/admin/yachts", icon: Ship, label: "Yachts" },
  { href: "/admin/destinations", icon: MapPin, label: "Destinations" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = authApi.getToken()
    if (!token) {
      if (pathname !== "/admin/login") {
        router.push("/admin/login")
      }
      setIsAuthenticated(false)
      return
    }

    try {
      const response = await authApi.getMe()
      if (response.user.role !== "admin") {
        authApi.logout()
        router.push("/admin/login")
        setIsAuthenticated(false)
        return
      }
      setUser(response.user)
      setIsAuthenticated(true)
    } catch (err) {
      authApi.logout()
      if (pathname !== "/admin/login") {
        router.push("/admin/login")
      }
      setIsAuthenticated(false)
    }
  }

  const handleLogout = () => {
    authApi.logout()
    router.push("/admin/login")
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E5AFF]"></div>
      </div>
    )
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Anchor className="h-6 w-6 text-[#1E5AFF]" />
            <span className="font-bold text-black">Admin Panel</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-black text-white transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <Anchor className="h-8 w-8 text-[#1E5AFF]" />
            <span className="text-xl font-bold tracking-wide">ADMIN</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? "bg-[#1E5AFF] text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <link.icon className="h-5 w-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Back to Site & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 space-y-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <Anchor className="h-5 w-5 mr-3" />
              Back to Website
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {/* Top Bar */}
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-black">
            {sidebarLinks.find((l) => l.href === pathname)?.label || "Admin Panel"}
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#1E5AFF] rounded-full flex items-center justify-center text-white font-medium">
                {user?.name.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-black">{user?.name || "Admin"}</span>
                <span className="text-xs text-gray-500">{user?.email || ""}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
