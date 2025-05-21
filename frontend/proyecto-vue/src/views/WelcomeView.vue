<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

onBeforeMount(() => {
  if (authStore.token) {
    router.push('/home')
  }
})
</script>

<template>
  <div class="container d-flex flex-column justify-content-center align-items-center min-vh-100">
    <div class="text-center">
      <h1 class="mb-4">📖 Bienvenido a la Biblioteca</h1>
      <p class="lead">Para acceder al sistema, por favor inicia sesión o regístrate.</p>
      <div class="d-flex justify-content-center gap-3 mt-4">
        <router-link to="/login" class="btn btn-primary">
          <i class="bi bi-box-arrow-in-right me-2"></i> Iniciar Sesión
        </router-link>
        <router-link to="/register" class="btn btn-outline-secondary">
          <i class="bi bi-person-plus me-2"></i> Registrarse
        </router-link>
      </div>
    </div>
  </div>
</template>
