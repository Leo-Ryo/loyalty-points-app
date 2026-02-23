import api from './axios'
export const settingsApi = {
    get: () => api.get('/settings'),
    update: (data: any) => api.put('/settings', data),
    upload: (file: File, folder: string) => {
        const form = new FormData()
        form.append('image', file)
        form.append('folder', `uploads/${folder}`)
        return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
}
