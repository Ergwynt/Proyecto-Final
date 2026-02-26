<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRentalStore } from '@/stores/rentalStore'
import { useProfileStore } from '@/stores/profileStore'

const rentalStore = useRentalStore()
const profileStore = useProfileStore()
const successMessage = ref<string | null>(null)

onMounted(() => {
  rentalStore.fetchRentals()
  profileStore.fetchProfile()
})

const isReturning = ref(false)

const isAdmin = computed(() => profileStore.user?.is_admin)


const groupedRentals = computed(() => {
  if (!isAdmin.value) return {}

  const groups: Record<string, typeof rentalStore.rentals> = {}
  rentalStore.rentals.forEach((rental) => {
    const username = rental.user?.username || 'Desconocido'
    if (!groups[username]) {
      groups[username] = []
    }
    groups[username].push(rental)
  })
  return groups
})

const returnBook = async (rentalId: number, bookTitle: string) => {
  isReturning.value = true
  try {
    await rentalStore.returnBook(rentalId)

    successMessage.value = `¡Libro devuelto correctamente! "${bookTitle}"`
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (err) {
    console.error('Error al devolver el libro:', err)
  } finally {
    isReturning.value = false
  }
}
</script>

<template>
  <div class="container my-5">
    <div v-if="profileStore.user?.is_admin">
      <h2 class="mb-4 text-center">👥 Alquileres de usuarios</h2>
    </div>
    <div v-if="!profileStore.user?.is_admin">
      <h2 class="mb-4 text-center">📚 Mis alquileres 📚</h2>
    </div>
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>

    <div v-if="rentalStore.loading" class="alert alert-info">Cargando...</div>
    <div v-if="rentalStore.error" class="alert alert-danger">{{ rentalStore.error }}</div>
    <br />

    <!--ADMIN -->
    <div v-if="profileStore.user?.is_admin">
      <div v-for="(rentals, username) in groupedRentals" :key="username" class="mb-5">
        <h4 class="mb-3" style="text-align: center">{{ username }}</h4>
        <div class="row">
          <div class="col-12 mb-4" v-for="rental in rentals" :key="rental.rental_id">
            <div class="card h-100 shadow-sm">
              <div class="card-body text-center">
                <img
                  :src="rental.book.cover"
                  :alt="`Cover of ${rental.book.title}`"
                  class="img-fluid rounded"
                />
                <h5 class="card-title mt-2">{{ rental.book.title }}</h5>
                <p class="card-text"><strong>Autor:</strong> {{ rental.book.author }}</p>
                <p class="card-text">
                  <strong>Hasta:</strong>
                  {{
                    new Date(rental.rental_end_date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  }}
                </p>
              </div>
            </div>
          </div>
          <div class="strong-divider"></div>
        </div>
      </div>
    </div>

    <!--USUARIO -->
    <div v-else>
      <div v-if="rentalStore.rentals.length > 0" class="row">
        <div class="col-12 mb-4" v-for="rental in rentalStore.rentals" :key="rental.rental_id">
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <img
                :src="rental.book.cover"
                :alt="`Cover of ${rental.book.title}`"
                class="img-fluid rounded"
              />
              <h5 class="card-title mt-2">{{ rental.book.title }}</h5>
              <p class="card-text"><strong>Autor:</strong> {{ rental.book.author }}</p>
              <p class="card-text">
                <strong>Hasta:</strong>
                {{
                  new Date(rental.rental_end_date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                }}
              </p>
              <button
                @click="returnBook(rental.rental_id, rental.book.title)"
                class="btn btn-outline-danger w-100 mt-3"
                :disabled="isReturning"
              >
                <i class="bi bi-box-arrow-in-down"></i>
                {{ isReturning ? 'Devolviendo...' : 'Devolver' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-muted text-center">No tienes alquileres activos.</div>
    </div>
  </div>
</template>

<style scoped>
.strong-divider {
  height: 6px;
  background-color: #00855d;
  margin: 1.5rem 0;
  border-radius: 3px;
  box-shadow: 0 2px 5px rgba(0, 64, 133, 0.6);
}
.card img {
  max-height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.card-text {
  font-size: 1rem;
  margin-bottom: 1rem;
}
</style>
