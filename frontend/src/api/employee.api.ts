import api from './axios'
export const employeeApi = {
    // Auth — returns { token, employee }
    login: (phone: string, pin: string) => api.post('/auth/employee/login', { phone, pin }),

    // Admin management
    getAll: () => api.get('/employees'),
    create: (data: any) => api.post('/employees', data),
    update: (id: string, data: any) => api.put(`/employees/${id}`, data),
    delete: (id: string) => api.delete(`/employees/${id}`),
    resetPin: (id: string, newPin?: string) => api.post(`/employees/${id}/reset-pin`, { newPin }),
    changePin: (id: string, data: { currentPin: string; newPin: string }) =>
        api.post(`/employees/${id}/change-pin`, data),

    // Transaction helpers (employee context)
    earnFromBill: (customerId: string, billAmount: number, description?: string) =>
        api.post('/transactions/earn-bill', { customerId, billAmount, description }),
    employeeRedeem: (customerId: string, rewardId: string) =>
        api.post('/transactions/redeem/employee', { customerId, rewardId }),
    getPending: () => api.get('/transactions/pending'),
    approve: (txId: string) => api.post(`/transactions/${txId}/approve`),
    reject: (txId: string) => api.post(`/transactions/${txId}/reject`),
}
