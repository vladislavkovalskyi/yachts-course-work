"use client"

import { motion } from "framer-motion"
import { Ship, Calendar, DollarSign, Users, TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { yachts, initialBookings, destinations } from "@/lib/data"
import Link from "next/link"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Yachts",
      value: yachts.length,
      change: "+2 this month",
      trend: "up",
      icon: Ship,
    },
    {
      title: "Active Bookings",
      value: initialBookings.filter((b) => b.status === "confirmed" || b.status === "pending").length,
      change: "+12% from last week",
      trend: "up",
      icon: Calendar,
    },
    {
      title: "Revenue (Month)",
      value: "$" + initialBookings.reduce((acc, b) => acc + b.totalPrice, 0).toLocaleString(),
      change: "+8% from last month",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Destinations",
      value: destinations.length,
      change: "All active",
      trend: "neutral",
      icon: Users,
    },
  ]

  const recentBookings = initialBookings.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-black mb-2">Welcome back, Admin</h1>
        <p className="text-gray-600">Here&apos;s an overview of your yacht charter business.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#1E5AFF]/10 rounded-xl flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-[#1E5AFF]" />
                  </div>
                  {stat.trend === "up" && <TrendingUp className="h-5 w-5 text-green-500" />}
                  {stat.trend === "down" && <TrendingDown className="h-5 w-5 text-red-500" />}
                </div>
                <div className="text-3xl font-bold text-black mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
                <div className="text-xs text-gray-400 mt-2">{stat.change}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold text-black">Recent Bookings</CardTitle>
              <Link href="/admin/bookings">
                <Button variant="ghost" className="text-[#1E5AFF] hover:text-[#1E5AFF]/80 hover:bg-[#1E5AFF]/5">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#1E5AFF] rounded-full flex items-center justify-center text-white font-medium">
                        {booking.customerName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-black">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">
                          {booking.yachtName} • {booking.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-black">${booking.totalPrice.toLocaleString()}</div>
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : booking.status === "completed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-black">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/yachts" className="block">
                <Button className="w-full justify-start bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-xl py-6">
                  <Ship className="mr-3 h-5 w-5" />
                  Add New Yacht
                </Button>
              </Link>
              <Link href="/admin/destinations" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent border-gray-200 hover:bg-gray-50 rounded-xl py-6"
                >
                  <Users className="mr-3 h-5 w-5" />
                  Add Destination
                </Button>
              </Link>
              <Link href="/admin/bookings" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent border-gray-200 hover:bg-gray-50 rounded-xl py-6"
                >
                  <Calendar className="mr-3 h-5 w-5" />
                  Manage Bookings
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Fleet Overview */}
          <Card className="bg-black text-white border-0 shadow-sm mt-6">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Fleet Overview</h3>
              <div className="space-y-3">
                {["Ultra Luxury", "Luxury", "Premium"].map((category) => {
                  const count = yachts.filter((y) => y.category === category.toLowerCase().replace(" ", "-")).length
                  const percentage = Math.round((count / yachts.length) * 100)
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/70">{category}</span>
                        <span className="text-white">{count} yachts</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1E5AFF] rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
