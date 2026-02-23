import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Toast { id: number; type: 'success' | 'error' | 'warning'; message: string }

export const useNotificationStore = defineStore('notifications', () => {
    const toasts = ref<Toast[]>([])
    let nextId = 0

    function add(type: Toast['type'], message: string, duration = 3500) {
        const id = ++nextId
        toasts.value.push({ id, type, message })
        setTimeout(() => remove(id), duration)
    }

    function remove(id: number) {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    const success = (msg: string) => add('success', msg)
    const error = (msg: string) => add('error', msg, 5000)
    const warning = (msg: string) => add('warning', msg)

    return { toasts, success, error, warning, remove }
})
