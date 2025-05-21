<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useProfileStore } from '@/stores/profileStore'
import { useRouter, useRoute } from 'vue-router'
import { onBeforeMount, onMounted } from 'vue'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const router = useRouter()
const route = useRoute()
import { ref } from 'vue'
const showMenu = ref(false)
const logout = async () => {
  await authStore.logout()
  router.push('/')
}

const hideLayoutRoutes = ['/', '/login/', '/register/']

onBeforeMount(() => {
  if (!authStore.token && !hideLayoutRoutes.includes(route.path)) {
    router.push('/')
  }
})

onMounted(() => {
  profileStore.fetchProfile()
})
</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
  />

  <div id="app" class="container mt-5">
    <template v-if="authStore.token && !hideLayoutRoutes.includes(route.path)">
      <header class="bg-success text-white rounded shadow-sm mb-4 p-3">
        <nav class="navbar navbar-expand-md navbar-dark">
          <div class="container-fluid">
            <h1 class="navbar-brand fs-4">📚 Biblioteca</h1>

            <button class="navbar-toggler" type="button" @click="showMenu = !showMenu">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" :class="{ show: showMenu }">
              <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                  <router-link to="/" class="nav-link text-white">
                    <i class="bi bi-house-door-fill me-1"></i> Inicio
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/books/" class="nav-link text-white">
                    <i class="bi bi-book-half me-1"></i> Libros
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/rentals/" class="nav-link text-white">
                    <i class="bi bi-box-seam me-1"></i> Alquileres
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/profile/" class="nav-link d-flex align-items-center text-white">
                    <img
                      :src="`http://localhost:8000${profileStore.user?.profile_picture}`"
                      :alt="`Foto de ${profileStore.user?.username}`"
                      class="rounded-circle me-2"
                      style="width: 22px; height: 22px; object-fit: cover"
                      @error="
                        (e) =>
                          (e.target.src =
                            'http://localhost:8000/media/profile_pictures/default.jpg')
                      "
                    />
                    Perfil
                  </router-link>
                </li>
                <li class="nav-item">
                  <a href="#" @click.prevent="logout" class="nav-link text-white">
                    <i class="bi bi-box-arrow-right me-1"></i> Cerrar sesión
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main class="p-3 bg-light rounded shadow-sm">
        <router-view />
      </main>
    </template>

    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<style scoped>
.nav-link {
  transition: background-color 0.2s ease;
}
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
