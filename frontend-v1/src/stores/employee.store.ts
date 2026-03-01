import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEmployeeStore = defineStore('employee', () => {
    const token = ref<string | null>(localStorage.getItem('emp_token'))
    const employee = ref<any | null>(JSON.parse(localStorage.getItem('emp_user') || 'null'))

    const isAuthenticated = computed(() => !!token.value)

    function setEmployee(data: { token: string; employee: any }) {
        token.value = data.token
        employee.value = data.employee
        localStorage.setItem('emp_token', data.token)
        localStorage.setItem('emp_user', JSON.stringify(data.employee))
    }

    function clearEmployee() {
        token.value = null
        employee.value = null
        localStorage.removeItem('emp_token')
        localStorage.removeItem('emp_user')
    }

    return { token, employee, isAuthenticated, setEmployee, clearEmployee }
})

