// Mock data for yachts, destinations, and bookings

export interface Yacht {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  length: number
  image: string
  features: string[]
  category: "luxury" | "premium" | "ultra-luxury"
}

export interface Destination {
  id: string
  name: string
  description: string
  image: string
  duration: string
}

export interface Booking {
  id: string
  yachtId: string
  yachtName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  hours: number
  destination: string
  totalPrice: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: string
}

export const yachts: Yacht[] = [
  {
    id: "1",
    name: "Royal Majesty",
    description:
      "Experience unparalleled luxury aboard our flagship vessel. Perfect for exclusive parties and corporate events.",
    price: 2500,
    capacity: 25,
    length: 85,
    image: "/luxury-white-yacht-on-blue-dubai-waters.jpg",
    features: ["Private Chef", "Jacuzzi", "Jet Ski", "Full Bar", "Sun Deck"],
    category: "ultra-luxury",
  },
  {
    id: "2",
    name: "Azure Dream",
    description: "Elegant and sophisticated, ideal for romantic getaways and intimate celebrations.",
    price: 1800,
    capacity: 15,
    length: 65,
    image: "/elegant-yacht-sunset-dubai-marina.jpg",
    features: ["Gourmet Kitchen", "Master Suite", "Fishing Equipment", "BBQ Area"],
    category: "luxury",
  },
  {
    id: "3",
    name: "Ocean Pioneer",
    description: "Modern design meets classic comfort. Perfect for family adventures and weekend trips.",
    price: 1200,
    capacity: 12,
    length: 55,
    image: "/modern-yacht-dubai-skyline-background.jpg",
    features: ["Snorkeling Gear", "Water Slides", "Entertainment System", "Dining Area"],
    category: "premium",
  },
  {
    id: "4",
    name: "Diamond Seas",
    description: "The epitome of maritime excellence. Features state-of-the-art amenities and breathtaking interiors.",
    price: 3500,
    capacity: 30,
    length: 95,
    image: "/mega-yacht-luxury-interior-dubai.jpg",
    features: ["Helipad", "Cinema Room", "Spa", "Multiple Decks", "Professional Crew"],
    category: "ultra-luxury",
  },
  {
    id: "5",
    name: "Sunset Voyager",
    description: "Designed for those who appreciate the finer things. Stunning sunset cruises guaranteed.",
    price: 1500,
    capacity: 18,
    length: 70,
    image: "/yacht-golden-sunset-arabian-sea.jpg",
    features: ["360° Views", "Premium Sound System", "Cocktail Bar", "Sun Loungers"],
    category: "luxury",
  },
  {
    id: "6",
    name: "Pearl Navigator",
    description: "Compact yet luxurious, perfect for quick escapes and day trips along the coast.",
    price: 900,
    capacity: 8,
    length: 45,
    image: "/small-luxury-yacht-crystal-clear-water-dubai.jpg",
    features: ["Fishing Gear", "Swim Platform", "Shaded Deck", "Cool Box"],
    category: "premium",
  },
]

export const destinations: Destination[] = [
  {
    id: "1",
    name: "Palm Jumeirah",
    description: "Cruise around the iconic palm-shaped island and witness Dubai's architectural marvel.",
    image: "/palm-jumeirah-aerial-view-dubai.jpg",
    duration: "2-3 hours",
  },
  {
    id: "2",
    name: "Burj Al Arab",
    description: "Sail past the world's most luxurious hotel and capture stunning photographs.",
    image: "/burj-al-arab-from-sea-view.jpg",
    duration: "1-2 hours",
  },
  {
    id: "3",
    name: "Dubai Marina",
    description: "Navigate through the stunning marina surrounded by towering skyscrapers.",
    image: "/dubai-marina-yacht-night-lights.jpg",
    duration: "2-4 hours",
  },
  {
    id: "4",
    name: "World Islands",
    description: "Explore the man-made archipelago resembling a world map.",
    image: "/world-islands-dubai-aerial-yacht.jpg",
    duration: "4-6 hours",
  },
  {
    id: "5",
    name: "Ain Dubai",
    description: "See the world's largest observation wheel from the perfect vantage point.",
    image: "/ain-dubai-ferris-wheel-from-water.jpg",
    duration: "1-2 hours",
  },
  {
    id: "6",
    name: "Atlantis Resort",
    description: "Cruise to the legendary Atlantis and enjoy views of this iconic destination.",
    image: "/atlantis-the-palm-dubai-from-yacht.jpg",
    duration: "3-4 hours",
  },
]

export const initialBookings: Booking[] = [
  {
    id: "1",
    yachtId: "1",
    yachtName: "Royal Majesty",
    customerName: "Alexander Sterling",
    customerEmail: "alex.sterling@email.com",
    customerPhone: "+971 50 123 4567",
    date: "2025-01-15",
    hours: 4,
    destination: "Palm Jumeirah",
    totalPrice: 10000,
    status: "confirmed",
    createdAt: "2025-01-08",
  },
  {
    id: "2",
    yachtId: "3",
    yachtName: "Ocean Pioneer",
    customerName: "Sofia Martinez",
    customerEmail: "sofia.m@email.com",
    customerPhone: "+971 55 987 6543",
    date: "2025-01-18",
    hours: 6,
    destination: "Dubai Marina",
    totalPrice: 7200,
    status: "pending",
    createdAt: "2025-01-09",
  },
  {
    id: "3",
    yachtId: "4",
    yachtName: "Diamond Seas",
    customerName: "James Chen",
    customerEmail: "j.chen@corporate.com",
    customerPhone: "+971 52 456 7890",
    date: "2025-01-20",
    hours: 8,
    destination: "World Islands",
    totalPrice: 28000,
    status: "confirmed",
    createdAt: "2025-01-07",
  },
  {
    id: "4",
    yachtId: "2",
    yachtName: "Azure Dream",
    customerName: "Emma Thompson",
    customerEmail: "emma.t@email.com",
    customerPhone: "+971 54 321 0987",
    date: "2025-01-12",
    hours: 3,
    destination: "Burj Al Arab",
    totalPrice: 5400,
    status: "completed",
    createdAt: "2025-01-05",
  },
]
