"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/placeholder.svg?height=800&width=1920"
          alt="Dubai coastline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#1E5AFF] text-sm tracking-[0.3em] uppercase mb-4 block">Start Your Journey</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tight mb-6">
            READY TO SET SAIL?
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Book your exclusive yacht charter today and discover why Dubai Yachts is the choice of the world&apos;s most
            discerning travelers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button
                size="lg"
                className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-full px-12 py-7 text-base tracking-widest"
              >
                BOOK YOUR YACHT
              </Button>
            </Link>
            <Link href="/yachts">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-black rounded-full px-12 py-7 text-base tracking-widest"
              >
                EXPLORE FLEET
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
