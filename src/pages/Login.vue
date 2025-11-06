<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          📅 Agenda Inteligente
        </h1>
        
        <div v-if="isRegister" class="mb-4">
          <h2 class="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
            Criar Conta
          </h2>
        </div>
        <div v-else class="mb-4">
          <h2 class="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
            Login
          </h2>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="isRegister">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              E-mail
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Senha
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div v-if="error" class="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {{ loading ? 'Processando...' : (isRegister ? 'Criar Conta' : 'Entrar') }}
          </button>
        </form>

        <div class="mt-4 text-center">
          <button
            @click="isRegister = !isRegister"
            class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            {{ isRegister ? 'Já tem uma conta? Faça login' : 'Não tem conta? Registre-se' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const isRegister = ref(false)
const loading = ref(false)
const error = ref('')

const form = ref({
  name: '',
  email: '',
  password: ''
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    if (isRegister.value) {
      await authStore.register(form.value)
      window.$toast?.success('Conta criada!', 'Bem-vindo ao Agenda Inteligente')
    } else {
      await authStore.login(form.value.email, form.value.password)
      window.$toast?.success('Login realizado!', 'Bem-vindo de volta')
    }
    
    router.push('/')
  } catch (err) {
    let errorMessage = err.message || 'Erro ao fazer login'
    
    // Mensagens mais amigáveis
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('fetch')) {
      errorMessage = 'Servidor não disponível. Verifique se o JSON Server está rodando (npm run api) ou use o modo offline com: admin@agenda.com / admin123'
    }
    
    error.value = errorMessage
    window.$toast?.error('Erro', errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

