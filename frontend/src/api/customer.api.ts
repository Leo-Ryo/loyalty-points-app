import api from './axios'
export const customerApi = {
    getAll: (search?: string) => api.get('/customers', { params: { search } }),
    getById: (id: string) => api.get(`/customers/${id}`),
    create: (data: any) => api.post('/customers', data),
    update: (id: string, data: any) => api.put(`/customers/${id}`, data),
    delete: (id: string) => api.delete(`/customers/${id}`),
    adjustPoints: (id: string, points: number, description?: string) =>
        api.post(`/customers/${id}/adjust-points`, { points, description }),
}
