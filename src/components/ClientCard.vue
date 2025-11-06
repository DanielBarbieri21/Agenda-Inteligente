<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ client.name }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Criado em {{ formatDate(client.createdAt) }}
        </p>
      </div>
      <button
        @click="$emit('delete', client.id)"
        class="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
        title="Excluir cliente"
      >
        🗑️
      </button>
    </div>
    <div class="space-y-2">
      <div class="flex items-center text-gray-600 dark:text-gray-300">
        <span class="mr-2">📞</span>
        <span>{{ client.phone }}</span>
      </div>
      <div class="flex items-center text-gray-600 dark:text-gray-300">
        <span class="mr-2">✉️</span>
        <span>{{ client.email }}</span>
      </div>
    </div>
    <button
      @click="$emit('edit', client)"
      class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      Editar
    </button>
  </div>
</template>

<script setup>
defineProps({
  client: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}
</script>

