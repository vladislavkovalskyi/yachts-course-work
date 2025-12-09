"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, MoreVertical, Edit2, Trash2, Ship, Users, Ruler } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { yachtsApi, type Yacht, ApiError } from "@/lib/api"

export default function AdminYachtsPage() {
  const [yachts, setYachts] = useState<Yacht[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingYacht, setEditingYacht] = useState<Yacht | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "",
    length: "",
    category: "luxury" as Yacht["category"],
    features: "",
  })

  useEffect(() => {
    loadYachts()
  }, [])

  const loadYachts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await yachtsApi.getAll()
      setYachts(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load yachts")
      console.error("Error loading yachts:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredYachts = yachts.filter(
    (yacht) =>
      yacht.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      yacht.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      capacity: "",
      length: "",
      category: "luxury",
      features: "",
    })
    setEditingYacht(null)
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (yacht: Yacht) => {
    setFormData({
      name: yacht.name,
      description: yacht.description,
      price: yacht.price.toString(),
      capacity: yacht.capacity.toString(),
      length: yacht.length.toString(),
      category: yacht.category,
      features: yacht.features.join(", "),
    })
    setEditingYacht(yacht)
    setIsAddModalOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      
      const yachtData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseInt(formData.price),
        capacity: Number.parseInt(formData.capacity),
        length: Number.parseInt(formData.length),
        category: formData.category,
        features: formData.features.split(",").map((f) => f.trim()).filter((f) => f),
        image: editingYacht?.image || "/placeholder.svg",
      }

      if (editingYacht) {
        const updated = await yachtsApi.update(editingYacht.id, yachtData)
        setYachts(yachts.map((y) => (y.id === editingYacht.id ? updated : y)))
      } else {
        const created = await yachtsApi.create(yachtData)
        setYachts([...yachts, created])
      }

      setIsAddModalOpen(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save yacht")
      console.error("Error saving yacht:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this yacht?")) {
      return
    }

    try {
      await yachtsApi.delete(id)
      setYachts(yachts.filter((y) => y.id !== id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete yacht")
      console.error("Error deleting yacht:", err)
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
          <h1 className="text-3xl font-bold text-black">Yachts</h1>
          <p className="text-gray-600">Manage your fleet of luxury yachts</p>
        </div>
        <Button onClick={handleOpenAddModal} className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-xl">
          <Plus className="h-5 w-5 mr-2" />
          Add New Yacht
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
                placeholder="Search yachts..."
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
          <p className="text-gray-500 mt-4">Loading yachts...</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadYachts} className="bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white">
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && (
        <>
          {filteredYachts.length === 0 ? (
            <div className="text-center py-12">
              <Ship className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No yachts found. Add your first yacht!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredYachts.map((yacht, index) => (
                <motion.div
                  key={yacht.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                >
                  <Card className="bg-white border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img src={yacht.image || "/placeholder.svg"} alt={yacht.name} className="w-full h-48 object-cover" />
                      <div className="absolute top-3 right-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEditModal(yacht)}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(yacht.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 text-black text-xs font-medium px-3 py-1 rounded-full capitalize">
                          {yacht.category.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-black text-lg">{yacht.name}</h3>
                        <span className="text-[#1E5AFF] font-bold">${yacht.price}/hr</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{yacht.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{yacht.capacity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Ruler className="h-4 w-4" />
                          <span>{yacht.length} ft</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Ship className="h-4 w-4" />
                          <span>{yacht.features.length} features</span>
                        </div>
                      </div>
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editingYacht ? "Edit Yacht" : "Add New Yacht"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Yacht Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Royal Majesty"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the yacht..."
                className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E5AFF] focus:ring-1 focus:ring-[#1E5AFF] outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price per Hour ($) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="2500"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v as Yacht["category"] })}
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="ultra-luxury">Ultra Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Capacity (guests) *</Label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="25"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Length (ft) *</Label>
                <Input
                  type="number"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  placeholder="85"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Features (comma-separated)</Label>
              <Input
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Private Chef, Jacuzzi, Jet Ski"
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
                disabled={!formData.name || !formData.price || !formData.capacity || !formData.length || saving}
                className="flex-1 bg-[#1E5AFF] hover:bg-[#1E5AFF]/90 text-white rounded-xl disabled:opacity-50"
              >
                {saving ? "Saving..." : editingYacht ? "Save Changes" : "Add Yacht"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
