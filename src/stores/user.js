import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const userInfo = ref(null)
    const token = ref('')

    const login = (userData) => {
        userInfo.value = userData
        token.value = 'mock-token-' + Date.now()
        localStorage.setItem('token', token.value)
    }

    const logout = () => {
        userInfo.value = null
        token.value = ''
        localStorage.removeItem('token')
    }

    const isLoggedIn = () => {
        return !!userInfo.value
    }

    return {
        userInfo,
        token,
        login,
        logout,
        isLoggedIn
    }
})