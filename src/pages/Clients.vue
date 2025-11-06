<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Clientes
      </h1>
      <div class="flex gap-2">
        <button
          @click="exportData"
          class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          📊 Exportar
        </button>
        <button
          @click="showModal = true; editingClient = null"
          class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          + Novo Cliente
        </button>
      </div>
    </div>

    <!-- Busca e Filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            🔍 Buscar
          </label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Nome, email ou telefone..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            📅 Ordenar por
          </label>
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Nome</option>
            <option value="createdAt">Data de criação</option>
            <option value="email">E-mail</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-gray-500 dark:text-gray-400">
      Carregando clientes...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Grid de Clientes -->
    <div v-else>
      <div v-if="filteredClients.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
        Nenhum cliente encontrado
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ClientCard
          v-for="client in filteredClients"
          :key="client.id"
          :client="client"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
      <div v-if="filteredClients.length > 0" class="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Mostrando {{ filteredClients.length }} de {{ clients.length }} clientes
      </div>
    </div>

    <!-- Modal de Adicionar/Editar Cliente -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showModal = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ editingClient ? 'Editar Cliente' : 'Novo Cliente' }}
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefone
              </label>
              <input
                v-model="form.phone"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(00) 00000-0000"
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
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              {{ editingClient ? 'Atualizar' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useClientsStore } from '../store/clients'
import ClientCard from '../components/ClientCard.vue'
import { exportToPDF, exportToCSV, exportToExcel } from '../utils/export'
import { format } from 'date-fns'

const store = useClientsStore()
const showModal = ref(false)
const editingClient = ref(null)
const searchQuery = ref('')
const sortBy = ref('name')

const form = ref({
  name: '',
  phone: '',
  email: ''
})

const clients = computed(() => store.clients)
const loading = computed(() => store.loading)
const error = computed(() => store.error)

const filteredClients = computed(() => {
  let result = [...clients.value]

  // Aplicar busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(client => 
      client.name?.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.phone?.toLowerCase().includes(query)
    )
  }

  // Aplicar ordenação
  result.sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy.value === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (sortBy.value === 'email') {
      return a.email.localeCompare(b.email)
    }
    return 0
  })

  return result
})

const clearFilters = () => {
  searchQuery.value = ''
  sortBy.value = 'name'
}

const exportData = () => {
  const data = filteredClients.value
  const columns = [
    { field: 'name', label: 'Nome' },
    { field: 'email', label: 'E-mail' },
    { field: 'phone', label: 'Telefone' },
    { 
      field: 'createdAt', 
      label: 'Data de Criação',
      formatter: (val) => format(new Date(val), 'dd/MM/yyyy')
    }
  ]
  
  // Criar menu de exportação
  const format = prompt('Escolha o formato:\n1 - PDF\n2 - CSV\n3 - Excel', '1')
  
  if (format === '1') {
    exportToPDF(data, 'Relatório de Clientes', columns)
    window.$toast?.success('Exportado!', 'Relatório PDF gerado com sucesso')
  } else if (format === '2') {
    exportToCSV(data, 'clientes', columns)
    window.$toast?.success('Exportado!', 'Arquivo CSV gerado com sucesso')
  } else if (format === '3') {
    exportToExcel(data, 'clientes', columns)
    window.$toast?.success('Exportado!', 'Planilha Excel gerada com sucesso')
  }
}

const handleEdit = (client) => {
  editingClient.value = client
  form.value = {
    name: client.name,
    phone: client.phone,
    email: client.email
  }
  showModal.value = true
}

const handleDelete = async (id) => {
  if (confirm('Tem certeza que deseja excluir este cliente?')) {
    try {
      await store.deleteClient(id)
      window.$toast?.success('Cliente excluído', 'Cliente removido com sucesso')
    } catch (err) {
      window.$toast?.error('Erro', 'Erro ao excluir cliente: ' + err.message)
    }
  }
}

const handleSubmit = async () => {
  try {
    if (editingClient.value) {
      await store.updateClient(editingClient.value.id, form.value)
      window.$toast?.success('Cliente atualizado', 'Dados do cliente atualizados com sucesso')
    } else {
      await store.addClient(form.value)
      window.$toast?.success('Cliente adicionado', 'Novo cliente cadastrado com sucesso')
    }
    showModal.value = false
    editingClient.value = null
    form.value = { name: '', phone: '', email: '' }
  } catch (err) {
    window.$toast?.error('Erro', 'Erro ao salvar cliente: ' + err.message)
  }
}

onMounted(async () => {
  await store.fetchClients()
})
</script>

