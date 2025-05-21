import { defineStore } from 'pinia'
import api from '@/api/axiosConfig'
import { ref, computed } from 'vue'
import router from '@/router'

interface User {
  id: number | null
  username: string | null
  is_superuser: boolean | null
  profile: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)

  let parsedUser: User | null = null
  const storedUser = localStorage.getItem('user')

  if (storedUser) {
    try {
      parsedUser = JSON.parse(storedUser)
    } catch (error) {
      console.warn('El contenido de localStorage["user"] no es JSON válido:', error)
      localStorage.removeItem('user')
    }
  }

  const user = ref<User | null>(parsedUser)
  const errorMessage = ref('')
  const isLoading = ref(false)

  // ✅ Nuevo: Getter computado para los headers de autorización
  const authHeader = computed(() => ({
    Authorization: token.value ? `Bearer ${token.value}` : '',
  }))

  const isAuthenticated = async (): Promise<boolean> => {
    if (!token.value) return false

    try {
      await api.get('auth/', {
        headers: { Authorization: `Token ${token.value}` },
      })
      return true
    } catch (error) {
      logout()
      return false
    }
  }

  const login = async (username: string, password: string) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await api.post('users/login/', { username, password })

      if (!response.data?.token || !response.data?.user) {
        throw new Error('Invalid response structure')
      }

      token.value = response.data.token
      localStorage.setItem('token', response.data.token)

      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(response.data.user))

      router.push('/home')
    } catch (error: any) {
      console.error('Login error:', error)

      errorMessage.value =
        error.response?.data?.error ||
        error.message ||
        'Error en el login, por favor verifica tus credenciales.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserData = async () => {
    if (!token.value) return

    try {
      const response = await api.get('auth/', {
        headers: authHeader.value, // 👈 Usamos el getter computado
      })

      if (!response.data?.user) {
        throw new Error('Invalid user data in response')
      }

      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(response.data.user))
    } catch (error: any) {
      console.error('Error fetching user data:', error)
      if (error.response?.status === 401) {
        logout()
      }
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await api.post(
          'users/logout/',
          {},
          {
            headers: authHeader.value, // 👈 También aquí
          },
        )
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      user.value = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
      })

      router.push('/login')
    }
  }

  return {
    token,
    user,
    errorMessage,
    isLoading,
    login,
    fetchUserData,
    logout,
    isAuthenticated,
    authHeader, // ✅ Asegúrate de exportarlo
  }
})
