import api from './axios'
export const rewardApi = {
    getAll: (includeInactive = false) => api.get('/rewards', { params: { includeInactive } }),
    getById: (id: string) => api.get(`/rewards/${id}`),
    create: (data: any) => api.post('/rewards', data),
    update: (id: string, data: any) => api.put(`/rewards/${id}`, data),
    delete: (id: string) => api.delete(`/rewards/${id}`),
    toggle: (id: string) => api.patch(`/rewards/${id}/toggle`),
}
