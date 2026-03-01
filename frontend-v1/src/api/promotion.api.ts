import api from './axios'
export const promotionApi = {
    getAll: (activeOnly = false) => api.get('/promotions', { params: { activeOnly } }),
    getById: (id: string) => api.get(`/promotions/${id}`),
    create: (data: any) => api.post('/promotions', data),
    update: (id: string, data: any) => api.put(`/promotions/${id}`, data),
    delete: (id: string) => api.delete(`/promotions/${id}`),
    toggle: (id: string) => api.patch(`/promotions/${id}/toggle`),
}
