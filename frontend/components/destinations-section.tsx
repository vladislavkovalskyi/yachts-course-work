"use client"

import { motion } from "framer-motion"
import { Clock, ArrowUpRight } from "lucide-react"
import { destinations } from "@/lib/data"
import Link from "next/link"

export function DestinationsSection() {
  return (
    <section className="py-24 md:py-32 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-[#1E5AFF] text-sm tracking-[0.3em] uppercase mb-4 block">Explore Dubai</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black uppercase tracking-tight mb-6">
            ICONIC DESTINATIONS
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Sail to Dubai&apos;s most breathtaking locations. From the architectural marvel of Palm Jumeirah to the
            stunning Dubai Marina skyline.
          </p>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href="/destinations" className="group block">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full aspect-[3/2] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                      <Clock className="h-4 w-4" />
                      <span>{destination.duration}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">{destination.name}</h3>
                    <p className="text-white/70 text-sm line-clamp-2">{destination.description}</p>
                  </div>

                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="h-5 w-5 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
