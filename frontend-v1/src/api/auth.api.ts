import api from './axios'
export const authApi = {
    adminLogin: (email: string, password: string) => api.post('/auth/admin/login', { email, password }),
    customerLookup: (identifier: string) => api.post('/auth/customer/lookup', { identifier }),
    customerRegister: (data: { name: string; phone?: string; email?: string }) => api.post('/auth/customer/register', data),
}
