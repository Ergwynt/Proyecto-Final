import { defineStore } from 'pinia'
import api from '@/api/axiosConfig'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

interface Book {
  id: number
  isbn: string
  title: string
  slug: string
  author: string
  description: string
  cover: string | null
  available: boolean
  category: {
    value: string
    label: string
  }
}

export const useBooksStore = defineStore('booksStore', () => {
  const books = ref<Book[]>([])
  const currentBook = ref<Book | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'fantasy', label: 'Fantasía' },
    { value: 'scifi', label: 'Ciencia Ficción' },
    { value: 'horror', label: 'Terror' },
    { value: 'thriller', label: 'Suspenso' },
    { value: 'historical', label: 'Histórica' },
    { value: 'classic', label: 'Clásico' },
    { value: 'manga', label: 'Manga' },
  ]

  const fetchBooks = async (title = '', author = '', category = '') => {
    isLoading.value = true
    try {
      const response = await api.get('books/', {
        params: { title, author, category },
      })

      books.value = response.data.map((book: any) => {
        const cat = categories.find((c) => c.value === book.category)
        return {
          ...book,
          category: cat
            ? cat
            : { value: book.category || '', label: book.category || 'Sin categoría' },
        }
      })

      errorMessage.value = ''
    } catch (error) {
      console.error('Error al obtener libros', error)
      errorMessage.value = 'Hubo un problema al cargar los libros'
    } finally {
      isLoading.value = false
    }
  }

  const fetchBookByIsbn = async (isbn: string) => {
    isLoading.value = true
    try {
      const response = await api.get(`books/${isbn}/`)
      currentBook.value = response.data
      errorMessage.value = ''
    } catch (error) {
      console.error('Error al obtener el libro', error)
      errorMessage.value = 'Hubo un problema al cargar el libro'
    } finally {
      isLoading.value = false
    }
  }

  const addBook = async (bookData: FormData) => {
    isLoading.value = true
    try {
      const authStore = useAuthStore()
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))
        ?.split('=')[1]

      const response = await api.post('books/create/', bookData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${authStore.token}`,
          'X-CSRFToken': csrfToken || '',
        },
        withCredentials: true,
      })

      await fetchBooks()
      return response.data
    } catch (error: any) {
      console.error('Error al añadir libro', error)
      throw new Error(error.response?.data?.error || 'Error al añadir el libro')
    } finally {
      isLoading.value = false
    }
  }

  const updateBook = async (book: Book & { cover?: File | null }) => {
    isLoading.value = true
    errorMessage.value = ''

    if (!book.title || !book.author || !book.category || !book.isbn) {
      errorMessage.value = 'Faltan campos obligatorios'
      isLoading.value = false
      return
    }

    try {
      const authStore = useAuthStore()
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))
        ?.split('=')[1]

      const formData = new FormData()
      formData.append('title', book.title)
      formData.append('author', book.author)
      formData.append('description', book.description)
      formData.append('category', book.category)
      formData.append('available', book.available ? 'true' : 'false')

      if (book.cover) {
        formData.append('cover', book.cover)
      }

      const response = await api.post(`books/${book.isbn}/update/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken || '',
          Authorization: `Bearer ${authStore.token}`,
        },
      })

      await fetchBooks()
      return response.data
    } catch (error: any) {
      console.error('Error al actualizar libro', error)
      throw new Error(error.response?.data?.error || 'Error al añadir el libro')
    } finally {
      isLoading.value = false
    }
  }

  return {
    books,
    currentBook,
    isLoading,
    errorMessage,
    fetchBooks,
    fetchBookByIsbn,
    addBook,
    updateBook,
  }
})
