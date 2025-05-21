<script setup lang="ts">
import { onMounted } from 'vue'
import { useProfileStore } from '@/stores/profileStore'
import { useRouter } from 'vue-router'

const profileStore = useProfileStore()
const router = useRouter()

onMounted(() => {
  profileStore.fetchProfile()
})
</script>

<template>
  <div v-if="!profileStore.loading" class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <h2 class="profile-title">Mi Perfil</h2>
        <div class="profile-edit-btn" @click="router.push('/profile/update')">
          <i class="bi bi-pencil"></i>
        </div>
      </div>

      <div v-if="profileStore.error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        {{ profileStore.error }}
      </div>

      <div v-else class="profile-content">
        <div class="avatar-container">
          <img
            :src="
              profileStore.user?.profile_picture?.startsWith('http')
                ? profileStore.user.profile_picture
                : `http://localhost:8000${profileStore.user?.profile_picture}`
            "
            :alt="`Foto de ${profileStore.user?.username}`"
            class="profile-avatar"
            :class="{ 'default-avatar': !profileStore.user?.profile_picture }"
          />
          <div class="avatar-overlay">
            <i class="fas fa-camera"></i>
          </div>
        </div>

        <div class="profile-details">
          <div class="detail-item">
            <div class="detail-icon">
              <i class="fas fa-user"></i>
            </div>
            <div class="detail-content">
              <h3 class="detail-label">Usuario</h3>
              <p class="detail-value">{{ profileStore.user?.username }}</p>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="detail-content">
              <h3 class="detail-label">Email</h3>
              <p class="detail-value">{{ profileStore.user?.email || 'No disponible' }}</p>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon">
              <i class="fas fa-info-circle"></i>
            </div>
            <div class="detail-content">
              <h3 class="detail-label">Biografía</h3>
              <p class="detail-value bio-text">
                {{ profileStore.profile?.bio || 'Cuéntanos algo sobre ti...' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading-container">
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Cargando tu perfil...</p>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.profile-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.profile-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.profile-edit-btn {
  background: rgba(255, 255, 255, 0.2);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-edit-btn:hover {
  background: green;
  transform: rotate(15deg);
}

.error-message {
  padding: 1.5rem;
  background: #ffeeee;
  color: #ff4444;
  border-radius: 8px;
  margin: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-content {
  padding: 2rem;
}

.avatar-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  border: 5px solid #f8f9fa;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.default-avatar {
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 3rem;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 1.5rem;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.profile-details {
  max-width: 500px;
  margin: 0 auto;
}

.detail-item {
  display: flex;
  gap: 1rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4facfe;
  font-size: 1.1rem;
}

.detail-content {
  flex: 1;
}

.detail-label {
  margin: 0 0 0.3rem 0;
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.detail-value {
  margin: 0;
  font-size: 1.1rem;
  color: #343a40;
  font-weight: 500;
}

.bio-text {
  font-style: italic;
  color: #495057;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4facfe;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .profile-header {
    padding: 1rem;
  }

  .profile-title {
    font-size: 1.5rem;
  }

  .profile-content {
    padding: 1.5rem;
  }

  .avatar-container {
    width: 120px;
    height: 120px;
    margin-bottom: 1.5rem;
  }
}
</style>
