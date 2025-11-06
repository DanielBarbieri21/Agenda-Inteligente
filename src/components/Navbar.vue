<template>
  <nav class="bg-white dark:bg-gray-800 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              📅 Agenda Inteligente
            </h1>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              to="/"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              :class="isActive('/') 
                ? 'border-blue-500 text-gray-900 dark:text-gray-100' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'"
            >
              Dashboard
            </router-link>
            <router-link
              to="/clients"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              :class="isActive('/clients') 
                ? 'border-blue-500 text-gray-900 dark:text-gray-100' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'"
            >
              Clientes
            </router-link>
            <router-link
              to="/schedule"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              :class="isActive('/schedule') 
                ? 'border-blue-500 text-gray-900 dark:text-gray-100' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'"
            >
              Agendamentos
            </router-link>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span v-if="authStore.user" class="text-sm text-gray-600 dark:text-gray-400">
            Olá, {{ authStore.user.name }}
          </span>
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :aria-label="isDark ? 'Modo claro' : 'Modo escuro'"
          >
            <span v-if="isDark" class="text-2xl">☀️</span>
            <span v-else class="text-2xl">🌙</span>
          </button>
          <button
            @click="handleLogout"
            class="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isDark = ref(false)

const isActive = (path) => {
  return route.path === path
}

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  window.$toast?.info('Logout realizado', 'Até logo!')
}

onMounted(() => {
  const savedMode = localStorage.getItem('darkMode')
  if (savedMode === 'true') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

