import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

const api = axios.create({
    baseURL: (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
})

// Attach JWT: admin token takes priority, then employee token
api.interceptors.request.use((config) => {
    try {
        const auth = useAuthStore()
        if (auth.token) {
            config.headers.Authorization = `Bearer ${auth.token}`
        } else {
            // Employee panel doesn't use Pinia store at request time—read from localStorage directly
            const empToken = localStorage.getItem('emp_token')
            if (empToken) config.headers.Authorization = `Bearer ${empToken}`
        }
    } catch { /* store not yet initialized */ }
    return config
})

// Unwrap ApiResponse envelope: { success, data } → data
api.interceptors.response.use(
    (res) => {
        const d = (res as any).data
        return (d && d.success !== undefined && 'data' in d) ? d.data : d
    },
    (err: any) => {
        const msg = err.response?.data?.message || 'Request failed'
        return Promise.reject(new Error(msg))
    }
)

// Export typed as `any` so all callers get `any` return type (not AxiosResponse)
export default api as any
