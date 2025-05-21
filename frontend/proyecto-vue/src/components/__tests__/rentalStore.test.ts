import { setActivePinia, createPinia } from 'pinia'
import { useRentalStore } from '@/stores/rentalStore'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/api/axiosConfig'

vi.mock('@/api/axiosConfig')

describe('rentalStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('fetchRentals obtiene lista de alquileres', async () => {
    const store = useRentalStore()
    const mockData = [{ id: 1, book: 'Libro' }]

    ;(api.get as any).mockResolvedValueOnce({ data: mockData })

    await store.fetchRentals()
    expect(store.rentals).toEqual(mockData)
    expect(store.error).toBe(null)
  })

  it('rentBook llama al endpoint y actualiza alquileres', async () => {
    const store = useRentalStore()
    const mockResponse = { id: 99 }

    ;(api.post as any).mockResolvedValueOnce({ data: mockResponse })
    ;(api.get as any).mockResolvedValueOnce({ data: [] }) // fetchRentals

    const result = await store.rentBook('1234567890', '2025-05-20')
    expect(result).toEqual(mockResponse)
  })
})
