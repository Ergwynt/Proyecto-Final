<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/booksStore'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'

const router = useRouter()
const booksStore = useBooksStore()
const authStore = useAuthStore()

const categoryOptions = [
  { value: 'fantasy', label: 'Fantasía' },
  { value: 'scifi', label: 'Ciencia Ficción' },
  { value: 'horror', label: 'Terror' },
  { value: 'thriller', label: 'Suspenso' },
  { value: 'historical', label: 'Histórica' },
  { value: 'classic', label: 'Clásico' },
  { value: 'manga', label: 'Manga' },
]

const formData = ref({
  isbn: '',
  title: '',
  author: '',
  description: '',
  cover: null as File | null,
  available: true,
  category: 'fantasy',
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    formData.value.cover = target.files[0]
  }
}

onMounted(async () => {
  if (!authStore.user.is_superuser) {
    await router.push('/login')
    return
  }
  console.log(authStore.user.is_superuser)
  if (!authStore.user) {
    try {
      await authStore.fetchUserData()
    } catch (error) {
      await router.push('/login')
      return
    }
  }

  if (!authStore.user?.is_superuser) {
    errorMessage.value = 'No tienes permisos para realizar esta acción'
    await router.push('/books')
  }
})

const submitForm = async () => {
  if (!authStore.user?.is_superuser) {
    errorMessage.value = 'Solo administradores pueden añadir libros.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const formDataToSend = new FormData()
    formDataToSend.append('isbn', formData.value.isbn)
    formDataToSend.append('title', formData.value.title)
    formDataToSend.append('author', formData.value.author)
    formDataToSend.append('description', formData.value.description)
    formDataToSend.append('available', formData.value.available.toString())
    formDataToSend.append('category', formData.value.category)

    if (formData.value.cover) {
      formDataToSend.append('cover', formData.value.cover)
    }

    const response = await booksStore.addBook(formDataToSend)
    successMessage.value = '¡Libro añadido correctamente!'

    setTimeout(() => {
      router.push('/books/')
    }, 2000)
  } catch (error) {
    if (error.message?.includes('BookSerializer') && error.message?.includes('has no attribute')) {
      successMessage.value = '¡Libro añadido correctamente!'

      setTimeout(() => {
        router.push('/books/')
      }, 2000)
    } else {
      errorMessage.value = error.message || 'Error al añadir el libro.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h2 class="mb-0">Añadir Nuevo Libro</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="isbn" class="form-label">ISBN</label>
                <input
                  type="text"
                  class="form-control"
                  id="isbn"
                  v-model="formData.isbn"
                  required
                  maxlength="13"
                />
              </div>

              <div class="mb-3">
                <label for="title" class="form-label">Título</label>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  v-model="formData.title"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="author" class="form-label">Autor</label>
                <input
                  type="text"
                  class="form-control"
                  id="author"
                  v-model="formData.author"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Descripción</label>
                <textarea
                  class="form-control"
                  id="description"
                  v-model="formData.description"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div class="mb-3">
                <label for="category" class="form-label">Categoría</label>
                <select id="category" class="form-select" v-model="formData.category" required>
                  <option disabled value="">Seleccione una categoría</option>
                  <option
                    v-for="option in categoryOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label for="cover" class="form-label">Portada</label>
                <input
                  type="file"
                  class="form-control"
                  id="cover"
                  @change="handleFileUpload"
                  accept="image/*"
                />
              </div>

              <div class="mb-3 form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="available"
                  v-model="formData.available"
                />
                <label class="form-check-label" for="available">Disponible</label>
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                  <span
                    v-if="isSubmitting"
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {{ isSubmitting ? 'Guardando...' : 'Guardar Libro' }}
                </button>
                <router-link to="/books" class="btn btn-secondary mt-2"> Volver atras</router-link>
              </div>

              <div v-if="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>

              <div v-if="successMessage" class="alert alert-success mt-3">
                {{ successMessage }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
