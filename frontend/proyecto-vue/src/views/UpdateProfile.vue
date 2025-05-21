<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profileStore'

const router = useRouter()
const profileStore = useProfileStore()
const bio = ref('')
const profilePicture = ref<File | null>(null)
const previewUrl = ref('')
const successMessage = ref('')

onMounted(() => {
  profileStore.fetchProfile()
})

watch(
  () => profileStore.user,
  (newUser) => {
    if (newUser) {
      bio.value = newUser.bio || ''
      if (newUser.profile_picture) {
        previewUrl.value = newUser.profile_picture.startsWith('http')
          ? newUser.profile_picture
          : `http://localhost:8000${newUser.profile_picture}`
      }
    }
  },
  { immediate: true, deep: true },
)

const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    profilePicture.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const submitForm = async () => {
  successMessage.value = ''
  try {
    await profileStore.updateProfile(bio.value, profilePicture.value)
    successMessage.value = 'Perfil actualizado correctamente'

    setTimeout(() => {
      router.push('/profile')
    }, 1500)
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
  }
}
</script>

<template>
  <router-link to="/profile" class="btn btn-secondary mt-2"> Volver atras</router-link>
  <div class="container mt-5" style="max-width: 600px">
    <h2 class="mb-4 text-center">Actualizar Perfil</h2>

    <div v-if="profileStore.error" class="alert alert-danger">
      {{ profileStore.error }}
    </div>

    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>

    <form @submit.prevent="submitForm" enctype="multipart/form-data">
      <div class="mb-3 text-center">
        <img
          :src="previewUrl || 'https://via.placeholder.com/120'"
          alt="Vista previa"
          class="rounded-circle"
          style="width: 120px; height: 120px; object-fit: cover"
        />
      </div>

      <div class="mb-3">
        <label for="bio" class="form-label">Biografía</label>
        <textarea
          id="bio"
          v-model="bio"
          class="form-control"
          rows="3"
          placeholder="Escribe algo sobre ti..."
        ></textarea>
      </div>

      <div class="mb-3">
        <label for="profilePicture" class="form-label">Foto de perfil</label>
        <input
          id="profilePicture"
          name="profile_picture"
          type="file"
          accept="image/*"
          class="form-control"
          @change="handleImageChange"
        />
        <small class="text-muted">Formatos soportados: JPG, PNG, GIF</small>
      </div>

      <button type="submit" class="btn btn-success w-100" :disabled="profileStore.loading">
        <span
          v-if="profileStore.loading"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        {{ profileStore.loading ? 'Guardando...' : 'Guardar Cambios' }}
      </button>
    </form>
  </div>
</template>
