import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/api/axiosConfig'

vi.mock('@/api/axiosConfig') // Simulamos axios

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('inicia sesión correctamente y guarda token/usuario', async () => {
    const store = useAuthStore()

    const mockResponse = {
      data: {
        token: '123456',
        user: { id: 1, username: 'admin', is_superuser: true, profile: 'bio' },
      },
    }

    ;(api.post as any).mockResolvedValueOnce(mockResponse)

    await store.login('admin', '1234')

    expect(store.token).toBe('123456')
    expect(store.user?.username).toBe('admin')
    expect(localStorage.getItem('token')).toBe('123456')
  })

  it('devuelve false si no hay token al verificar autenticación', async () => {
    const store = useAuthStore()
    const result = await store.isAuthenticated()
    expect(result).toBe(false)
  })
})
