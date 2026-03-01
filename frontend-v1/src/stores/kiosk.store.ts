import { defineStore } from 'pinia'
import { ref } from 'vue'

/** Shared UI state for the customer kiosk — lets child views trigger the numpad modal in CustomerLayout */
export const useKioskStore = defineStore('kiosk', () => {
    const showNumpad = ref(false)

    function openNumpad() { showNumpad.value = true }
    function closeNumpad() { showNumpad.value = false }

    return { showNumpad, openNumpad, closeNumpad }
})
