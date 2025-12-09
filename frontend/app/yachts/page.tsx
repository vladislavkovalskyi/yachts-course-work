"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Ruler, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { yachtsApi, type Yacht, ApiError } from "@/lib/api"
import Link from "next/link"

export default function YachtsPage() {
  const [yachts, setYachts] = useState<Yacht[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("featured")

  useEffect(() => {
    loadYachts()
  }, [categoryFilter, sortBy])

  const loadYachts = async () => {
    try {
      setLoading(true)
      setError(null)
      const order = sortBy === "price-low" ? "ASC" : sortBy === "price-high" ? "DESC" : "ASC"
      const sort = sortBy === "price-low" || sortBy === "price-high" ? "price" : "id"
      const data = await yachtsApi.getAll({
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        sort,
        order,
      })
      setYachts(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load yachts")
      console.error("Error loading yachts:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredYachts = yachts.filter((yacht) => {
    const matchesSearch =
      yacht.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      yacht.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

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
            <span className="text-[#1E5AFF] text-sm tracking-[0.3em] uppercase mb-4 block">Our Fleet</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight mb-6">
              LUXURY YACHTS
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Explore our exclusive collection of world-class vessels, each offering unique experiences and unparalleled
              luxury.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-gray-200 sticky top-20 bg-white z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search yachts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full border-gray-300"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <Filter className="h-5 w-5 text-gray-500 hidden md:block" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-44 h-12 rounded-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="ultra-luxury">Ultra Luxury</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-44 h-12 rounded-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="capacity">Capacity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Yachts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E5AFF] mx-auto"></div>
              <p className="text-gray-500 text-lg mt-4">Loading yachts...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <Button onClick={loadYachts} className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white">
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredYachts.map((yacht, index) => (
                  <YachtCard key={yacht.id} yacht={yacht} index={index} />
                ))}
              </div>

              {filteredYachts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">No yachts found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

function YachtCard({ yacht, index }: { yacht: Yacht; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="relative overflow-hidden">
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

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-black uppercase tracking-wide">{yacht.name}</h3>
          <span className="text-[#1E5AFF] font-bold text-lg">${yacht.price}/hr</span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{yacht.description}</p>

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

        <div className="flex flex-wrap gap-2">
          {yacht.features.slice(0, 3).map((feature) => (
            <span key={feature} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {feature}
            </span>
          ))}
          {yacht.features.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              +{yacht.features.length - 3}
            </span>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Link href={`/yachts/${yacht.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-full border-black text-black hover:bg-black hover:text-white bg-transparent"
            >
              View Details
            </Button>
          </Link>
          <Link href={`/booking?yacht=${yacht.id}`} className="flex-1">
            <Button className="w-full rounded-full bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white">Book Now</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
