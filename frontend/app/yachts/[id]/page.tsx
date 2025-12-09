"use client"

import { use, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Ruler, Check, ArrowLeft, Anchor, Waves, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { yachtsApi, type Yacht, ApiError } from "@/lib/api"
import Link from "next/link"
import { notFound } from "next/navigation"

export default function YachtDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [yacht, setYacht] = useState<Yacht | null>(null)
  const [relatedYachts, setRelatedYachts] = useState<Yacht[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadYacht()
  }, [id])

  const loadYacht = async () => {
    try {
      setLoading(true)
      setError(null)
      const yachtId = Number.parseInt(id)
      if (isNaN(yachtId)) {
        setError("Invalid yacht ID")
        return
      }
      const data = await yachtsApi.getById(yachtId)
      setYacht(data)
      
      const allYachts = await yachtsApi.getAll({ category: data.category })
      setRelatedYachts(allYachts.filter((y) => y.id !== data.id).slice(0, 3))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load yacht")
      console.error("Error loading yacht:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="bg-white min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E5AFF] mx-auto"></div>
            <p className="text-gray-500 text-lg mt-4">Loading yacht details...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !yacht) {
    notFound()
  }

  return (
    <main className="bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            href="/yachts"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Fleet</span>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <img
              src={yacht.image || "/placeholder.svg"}
              alt={yacht.name}
              className="w-full aspect-[21/9] object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="inline-block bg-[#1E5AFF] text-white text-xs font-medium tracking-wider px-4 py-2 rounded-full uppercase mb-4">
                {yacht.category}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tight">
                {yacht.name}
              </h1>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-3 gap-6"
              >
                {[
                  { icon: Users, label: "Capacity", value: `${yacht.capacity} Guests` },
                  { icon: Ruler, label: "Length", value: `${yacht.length} ft` },
                  { icon: Anchor, label: "Category", value: yacht.category.replace("-", " ") },
                ].map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center">
                    <stat.icon className="h-8 w-8 text-[#1E5AFF] mx-auto mb-3" />
                    <div className="text-gray-500 text-sm mb-1">{stat.label}</div>
                    <div className="font-bold text-black capitalize">{stat.value}</div>
                  </div>
                ))}
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-4">About This Yacht</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{yacht.description}</p>
                <p className="text-gray-600 leading-relaxed text-lg mt-4">
                  This magnificent vessel represents the pinnacle of maritime luxury. Every detail has been carefully
                  curated to ensure an unforgettable experience on the waters of Dubai. Whether you&apos;re hosting an
                  exclusive event, celebrating a special occasion, or simply seeking a day of pure relaxation, this
                  yacht delivers beyond expectations.
                </p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">Features & Amenities</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {yacht.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="w-10 h-10 bg-[#1E5AFF]/10 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-[#1E5AFF]" />
                      </div>
                      <span className="font-medium text-black">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Included */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">What&apos;s Included</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { icon: Waves, text: "Professional Crew" },
                    { icon: Sparkles, text: "Premium Refreshments" },
                    { icon: Anchor, text: "Safety Equipment" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                      <item.icon className="h-5 w-5 text-[#1E5AFF]" />
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Booking Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-32 bg-black text-white rounded-3xl p-8">
                <div className="mb-6">
                  <span className="text-white/60 text-sm">Starting from</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">${yacht.price}</span>
                    <span className="text-white/60">/ hour</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/70">Minimum Duration</span>
                    <span className="font-medium">2 hours</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/70">Capacity</span>
                    <span className="font-medium">{yacht.capacity} guests</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/70">Crew</span>
                    <span className="font-medium">Included</span>
                  </div>
                </div>

                <Link href={`/booking?yacht=${yacht.id}`}>
                  <Button
                    size="lg"
                    className="w-full bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-full py-7 text-base tracking-widest"
                  >
                    BOOK THIS YACHT
                  </Button>
                </Link>

                <p className="text-center text-white/50 text-sm mt-6">
                  Free cancellation up to 48 hours before departure
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Yachts */}
      {relatedYachts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black uppercase tracking-wide mb-10">Similar Yachts</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedYachts.map((relYacht, index) => (
                <motion.div
                  key={relYacht.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/yachts/${relYacht.id}`}>
                    <div className="relative overflow-hidden rounded-2xl mb-4">
                      <img
                        src={relYacht.image || "/placeholder.svg"}
                        alt={relYacht.name}
                        className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-black uppercase mb-1">{relYacht.name}</h3>
                    <p className="text-[#1E5AFF] font-medium">${relYacht.price}/hr</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
