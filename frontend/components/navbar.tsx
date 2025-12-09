"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Anchor, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authApi } from "@/lib/api"

export function Navbar() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = authApi.getToken()
    if (token) {
      try {
        const response = await authApi.getMe()
        setUser(response.user)
        setIsAuthenticated(true)
      } catch (err) {
        authApi.logout()
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
  }

  const handleLogout = () => {
    authApi.logout()
    setIsAuthenticated(false)
    setUser(null)
    router.push("/")
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/yachts", label: "YACHTS" },
    { href: "/destinations", label: "DESTINATIONS" },
    { href: "/booking", label: "BOOK NOW" },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Anchor className={`h-8 w-8 ${isScrolled ? "text-black" : "text-white"}`} />
              <span className={`text-xl font-bold tracking-wider ${isScrolled ? "text-black" : "text-white"}`}>
                DUBAI YACHTS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-widest transition-colors hover:text-[#1E5AFF] ${
                    isScrolled ? "text-black" : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#1E5AFF] rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {user?.name.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className={`text-sm font-medium ${isScrolled ? "text-black" : "text-white"}`}>
                      {user?.name || "User"}
                    </span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className={`rounded-full ${isScrolled ? "text-black hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className={`rounded-full ${isScrolled ? "text-black hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-full px-6">Sign Up</Button>
                  </Link>
                </div>
              )}
              <Link href="/admin">
              <Button className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-full px-6">Admin</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <X className={`h-6 w-6 ${isScrolled ? "text-black" : "text-white"}`} />
              ) : (
                <Menu className={`h-6 w-6 ${isScrolled ? "text-black" : "text-white"}`} />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-medium tracking-widest text-black hover:text-[#1E5AFF] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <div className="space-y-4 mt-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-[#1E5AFF] rounded-full flex items-center justify-center text-white font-medium">
                      {user?.name.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="font-medium text-black">{user?.name || "User"}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    variant="outline"
                    className="w-full rounded-full border-gray-300 text-black"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 mt-4">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full border-gray-300 text-black py-6 text-lg">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-full px-8 py-6 text-lg w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-gray-300 text-black py-6 text-lg mt-4"
                >
                  ADMIN PANEL
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
