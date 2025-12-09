const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: any
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('auth_token') 
    : null

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const data: ApiResponse<T> = await response.json()

  if (!response.ok || !data.success) {
    throw new ApiError(
      data.message || 'An error occurred',
      response.status,
      data.errors
    )
  }

  return data.data as T
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  
  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  
  put: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}

export interface Yacht {
  id: number
  name: string
  description: string
  price: number
  capacity: number
  length: number
  image: string
  features: string[]
  category: 'luxury' | 'premium' | 'ultra-luxury'
}

export interface Destination {
  id: number
  name: string
  description: string
  image: string
  duration: string
}

export interface Booking {
  id: number
  yacht_id: number
  destination_id: number | null
  customer_name: string
  customer_email: string
  customer_phone: string
  date: string
  hours: number
  total_price: number
  notes: string | null
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  yacht_name?: string
  destination_name?: string
}

export interface BookingCreate {
  yacht_id: number
  destination_id: number | null
  customer_name: string
  customer_email: string
  customer_phone: string
  date: string
  hours: number
  notes?: string
}

export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'user'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const yachtsApi = {
  getAll: (params?: { category?: string; search?: string; sort?: string; order?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sort) queryParams.append('sort', params.sort)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return api.get<Yacht[]>(`/yachts${query ? `?${query}` : ''}`)
  },
  
  getById: (id: number) => api.get<Yacht>(`/yachts/${id}`),
  
  create: (yacht: Omit<Yacht, 'id'>) => api.post<Yacht>('/admin/yachts', yacht),
  
  update: (id: number, yacht: Partial<Yacht>) => api.put<Yacht>(`/admin/yachts/${id}`, yacht),
  
  delete: (id: number) => api.delete<void>(`/admin/yachts/${id}`),
}

export const destinationsApi = {
  getAll: (params?: { search?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append('search', params.search)
    
    const query = queryParams.toString()
    return api.get<Destination[]>(`/destinations${query ? `?${query}` : ''}`)
  },
  
  getById: (id: number) => api.get<Destination>(`/destinations/${id}`),
  
  create: (destination: Omit<Destination, 'id'>) => 
    api.post<Destination>('/admin/destinations', destination),
  
  update: (id: number, destination: Partial<Destination>) => 
    api.put<Destination>(`/admin/destinations/${id}`, destination),
  
  delete: (id: number) => api.delete<void>(`/admin/destinations/${id}`),
}

export const bookingsApi = {
  create: (booking: BookingCreate) => api.post<Booking>('/bookings', booking),
  
  getAll: (params?: { status?: string; search?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.search) queryParams.append('search', params.search)
    
    const query = queryParams.toString()
    return api.get<Booking[]>(`/admin/bookings${query ? `?${query}` : ''}`)
  },
  
  getById: (id: number) => api.get<Booking>(`/admin/bookings/${id}`),
  
  updateStatus: (id: number, status: Booking['status']) => 
    api.put<Booking>(`/admin/bookings/${id}/status`, { status }),
  
  update: (id: number, booking: Partial<Booking>) => 
    api.put<Booking>(`/admin/bookings/${id}`, booking),
  
  delete: (id: number) => api.delete<void>(`/admin/bookings/${id}`),
}

export const authApi = {
  login: (credentials: LoginCredentials) => 
    api.post<AuthResponse>('/auth?action=login', credentials),
  
  register: (credentials: RegisterCredentials) =>
    api.post<AuthResponse>('/auth?action=register', credentials),
  
  getMe: () => api.get<{ user: User }>('/auth?me'),
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  },
  
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  },
  
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  },
}

export { ApiError }

