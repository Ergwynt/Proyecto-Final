<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api/axiosConfig'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await api.post('users/register/', {
      username: username.value,
      password: password.value,
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
    })

    // Login automático tras registro exitoso
    await authStore.login(username.value, password.value)

    successMessage.value = '¡Registro exitoso! Redirigiendo al home...'

    setTimeout(() => {
      router.push('/home')
    }, 1500)
  } catch (error: any) {
    console.error('Error al registrar usuario:', error)
    if (error.response?.data?.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = 'Ocurrió un error inesperado.'
    }
  }
}
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow-sm p-4" style="max-width: 500px; width: 100%">
      <h2 class="text-center mb-4">Registrarse</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label for="username" class="form-label">Usuario</label>
          <input v-model="username" type="text" id="username" class="form-control" required />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input v-model="password" type="password" id="password" class="form-control" required />
        </div>

        <div class="mb-3">
          <label for="firstName" class="form-label">Nombre</label>
          <input v-model="firstName" type="text" id="firstName" class="form-control" required />
        </div>

        <div class="mb-3">
          <label for="lastName" class="form-label">Apellido</label>
          <input v-model="lastName" type="text" id="lastName" class="form-control" required />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Correo electrónico</label>
          <input v-model="email" type="email" id="email" class="form-control" required />
        </div>

        <button type="submit" class="btn btn-success w-100">
          <i class="bi bi-person-plus-fill me-2"></i> Registrarse
        </button>

        <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="alert alert-success mt-3" role="alert">
          {{ successMessage }}
        </div>
      </form>
    </div>
  </div>
</template>
