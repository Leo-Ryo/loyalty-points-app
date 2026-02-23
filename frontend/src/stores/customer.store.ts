import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Customer {
    id: string; name: string; phone?: string; email?: string; points: number
}

export const useCustomerStore = defineStore('customer', () => {
    const activeCustomer = ref<Customer | null>(null)

    function setCustomer(c: Customer) { activeCustomer.value = c }
    function updatePoints(points: number) {
        if (activeCustomer.value) activeCustomer.value.points = points
    }
    function clearCustomer() { activeCustomer.value = null }

    return { activeCustomer, setCustomer, updatePoints, clearCustomer }
})
