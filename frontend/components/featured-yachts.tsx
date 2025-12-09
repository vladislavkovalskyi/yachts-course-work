"use client"

import { motion } from "framer-motion"
import { Users, Ruler, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { yachts } from "@/lib/data"
import Link from "next/link"

export function FeaturedYachts() {
  const featuredYachts = yachts.slice(0, 3)

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#1E5AFF] text-sm tracking-[0.3em] uppercase mb-4 block">Our Fleet</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black uppercase tracking-tight">
              FEATURED
              <br />
              YACHTS
            </h2>
            <p className="text-gray-600 max-w-md leading-relaxed">
              Discover our handpicked selection of premium vessels, each offering unique experiences and world-class
              amenities.
            </p>
          </div>
        </motion.div>

        {/* Yachts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredYachts.map((yacht, index) => (
            <motion.div
              key={yacht.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <img
                  src={yacht.image || "/placeholder.svg"}
                  alt={yacht.name}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-black text-xs font-medium tracking-wider px-4 py-2 rounded-full uppercase">
                    {yacht.category}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-black uppercase tracking-wide">{yacht.name}</h3>
                  <span className="text-[#1E5AFF] font-bold text-lg">${yacht.price}/hr</span>
                </div>

                <p className="text-gray-600 leading-relaxed line-clamp-2">{yacht.description}</p>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{yacht.capacity} Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    <span>{yacht.length} ft</span>
                  </div>
                </div>

                <Link href={`/yachts/${yacht.id}`}>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium text-black hover:text-[#1E5AFF] hover:bg-transparent group/btn"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link href="/yachts">
            <Button
              size="lg"
              className="bg-black hover:bg-black/90 text-white rounded-full px-12 py-7 text-sm tracking-widest"
            >
              VIEW ALL YACHTS
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
