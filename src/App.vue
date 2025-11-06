<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <Navbar v-if="authStore.isAuthenticated" />
    <main class="max-w-7xl mx-auto">
      <router-view />
    </main>
    <Toast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Toast from './components/Toast.vue'
import { useAuthStore } from './store/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
})
</script>
