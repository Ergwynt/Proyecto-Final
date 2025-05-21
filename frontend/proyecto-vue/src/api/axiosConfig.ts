import axios from 'axios'

// Función para obtener el token CSRF desde las cookies
const getCsrfToken = () => {
  const csrfToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken='))
    ?.split('=')[1]
  return csrfToken
}

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para añadir el token CSRF y el token de autorización en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // El token de autenticación (JWT)
    const csrfToken = getCsrfToken() // El token CSRF desde las cookies

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken // Agregar el token CSRF al encabezado
    }

    return config
  },
  (error) => Promise.reject(error),
)

export default api
