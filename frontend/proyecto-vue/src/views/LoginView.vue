<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    await authStore.login(username.value, password.value)
  } catch (error) {
    errorMessage.value = 'Credenciales incorrectas'
  }
}
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow-sm p-4" style="max-width: 400px; width: 100%">
      <h2 class="text-center mb-4">Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">Usuario</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="form-control"
            placeholder="Ingrese su usuario"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Ingrese su contraseña"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100">
          <i class="bi bi-box-arrow-in-right me-2"></i> Entrar
        </button>
        <div class="text-center mt-3">
          <router-link to="/register">¿No tienes cuenta? Regístrate aquí</router-link>
        </div>

        <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>
