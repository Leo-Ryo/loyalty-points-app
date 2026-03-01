import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Admin { id: string; email: string; firstName: string; lastName: string }

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(null)
    const admin = ref<Admin | null>(null)

    const isAuthenticated = computed(() => !!token.value)

    function login(data: { token: string; admin: Admin }) {
        token.value = data.token
        admin.value = data.admin
    }

    function logout() {
        token.value = null
        admin.value = null
    }

    return { token, admin, isAuthenticated, login, logout }
})
