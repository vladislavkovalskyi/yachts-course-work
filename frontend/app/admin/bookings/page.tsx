"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, MoreVertical, Eye, CheckCircle, XCircle, Clock, Calendar, Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { bookingsApi, type Booking, ApiError } from "@/lib/api"

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadBookings()
  }, [statusFilter, searchQuery])

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await bookingsApi.getAll({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery || undefined,
      })
      setBookings(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load bookings")
      console.error("Error loading bookings:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = bookings

  const updateBookingStatus = async (id: number, status: Booking["status"]) => {
    try {
      setUpdating(true)
      setError(null)
      const updated = await bookingsApi.updateStatus(id, status)
      setBookings(bookings.map((b) => (b.id === id ? updated : b)))
      if (selectedBooking?.id === id) {
        setSelectedBooking(updated)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update booking status")
      console.error("Error updating booking status:", err)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-black">Bookings</h1>
          <p className="text-gray-600">Manage all yacht charter reservations</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Total:</span>
          <span className="font-bold text-black">{bookings.length} bookings</span>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by customer, yacht, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-gray-200"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-44 h-11 rounded-xl">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E5AFF] mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading bookings...</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadBookings} className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white">
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Bookings Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white border-0 shadow-sm overflow-hidden">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No bookings found matching your criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                          Customer
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                          Yacht
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                          Date
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                          Total
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                          Status
                        </th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#1E5AFF] rounded-full flex items-center justify-center text-white font-medium">
                                {booking.customer_name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-black">{booking.customer_name}</div>
                                <div className="text-sm text-gray-500">{booking.customer_email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-black">{booking.yacht_name || "N/A"}</div>
                            <div className="text-sm text-gray-500">
                              {booking.hours} hours • {booking.destination_name || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-black">{booking.date}</div>
                            <div className="text-sm text-gray-500">Booked: {new Date(booking.created_at).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-black">${booking.total_price.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(booking.status)}`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "confirmed")}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Confirm
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "completed")}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Complete
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                  className="text-red-600"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </motion.div>
        </>
      )}

      {/* Booking Details Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-[#1E5AFF] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedBooking.customer_name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-black">{selectedBooking.customer_name}</div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {selectedBooking.customer_email}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    {selectedBooking.customer_phone}
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Yacht</div>
                  <div className="font-medium text-black">{selectedBooking.yacht_name || "N/A"}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Destination</div>
                  <div className="font-medium text-black">{selectedBooking.destination_name || "N/A"}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date
                  </div>
                  <div className="font-medium text-black">{selectedBooking.date}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Duration
                  </div>
                  <div className="font-medium text-black">{selectedBooking.hours} hours</div>
                </div>
              </div>

              {/* Price & Status */}
              <div className="flex items-center justify-between p-4 bg-black text-white rounded-xl">
                <div>
                  <div className="text-white/70 text-sm">Total Price</div>
                  <div className="text-2xl font-bold">${selectedBooking.total_price.toLocaleString()}</div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}
                >
                  {selectedBooking.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedBooking.status === "pending" && (
                  <Button
                    onClick={() => updateBookingStatus(selectedBooking.id, "confirmed")}
                    disabled={updating}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {updating ? "Updating..." : "Confirm Booking"}
                  </Button>
                )}
                {selectedBooking.status === "confirmed" && (
                  <Button
                    onClick={() => updateBookingStatus(selectedBooking.id, "completed")}
                    disabled={updating}
                    className="flex-1 bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-xl disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {updating ? "Updating..." : "Mark as Completed"}
                  </Button>
                )}
                {selectedBooking.status !== "cancelled" && selectedBooking.status !== "completed" && (
                  <Button
                    onClick={() => updateBookingStatus(selectedBooking.id, "cancelled")}
                    disabled={updating}
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {updating ? "Updating..." : "Cancel Booking"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
