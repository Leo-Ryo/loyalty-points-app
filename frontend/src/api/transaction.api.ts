import api from './axios'
export const transactionApi = {
    getAll: (params?: any) => api.get('/transactions', { params }),
    getByCustomer: (id: string) => api.get(`/transactions/customer/${id}`),
    earn: (data: any) => api.post('/transactions/earn', data),
    redeem: (data: any) => api.post('/transactions/redeem', data),
    adjust: (data: any) => api.post('/transactions/adjust', data),
    exportCsv: (params?: any) => api.get('/transactions/export', { params, responseType: 'blob' }),
}
