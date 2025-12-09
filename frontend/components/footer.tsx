"use client"

import Link from "next/link"
import { Anchor, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Anchor className="h-8 w-8 text-[#1E5AFF]" />
              <span className="text-xl font-bold tracking-wider">DUBAI YACHTS</span>
            </Link>
            <p className="text-white/60 leading-relaxed mb-6">
              Experience the pinnacle of luxury yacht charter services in Dubai. Your journey to extraordinary begins
              here.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1E5AFF] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1E5AFF] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1E5AFF] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {["Home", "Yachts", "Destinations", "Booking", "About Us"].map((link) => (
                <li key={link}>
                  <Link
                    href={link === "Home" ? "/" : `/${link.toLowerCase().replace(" ", "-")}`}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold uppercase tracking-wider mb-6">Services</h4>
            <ul className="space-y-4">
              {["Private Charters", "Corporate Events", "Fishing Trips", "Sunset Cruises", "Wedding Ceremonies"].map(
                (service) => (
                  <li key={service}>
                    <span className="text-white/60">{service}</span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold uppercase tracking-wider mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#1E5AFF] mt-0.5" />
                <span className="text-white/60">
                  Dubai Marina, Marina Walk
                  <br />
                  Dubai, UAE
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#1E5AFF]" />
                <span className="text-white/60">+971 4 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#1E5AFF]" />
                <span className="text-white/60">info@dubaiyachts.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">© 2025 Dubai Yachts. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-white/40 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-white/40 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
