<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBooksStore } from '@/stores/booksStore'
import { useProfileStore } from '@/stores/profileStore'

const booksStore = useBooksStore()
const profileStore = useProfileStore()
const categories = ref([
  { value: 'fantasy', label: 'Fantasía' },
  { value: 'scifi', label: 'Ciencia Ficción' },
  { value: 'horror', label: 'Terror' },
  { value: 'thriller', label: 'Suspenso' },
  { value: 'historical', label: 'Histórica' },
  { value: 'classic', label: 'Clásico' },
  { value: 'manga', label: 'Manga' },
])
const titleSearch = ref('')
const authorSearch = ref('')
const categorySearch = ref<{ value: string; label: string } | null>(null)

onMounted(() => {
  booksStore.fetchBooks()
  profileStore.fetchProfile()
})

const handleSearch = () => {
  booksStore.fetchBooks(titleSearch.value, authorSearch.value, categorySearch.value?.value || '')
}
</script>

<template>
  <div class="container my-5">
    <h2 class="mb-4 text-center text-primary">📚 Listado de Libros 📚</h2>

    <div v-if="profileStore.user?.is_admin" class="text-center mb-4">
      <router-link to="/books/add/" class="btn btn-success btn-lg">
        <i class="bi bi-plus-circle"></i> Añadir Libro
      </router-link>
    </div>

    <div class="row mb-4">
      <div class="col-md-3 mb-2">
        <input
          v-model="titleSearch"
          type="text"
          class="form-control"
          placeholder="Buscar por título"
        />
      </div>
      <div class="col-md-3 mb-2">
        <input
          v-model="authorSearch"
          type="text"
          class="form-control"
          placeholder="Buscar por autor"
        />
      </div>
      <div class="col-md-3 mb-2">
        <select v-model="categorySearch" class="form-select">
          <option :value="null">Todas las categorías</option>
          <option v-for="cat in categories" :key="cat.value" :value="cat">
            {{ cat.label }}
          </option>
        </select>
      </div>
      <div class="col-md-3 mb-2">
        <button class="btn btn-primary w-100" @click="handleSearch">Buscar</button>
      </div>
    </div>

    <div v-if="booksStore.isLoading" class="alert alert-info">Cargando...</div>
    <div v-if="booksStore.errorMessage" class="alert alert-danger">
      {{ booksStore.errorMessage }}
    </div>

    <div v-if="booksStore.books.length > 0" class="row">
      <div class="col-md-4 mb-4" v-for="book in booksStore.books" :key="book.isbn">
        <div class="card h-100">
          <router-link :to="`/books/${book.isbn}/`" class="text-decoration-none text-dark">
            <img :src="book.cover" :alt="`Cover of ${book.title}`" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title">{{ book.title }}</h5>
              <p class="card-text">
                Autor: <strong>{{ book.author }}</strong
                ><br />
                Categoría:
                <em>{{ book.category?.label.label || 'Sin categoría' }}</em>
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <div v-else class="text-muted text-center">No hay libros disponibles.</div>
  </div>
</template>

<style scoped>
.card img {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 0.375rem;
}

.card-body {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.card-text {
  font-size: 1rem;
}

h2 {
  font-size: 2.5rem;
  font-weight: 700;
}

input.form-control {
  border-radius: 0.375rem;
}

button.btn {
  font-weight: 600;
  border-radius: 0.375rem;
}

@media (max-width: 768px) {
  .card-img-top {
    max-height: 200px;
  }
}
</style>
