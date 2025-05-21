import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axiosConfig'

export const useRentalStore = defineStore('rental', () => {
  const rentals = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // obtener alquileres
  const fetchRentals = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('rentals/')
      console.log('Alquileres obtenidos:', response.data)
      rentals.value = response.data
    } catch (err) {
      error.value = 'Error al obtener los alquileres'
      console.error('Error en fetchRentals:', err)
    } finally {
      loading.value = false
    }
  }

  // rentar un libro
  const rentBook = async (isbn: string, rentalEndDate: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('rentals/rent/', {
        isbn,
        rental_end_date: rentalEndDate,
      })
      await fetchRentals()
      return response.data
    } catch (err) {
      error.value = 'Error al rentar el libro'
      console.error('Error en rentBook:', err)
      throw new Error('Error al rentar el libro')
    } finally {
      loading.value = false
    }
  }

  //devolver libro
  const returnBook = async (rentalId: number) => {
    loading.value = true
    error.value = null
    try {
      await api.post('rentals/return/', { rental_id: rentalId })
      await fetchRentals()
    } catch (err) {
      error.value = 'Error al devolver el libro'
      console.error('Error en returnBook:', err)
      throw new Error('Error al devolver el libro')
    } finally {
      loading.value = false
    }
  }

  return {
    rentals,
    loading,
    error,
    fetchRentals,
    rentBook,
    returnBook,
  }
})
