"use client"

import { motion } from "framer-motion"
import { Shield, Award, Clock, Heart } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Safety First",
    description:
      "All vessels undergo rigorous safety inspections and are equipped with state-of-the-art navigation systems.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Our fleet consists of only the finest yachts, maintained to the highest international standards.",
  },
  {
    icon: Clock,
    title: "24/7 Service",
    description:
      "Round-the-clock concierge service ensuring your every need is met before, during, and after your charter.",
  },
  {
    icon: Heart,
    title: "Personalized Experience",
    description: "Customizable itineraries and amenities tailored to create your perfect maritime experience.",
  },
]

export function AboutSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img src="/luxury-yacht-interior-with-champagne-dubai.jpg" alt="Luxury yacht interior" className="w-full rounded-2xl" />
            <div className="absolute -bottom-8 -right-8 bg-[#1E5AFF] text-white p-8 rounded-2xl hidden md:block">
              <div className="text-5xl font-bold">15+</div>
              <div className="text-white/80 text-sm tracking-wider uppercase mt-1">Years of Excellence</div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#1E5AFF] text-sm tracking-[0.3em] uppercase mb-4 block">About Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-black uppercase tracking-tight mb-6">
              DUBAI&apos;S PREMIER
              <br />
              YACHT CHARTER
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Since 2010, Dubai Yachts has been the definitive choice for discerning clients seeking unparalleled
              maritime experiences. Our commitment to excellence, combined with an exceptional fleet and dedicated crew,
              ensures every voyage is extraordinary.
            </p>
            <p className="text-gray-600 leading-relaxed mb-12">
              From intimate sunset cruises to grand corporate events, we craft bespoke experiences that exceed
              expectations and create lasting memories.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-[#1E5AFF]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-black mb-1">{feature.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
