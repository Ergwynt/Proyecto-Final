import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import BooksView from '@/views/BooksView.vue'
import BookDetailView from '@/views/BookDetailView.vue'
import Rentals from '@/views/rentals.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import HomeView from '@/views/HomeView.vue'
import UpdateView from '@/views/UpdateProfile.vue'
import AddBook from '@/views/AddBookView.vue'
import UpdateBook from '@/views/UpdateBookView.vue'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  { path: '/', name: 'Welcome', component: WelcomeView },
  { path: '/home/', name: 'home', component: HomeView },
  { path: '/login/', component: LoginView },
  { path: '/register/', component: RegisterView },
  { path: '/rentals/', component: Rentals },
  { path: '/books/', name: 'books-list', component: BooksView, meta: { requiresAuth: true } },
  {
    path: '/books/:isbn/',
    name: 'book-detail',
    component: BookDetailView,
    meta: { requiresAuth: true },
  },
  { path: '/books/:isbn/update/', component: UpdateBook, meta: { requireAuth: true } },
  { path: '/profile/', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/profile/update/', component: UpdateView, meta: { requiresAuth: true } },
  {
    path: '/books/add/',
    name: 'add-book',
    component: AddBook,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login/')
  } else {
    next()
  }
})

export default router
