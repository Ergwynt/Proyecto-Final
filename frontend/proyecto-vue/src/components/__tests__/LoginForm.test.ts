// src/components/__tests__/LoginForm.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import LoginForm from '@/components/LoginForm.vue'
import { useAuthStore } from '@/stores/authStore'

describe('LoginForm.vue', () => {
  let wrapper: ReturnType<typeof mount>
  let authStore: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    wrapper = mount(LoginForm, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    })

    authStore = useAuthStore()
  })

  it('llama a authStore.login con el usuario y contraseña correctos', async () => {
    const loginSpy = vi.spyOn(authStore, 'login').mockResolvedValue()

    await wrapper.find('#username').setValue('admin')
    await wrapper.find('#password').setValue('1234')
    await wrapper.find('form').trigger('submit.prevent')

    expect(loginSpy).toHaveBeenCalledWith('admin', '1234')
  })

  it('muestra mensaje de error si login falla', async () => {
    // Simulamos que el login lanza un error
    vi.spyOn(authStore, 'login').mockRejectedValue(new Error('Credenciales inválidas'))

    await wrapper.find('#username').setValue('admin')
    await wrapper.find('#password').setValue('wrongpass')
    await wrapper.find('form').trigger('submit.prevent')

    // Esperamos a que el DOM se actualice
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Credenciales incorrectas')
  })
})
