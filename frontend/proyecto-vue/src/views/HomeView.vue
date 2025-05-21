<template>
  <Layout>
    <div class="welcome-container">
      <h1 class="welcome-title">¡Bienvenido a tu Biblioteca Digital!</h1>

      <div class="card-grid">
        <router-link to="/books/" class="feature-card books-card">
          <div class="card-content">
            <i class="fas fa-book card-icon"></i>
            <h2>Explorar Libros</h2>
            <p>Descubre nuestra amplia colección de títulos disponibles</p>
          </div>
        </router-link>

        <router-link to="/rentals/" class="feature-card rentals-card">
          <div class="card-content">
            <i class="fas fa-clipboard-list card-icon"></i>
            <h2>Mis Alquileres</h2>
            <p>Gestiona tus libros alquilados y fechas de devolución</p>
          </div>
        </router-link>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/Layout.vue'
</script>

<style scoped>
.welcome-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.welcome-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 3rem;
  font-weight: 600;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 200% 200%;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  border-radius: 12px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  z-index: 1;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.books-card {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.rentals-card {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.card-content {
  position: relative;
  z-index: 2;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.card-content h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.card-content p {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 2rem;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
