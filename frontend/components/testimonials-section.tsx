"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Alexander Sterling",
    role: "CEO, Sterling Enterprises",
    content:
      "An absolutely magnificent experience. The crew was impeccable, and the yacht exceeded all expectations. This is the gold standard for luxury yacht charters.",
    rating: 5,
    image: "/professional-businessman-portrait.png",
  },
  {
    id: 2,
    name: "Isabella Romano",
    role: "Fashion Designer",
    content:
      "Perfect for my brand photoshoot. The attention to detail and the stunning backdrops made it an unforgettable experience. Will definitely return.",
    rating: 5,
    image: "/elegant-woman-portrait-fashion.jpg",
  },
  {
    id: 3,
    name: "Mohammed Al-Rashid",
    role: "Private Client",
    content:
      "Hosted my anniversary celebration aboard Diamond Seas. The team went above and beyond to make it special. True luxury service.",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#1E5AFF] text-sm tracking-[0.3em] uppercase mb-4 block">Client Feedback</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tight">
            WHAT OUR
            <br />
            <span className="text-white/40">CLIENTS SAY</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              <Quote className="h-10 w-10 text-[#1E5AFF] mb-6" />

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#1E5AFF] text-[#1E5AFF]" />
                ))}
              </div>

              <p className="text-white/80 leading-relaxed mb-8">&quot;{testimonial.content}&quot;</p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-white font-medium">{testimonial.name}</div>
                  <div className="text-white/50 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
