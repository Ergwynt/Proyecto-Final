import { defineStore } from 'pinia'
import api from '@/api/axiosConfig'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchProfile = async () => {
    loading.value = true
    error.value = null
    const authStore = useAuthStore()

    try {
      const response = await api.get('users/profile/', {
        headers: authStore.authHeader,
      })

      user.value = response.data.user
      profile.value = response.data.profile
    } catch (err: any) {
      error.value = err?.response?.data || err.message
    } finally {
      loading.value = false
    }
  }
  // Modificar perfil
  const updateProfile = async (bio: string, profilePicture: File | null) => {
    loading.value = true
    error.value = null
    const authStore = useAuthStore()
    const formData = new FormData()

    formData.append('bio', bio || '')
    if (profilePicture) {
      formData.append('profile_picture', profilePicture)
    }

    try {
      const response = await api.post('users/update/', formData, {
        headers: {
          ...authStore.authHeader,
          'Content-Type': 'multipart/form-data',
        },
      })

      Object.assign(user.value, response.data.user)
      Object.assign(profile.value, response.data.profile)

      return response.data
    } catch (err: any) {
      error.value = err?.response?.data?.error || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    user,
    loading,
    error,
    fetchProfile,
    updateProfile,
  }
})
