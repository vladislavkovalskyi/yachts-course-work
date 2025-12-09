"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Clock, Users, MapPin, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { yachtsApi, destinationsApi, bookingsApi, type Yacht, type Destination, type BookingCreate, ApiError } from "@/lib/api"

function BookingContent() {
  const searchParams = useSearchParams()
  const preselectedYacht = searchParams.get("yacht")

  const [yachts, setYachts] = useState<Yacht[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [step, setStep] = useState(1)
  const [selectedYacht, setSelectedYacht] = useState<string>(preselectedYacht || "")
  const [selectedDestination, setSelectedDestination] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [hours, setHours] = useState<string>("2")
  const [guests, setGuests] = useState<string>("1")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const selectedYachtData = yachts.find((y) => y.id.toString() === selectedYacht)
  const totalPrice = selectedYachtData ? selectedYachtData.price * Number.parseInt(hours || "0") : 0

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (preselectedYacht) {
      setSelectedYacht(preselectedYacht)
    }
  }, [preselectedYacht])

  const loadData = async () => {
    try {
      setLoading(true)
      const [yachtsData, destinationsData] = await Promise.all([
        yachtsApi.getAll(),
        destinationsApi.getAll(),
      ])
      setYachts(yachtsData)
      setDestinations(destinationsData)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load data")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedYachtData || !selectedDestination || !date || !hours) {
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      
      const bookingData: BookingCreate = {
        yacht_id: selectedYachtData.id,
        destination_id: Number.parseInt(selectedDestination) || null,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        date,
        hours: Number.parseInt(hours),
        notes: formData.notes || undefined,
      }

      await bookingsApi.create(bookingData)
      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create booking")
      console.error("Error creating booking:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const canProceedStep1 = selectedYacht && selectedDestination
  const canProceedStep2 = date && hours && guests
  const canSubmit = formData.name && formData.email && formData.phone && !submitting

  if (isSubmitted) {
    return (
      <main className="bg-white min-h-screen">
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-black uppercase tracking-tight mb-4">Booking Confirmed!</h1>
              <p className="text-gray-600 text-lg mb-8">
                Thank you for your reservation. We have sent a confirmation email to {formData.email}. Our team will
                contact you shortly to finalize the details.
              </p>

              <div className="bg-gray-50 rounded-2xl p-8 text-left mb-8">
                <h3 className="font-bold text-black mb-4">Booking Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Yacht:</span>
                    <span className="font-medium">{selectedYachtData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Destination:</span>
                    <span className="font-medium">{destinations.find((d) => d.id.toString() === selectedDestination)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{hours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-gray-800 font-medium">Total:</span>
                    <span className="font-bold text-[#1E5AFF]">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-full px-12 py-6"
              >
                Return to Home
              </Button>
            </motion.div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-8 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[#1E5AFF] text-sm tracking-[0.3em] uppercase mb-4 block">
              Reserve Your Experience
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white uppercase tracking-tight">BOOK YOUR YACHT</h1>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Select Yacht" },
              { num: 2, label: "Choose Date" },
              { num: 3, label: "Your Details" },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      step >= s.num ? "bg-[#1E5AFF] text-white" : "bg-white/10 text-white/50"
                    }`}
                  >
                    {step > s.num ? <Check className="h-5 w-5" /> : s.num}
                  </div>
                  <span className={`hidden md:block ${step >= s.num ? "text-white" : "text-white/50"}`}>{s.label}</span>
                </div>
                {index < 2 && <ChevronRight className="h-5 w-5 text-white/30 mx-4 md:mx-8" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E5AFF] mx-auto"></div>
              <p className="text-gray-500 text-lg mt-4">Loading booking form...</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <Button onClick={loadData} className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white">
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form Steps */}
            <div className="lg:col-span-2">
              {/* Step 1: Select Yacht & Destination */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">Select Your Yacht</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {yachts.map((yacht) => (
                        <div
                          key={yacht.id}
                          onClick={() => setSelectedYacht(yacht.id.toString())}
                          className={`cursor-pointer rounded-2xl border-2 overflow-hidden transition-all ${
                            selectedYacht === yacht.id.toString()
                              ? "border-[#1E5AFF] ring-2 ring-[#1E5AFF]/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={yacht.image || "/placeholder.svg"}
                            alt={yacht.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-bold text-black">{yacht.name}</h3>
                              {selectedYacht === yacht.id.toString() && (
                                <div className="w-5 h-5 bg-[#1E5AFF] rounded-full flex items-center justify-center">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                            <p className="text-[#1E5AFF] font-medium text-sm">${yacht.price}/hr</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">Choose Destination</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {destinations.map((dest) => (
                        <div
                          key={dest.id}
                          onClick={() => setSelectedDestination(dest.id.toString())}
                          className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                            selectedDestination === dest.id.toString()
                              ? "border-[#1E5AFF] bg-[#1E5AFF]/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-black mb-1">{dest.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>{dest.duration}</span>
                              </div>
                            </div>
                            {selectedDestination === dest.id.toString() && (
                              <div className="w-6 h-6 bg-[#1E5AFF] rounded-full flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    className="w-full bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-full py-6 text-base disabled:opacity-50"
                  >
                    Continue to Date Selection
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">Select Date & Time</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          <Calendar className="inline h-4 w-4 mr-2" />
                          Date
                        </Label>
                        <Input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          <Clock className="inline h-4 w-4 mr-2" />
                          Duration
                        </Label>
                        <Select value={hours} onValueChange={setHours}>
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Select hours" />
                          </SelectTrigger>
                          <SelectContent>
                            {[2, 3, 4, 5, 6, 7, 8, 10, 12].map((h) => (
                              <SelectItem key={h} value={h.toString()}>
                                {h} hours
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          <Users className="inline h-4 w-4 mr-2" />
                          Number of Guests
                        </Label>
                        <Select value={guests} onValueChange={setGuests}>
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Select guests" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: selectedYachtData?.capacity || 10 }, (_, i) => i + 1).map((g) => (
                              <SelectItem key={g} value={g.toString()}>
                                {g} {g === 1 ? "guest" : "guests"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="flex-1 rounded-full py-6 border-gray-300"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!canProceedStep2}
                      className="flex-1 bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-full py-6 disabled:opacity-50"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Personal Details */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">Your Details</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2 sm:col-span-2">
                        <Label className="text-sm font-medium text-gray-700">Full Name *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Email Address *</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Phone Number *</Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+971 50 123 4567"
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label className="text-sm font-medium text-gray-700">Special Requests (Optional)</Label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Any special requests or requirements..."
                          className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1E5AFF] focus:ring-1 focus:ring-[#1E5AFF] outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="flex-1 rounded-full py-6 border-gray-300"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className="flex-1 bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-full py-6 disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Confirm Booking"}
                      {!submitting && <Check className="ml-2 h-5 w-5" />}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-black uppercase tracking-wide mb-6">Booking Summary</h3>

                {selectedYachtData && (
                  <div className="mb-6">
                    <img
                      src={selectedYachtData.image || "/placeholder.svg"}
                      alt={selectedYachtData.name}
                      className="w-full h-32 object-cover rounded-xl mb-4"
                    />
                    <h4 className="font-bold text-black">{selectedYachtData.name}</h4>
                    <p className="text-gray-500 text-sm">{selectedYachtData.category}</p>
                  </div>
                )}

                <div className="space-y-4 text-sm">
                  {selectedDestination && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#1E5AFF] mt-0.5" />
                      <div>
                        <div className="text-gray-500">Destination</div>
                        <div className="font-medium text-black">
                          {destinations.find((d) => d.id.toString() === selectedDestination)?.name}
                        </div>
                      </div>
                    </div>
                  )}
                  {date && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-[#1E5AFF] mt-0.5" />
                      <div>
                        <div className="text-gray-500">Date</div>
                        <div className="font-medium text-black">{date}</div>
                      </div>
                    </div>
                  )}
                  {hours && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-[#1E5AFF] mt-0.5" />
                      <div>
                        <div className="text-gray-500">Duration</div>
                        <div className="font-medium text-black">{hours} hours</div>
                      </div>
                    </div>
                  )}
                  {guests && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-[#1E5AFF] mt-0.5" />
                      <div>
                        <div className="text-gray-500">Guests</div>
                        <div className="font-medium text-black">{guests}</div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedYachtData && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">
                        ${selectedYachtData.price} x {hours} hours
                      </span>
                      <span className="text-black">${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-black">Total</span>
                      <span className="text-[#1E5AFF]">${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1E5AFF]"></div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  )
}
