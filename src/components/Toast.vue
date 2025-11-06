<template>
  <TransitionGroup
    name="toast"
    tag="div"
    class="fixed top-4 right-4 z-50 space-y-2"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'min-w-[300px] p-4 rounded-lg shadow-lg flex items-start gap-3',
        toast.type === 'success' ? 'bg-green-500 text-white' : '',
        toast.type === 'error' ? 'bg-red-500 text-white' : '',
        toast.type === 'warning' ? 'bg-yellow-500 text-white' : '',
        toast.type === 'info' ? 'bg-blue-500 text-white' : ''
      ]"
    >
      <span class="text-xl">
        {{ toast.type === 'success' ? '✅' : '' }}
        {{ toast.type === 'error' ? '❌' : '' }}
        {{ toast.type === 'warning' ? '⚠️' : '' }}
        {{ toast.type === 'info' ? 'ℹ️' : '' }}
      </span>
      <div class="flex-1">
        <p class="font-semibold">{{ toast.title }}</p>
        <p v-if="toast.message" class="text-sm opacity-90">{{ toast.message }}</p>
      </div>
      <button
        @click="removeToast(toast.id)"
        class="text-white hover:opacity-70 transition-opacity"
      >
        ✕
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const toasts = ref([])
let toastId = 0

const showToast = (type, title, message = '', duration = 3000) => {
  const id = ++toastId
  toasts.value.push({ id, type, title, message })
  
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
  
  return id
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Expor métodos globalmente
onMounted(() => {
  window.$toast = {
    success: (title, message, duration) => showToast('success', title, message, duration),
    error: (title, message, duration) => showToast('error', title, message, duration),
    warning: (title, message, duration) => showToast('warning', title, message, duration),
    info: (title, message, duration) => showToast('info', title, message, duration)
  }
})

defineExpose({ showToast, removeToast })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>

