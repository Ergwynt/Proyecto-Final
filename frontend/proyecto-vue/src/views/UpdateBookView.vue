<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBooksStore } from '@/stores/booksStore'
import { useAuthStore } from '@/stores/authStore'

interface BookFormData {
  isbn: string
  title: string
  author: string
  description: string
  cover: File | null
  available: boolean
  currentCoverUrl: string | null
  category: string // Añadido campo category
}

const router = useRouter()
const route = useRoute()
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

const formData = ref<BookFormData>({
  isbn: '',
  title: '',
  author: '',
  description: '',
  cover: null,
  available: true,
  currentCoverUrl: null,
  category: 'fantasy', // valor por defecto
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

const loadBookData = async () => {
  try {
    const isbn = route.params.isbn as string
    await booksStore.fetchBookByIsbn(isbn)

    if (booksStore.currentBook) {
      formData.value = {
        isbn: booksStore.currentBook.isbn,
        title: booksStore.currentBook.title,
        author: booksStore.currentBook.author,
        description: booksStore.currentBook.description,
        cover: null,
        available: booksStore.currentBook.available,
        currentCoverUrl: booksStore.currentBook.cover || null,
        category: booksStore.currentBook.category || 'fantasy', // asignar categoría si existe
      }
    }
  } catch (error) {
    errorMessage.value = 'Error al cargar los datos del libro'
    console.error(error)
  }
}

onMounted(async () => {
  if (!authStore.user) {
    try {
      await authStore.fetchUserData()
    } catch (error) {
      await router.push('/login/')
      return
    }
  }

  if (!authStore.user?.is_superuser) {
    errorMessage.value = 'No tienes permisos para realizar esta acción'
    await router.push('/books/')
    return
  }

  await loadBookData()
})

const submitForm = async () => {
  if (!authStore.user?.is_superuser) {
    errorMessage.value = 'Solo administradores pueden editar libros.'
    return
  }

  if (!formData.value.title || !formData.value.author || !formData.value.description) {
    errorMessage.value = 'Por favor complete todos los campos requeridos'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const formDataToSend = new FormData()

    formDataToSend.append('title', formData.value.title)
    formDataToSend.append('author', formData.value.author)
    formDataToSend.append('description', formData.value.description)
    formDataToSend.append('available', formData.value.available.toString())
    formDataToSend.append('category', formData.value.category)

    if (formData.value.cover) {
      if (formData.value.cover.size > 5 * 1024 * 1024) {
        throw new Error('La imagen no puede superar los 5MB')
      }
      formDataToSend.append('cover', formData.value.cover)
    }

    await booksStore.updateBook({
      ...formData.value,
      cover: formData.value.cover,
      category: formData.value.category,
    })

    successMessage.value = '¡Libro actualizado correctamente!'
    setTimeout(() => {
      router.push({ name: 'book-detail', params: { isbn: formData.value.isbn } })
    }, 2000)
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al actualizar el libro.'
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
            <h2 class="mb-0">Editar Libro</h2>
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
                  readonly
                />
              </div>

              <div class="mb-3">
                <label for="title" class="form-label">Título*</label>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  v-model="formData.title"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="author" class="form-label">Autor*</label>
                <input
                  type="text"
                  class="form-control"
                  id="author"
                  v-model="formData.author"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Descripción*</label>
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
                <div v-if="formData.currentCoverUrl || formData.cover" class="mt-2">
                  <img
                    :src="
                      formData.cover
                        ? URL.createObjectURL(formData.cover)
                        : formData.currentCoverUrl
                    "
                    alt="Portada del libro"
                    class="img-thumbnail"
                    style="max-height: 200px"
                  />
                  <p class="text-muted mt-1">Vista previa de la portada</p>
                </div>
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
                  {{ isSubmitting ? 'Actualizando...' : 'Actualizar Libro' }}
                </button>
                <router-link to="/books" class="btn btn-secondary mt-2">Cancelar</router-link>
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

<style scoped>
.card {
  border-radius: 10px;
}

.card-header {
  border-radius: 10px 10px 0 0 !important;
}

.form-control:read-only {
  background-color: #e9ecef;
  opacity: 1;
}
</style>
