<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const username = ref('')
const password = ref('')
const emit = defineEmits(['onLogin'])

const submitLogin = () => {
  emit('onLogin', { username: username.value, password: password.value })
}
</script>

<template>
  <div>
    <input v-model="username" placeholder="Usuario" />
    <input v-model="password" type="password" placeholder="Contraseña" />
    <button @click="submitLogin">Login</button>
  </div>
</template>
