"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { destinationsApi, type Destination, ApiError } from "@/lib/api"
import Link from "next/link"

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDestinations()
  }, [])

  const loadDestinations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await destinationsApi.getAll()
      setDestinations(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load destinations")
      console.error("Error loading destinations:", err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-[#1E5AFF] text-sm tracking-[0.3em] uppercase mb-4 block">Explore Dubai</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight mb-6">
              DESTINATIONS
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Discover Dubai&apos;s most iconic locations from the exclusive vantage point of your private yacht.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Destination */}
      {loading && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E5AFF] mx-auto"></div>
            <p className="text-gray-500 text-lg mt-4">Loading destinations...</p>
          </div>
        </section>
      )}

      {error && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <Button onClick={loadDestinations} className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white">
              Try Again
            </Button>
          </div>
        </section>
      )}

      {!loading && !error && destinations.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden"
            >
              <img
                src={destinations[0].image || "/placeholder.svg"}
                alt={destinations[0].name}
                className="w-full aspect-[21/9] object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="px-8 md:px-16 max-w-2xl">
                  <span className="inline-block bg-[#1E5AFF] text-white text-xs font-medium tracking-wider px-4 py-2 rounded-full uppercase mb-4">
                    Featured
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight mb-4">
                    {destinations[0].name}
                  </h2>
                  <p className="text-white/80 text-lg mb-6">{destinations[0].description}</p>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-2 text-white/70">
                      <Clock className="h-5 w-5" />
                      <span>{destinations[0].duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin className="h-5 w-5" />
                      <span>Dubai, UAE</span>
                    </div>
                  </div>
                  <Link href="/booking">
                    <Button size="lg" className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-full px-10">
                      Book This Route
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* All Destinations */}
      {!loading && !error && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-black uppercase tracking-tight">All Destinations</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="h-4 w-4" />
                      <span>{destination.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-black uppercase tracking-wide mb-2">{destination.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{destination.description}</p>
                  <Link href="/booking">
                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-medium text-[#1E5AFF] hover:text-[#1E5AFF]/80 hover:bg-transparent group/btn"
                    >
                      Book This Route
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight mb-6">
              Create Your Custom Route
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Have a specific destination in mind? Our team can create a personalized itinerary tailored to your
              preferences.
            </p>
            <Link href="/booking">
              <Button
                size="lg"
                className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-full px-12 py-7 text-base tracking-widest"
              >
                PLAN YOUR JOURNEY
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
