import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const isAuthenticated = ref(!!authStore.token)

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      if (response.ok) {
        authStore.setToken(data.token)
        isAuthenticated.value = true
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error en login:', error)
    }
  }

  return { login, isAuthenticated }
}
