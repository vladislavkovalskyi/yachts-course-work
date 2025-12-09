"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, MoreVertical, Edit2, Trash2, MapPin, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { destinationsApi, type Destination, ApiError } from "@/lib/api"

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
  })

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

  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleOpenAddModal = () => {
    setFormData({ name: "", description: "", duration: "" })
    setEditingDestination(null)
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (dest: Destination) => {
    setFormData({
      name: dest.name,
      description: dest.description,
      duration: dest.duration,
    })
    setEditingDestination(dest)
    setIsAddModalOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      
      const destData = {
        name: formData.name,
        description: formData.description,
        duration: formData.duration,
        image: editingDestination?.image || "/placeholder.svg",
      }

      if (editingDestination) {
        const updated = await destinationsApi.update(editingDestination.id, destData)
        setDestinations(destinations.map((d) => (d.id === editingDestination.id ? updated : d)))
      } else {
        const created = await destinationsApi.create(destData)
        setDestinations([...destinations, created])
      }

      setIsAddModalOpen(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save destination")
      console.error("Error saving destination:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this destination?")) {
      return
    }

    try {
      await destinationsApi.delete(id)
      setDestinations(destinations.filter((d) => d.id !== id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete destination")
      console.error("Error deleting destination:", err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-black">Destinations</h1>
          <p className="text-gray-600">Manage yacht cruise destinations</p>
        </div>
        <Button onClick={handleOpenAddModal} className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-xl">
          <Plus className="h-5 w-5 mr-2" />
          Add Destination
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl border-gray-200"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E5AFF] mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading destinations...</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadDestinations} className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white">
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && (
        <>
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No destinations found. Add your first destination!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest, index) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                >
                  <Card className="bg-white border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img src={dest.image || "/placeholder.svg"} alt={dest.name} className="w-full h-48 object-cover" />
                      <div className="absolute top-3 right-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEditModal(dest)}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(dest.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-white/90 text-black text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {dest.duration}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-[#1E5AFF] mt-0.5" />
                        <h3 className="font-bold text-black text-lg">{dest.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{dest.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingDestination ? "Edit Destination" : "Add New Destination"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Destination Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Palm Jumeirah"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the destination..."
                className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E5AFF] focus:ring-1 focus:ring-[#1E5AFF] outline-none resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label>Duration *</Label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="2-3 hours"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 rounded-xl border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!formData.name || !formData.description || !formData.duration || saving}
                className="flex-1 bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-xl disabled:opacity-50"
              >
                {saving ? "Saving..." : editingDestination ? "Save Changes" : "Add Destination"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
