import api from './axios'
export const inventoryApi = {
    getAll: () => api.get('/inventory'),
    getById: (id: string) => api.get(`/inventory/${id}`),
    create: (data: any) => api.post('/inventory', data),
    update: (id: string, data: any) => api.put(`/inventory/${id}`, data),
    delete: (id: string) => api.delete(`/inventory/${id}`),
    getLowStock: (threshold = 5) => api.get('/inventory/low-stock', { params: { threshold } }),
    uploadImage: (file: File) => {
        const fd = new FormData()
        fd.append('image', file)
        return api.post('/inventory/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
}
