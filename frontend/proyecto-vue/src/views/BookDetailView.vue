<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useBooksStore } from '@/stores/booksStore'
import { useRentalStore } from '@/stores/rentalStore'
import { useProfileStore } from '@/stores/profileStore'

const route = useRoute()
const booksStore = useBooksStore()
const rentalStore = useRentalStore()
const profileStore = useProfileStore()

const book = ref<any>(null)
const rentalEndDate = ref('')
const rentMessage = ref('')
const rentError = ref('')

onMounted(() => {
  profileStore.fetchProfile()
  const isbn = route.params.isbn as string
  const foundBook = booksStore.books.find((b) => b.isbn === isbn)
  if (foundBook) {
    book.value = foundBook
  } else {
    booksStore.fetchBooks().then(() => {
      book.value = booksStore.books.find((b) => b.isbn === isbn)
    })
  }
})

const handleRent = async () => {
  rentMessage.value = ''
  rentError.value = ''
  if (!rentalEndDate.value) {
    rentError.value = 'Por favor, selecciona una fecha de fin de alquiler.'
    return
  }

  try {
    await rentalStore.rentBook(book.value.isbn, rentalEndDate.value)
    rentMessage.value = '¡Libro rentado con éxito!'
    book.value.available = false
  } catch (error) {
    rentError.value = 'Error al rentar el libro.'
  }
}
</script>

<template>
  <div class="container my-5">
    <router-link to="/books/" class="btn btn-secondary mt-2">Volver atrás</router-link>

    <!-- libro cargado -->
    <div v-if="book">
      <router-link :to="`/books/${book.isbn}/update/`" class="btn btn-secondary mt-2">
        Modificar
      </router-link>

      <div class="card shadow-lg p-4 mb-5">
        <div class="row g-4 align-items-center">
          <div class="col-md-4 text-center">
            <img :src="book.cover" :alt="`Cover of ${book.title}`" class="img-fluid rounded" />
          </div>

          <!-- informacion del libro -->
          <div class="col-md-8">
            <h2 class="mb-3">{{ book.title }}</h2>
            <p><strong>Autor:</strong> {{ book.author }}</p>
            <p><strong>ISBN:</strong> {{ book.isbn }}</p>
            <p><strong>Descripción:</strong> {{ book.description }}</p>
            <p><strong>Category: </strong>{{ book.category['label'].label }}</p>
            <p>
              <strong>Disponibilidad: </strong>
              <span :class="book.available ? 'text-success' : 'text-danger'">
                {{ book.available ? 'Disponible' : 'No disponible' }}
              </span>
            </p>

            <div v-if="book.available && !profileStore.user?.is_admin" class="mt-4">
              <h5 class="mb-3">Rentar este libro</h5>
              <div class="mb-3">
                <label for="rentalEndDate" class="form-label">Fecha de fin del alquiler</label>
                <input
                  type="date"
                  id="rentalEndDate"
                  class="form-control"
                  v-model="rentalEndDate"
                />
              </div>
              <button class="btn btn-primary w-100" @click="handleRent">Rentar libro</button>
              <p class="text-success mt-2" v-if="rentMessage">{{ rentMessage }}</p>
              <p class="text-danger mt-2" v-if="rentError">{{ rentError }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- libro cargando -->
    <div v-else class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3">Cargando detalles del libro...</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  max-width: 900px;
  margin: auto;
}

.card img {
  max-height: 300px;
  object-fit: cover;
}

.card-body {
  padding: 20px;
}

.btn {
  font-size: 16px;
}
</style>
