import { setActivePinia, createPinia } from 'pinia'
import { useBooksStore } from '@/stores/booksStore'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/api/axiosConfig'

vi.mock('@/api/axiosConfig')

describe('booksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('fetchBooks carga libros correctamente', async () => {
    const store = useBooksStore()
    const mockBooks = [{ title: 'Libro 1' }, { title: 'Libro 2' }]

    ;(api.get as any).mockResolvedValueOnce({ data: mockBooks })

    await store.fetchBooks()

    expect(store.books).toEqual(mockBooks)
    expect(store.errorMessage).toBe('')
  })

  it('addBook llama correctamente a la API y actualiza libros', async () => {
    const store = useBooksStore()
    const mockFormData = new FormData()
    mockFormData.append('title', 'Nuevo libro')

    const mockData = { message: 'ok' }

    ;(api.post as any).mockResolvedValueOnce({ data: mockData })
    ;(api.get as any).mockResolvedValueOnce({ data: [] }) // fetchBooks

    const result = await store.addBook(mockFormData)

    expect(result).toEqual(mockData)
  })
})
