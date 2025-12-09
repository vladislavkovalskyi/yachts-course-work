"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/luxury-yacht-sailing-dubai-marina-skyline-golden-h.jpg"
          alt="Luxury yacht in Dubai"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <span className="text-amber-100/90 text-sm md:text-base tracking-[0.3em] uppercase">
            Premium Yacht Charter in Dubai
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase tracking-tight leading-none mb-6"
        >
          EXPERIENCE
          <br />
          <span className="text-amber-200">LUXURY</span>
          <br />
          AT SEA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-amber-50/80 text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
        >
          Discover Dubai&apos;s coastline aboard our world-class fleet. Unforgettable moments, exceptional service, pure
          elegance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-24"
        >
          <Link href="/yachts">
            <Button
              size="lg"
              className="bg-amber-100 hover:bg-amber-200 text-stone-900 rounded-full px-10 py-7 text-base tracking-widest font-semibold"
            >
              EXPLORE FLEET
            </Button>
          </Link>
          <Link href="/booking">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-amber-100/60 text-amber-50 hover:bg-amber-100 hover:text-stone-900 rounded-full px-10 py-7 text-base tracking-widest"
            >
              BOOK NOW
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex gap-12 md:gap-20"
        >
          {[
            { value: "50+", label: "YACHTS" },
            { value: "1000+", label: "CLIENTS" },
            { value: "15+", label: "YEARS" },
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-3xl md:text-4xl font-bold text-amber-100">{stat.value}</div>
              <div className="text-amber-100/50 text-xs tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
          <ChevronDown className="h-8 w-8 text-amber-100/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}
