<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Agendamentos
      </h1>
      <div class="flex gap-2">
        <button
          @click="exportCalendar"
          class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          📅 Exportar Calendário
        </button>
        <button
          @click="showModal = true; editingAppointment = null"
          class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          + Novo Agendamento
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Calendário -->
      <div class="lg:col-span-2">
        <Calendar
          :appointments="appointments"
          @delete-appointment="handleDeleteAppointment"
          @date-selected="handleDateSelected"
        />
      </div>

      <!-- Lista de Agendamentos -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Todos os Agendamentos
        </h2>
        <div v-if="loading" class="text-center py-8 text-gray-500 dark:text-gray-400">
          Carregando...
        </div>
        <div v-else-if="appointments.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          Nenhum agendamento
        </div>
        <div v-else class="space-y-3 max-h-96 overflow-y-auto">
          <div
            v-for="appointment in sortedAppointments"
            :key="appointment.id"
            class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <p class="font-semibold text-gray-900 dark:text-white">
              {{ appointment.title }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatDate(appointment.date) }} às {{ appointment.time }}
            </p>
            <p v-if="getClientName(appointment.clientId)" class="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {{ getClientName(appointment.clientId) }}
            </p>
            <p v-if="appointment.notes" class="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {{ appointment.notes }}
            </p>
            <button
              @click="handleDeleteAppointment(appointment.id)"
              class="mt-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Adicionar/Editar Agendamento -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showModal = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento' }}
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Título
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Consulta, Acompanhamento"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cliente
              </label>
              <select
                v-model="form.clientId"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um cliente</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data
              </label>
              <input
                v-model="form.date"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hora
              </label>
              <input
                v-model="form.time"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observações
              </label>
              <textarea
                v-model="form.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observações sobre o agendamento"
              ></textarea>
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
              {{ editingAppointment ? 'Atualizar' : 'Salvar' }}
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
import Calendar from '../components/Calendar.vue'
import { exportToICS, exportToGoogleCalendar } from '../utils/calendarExport'
import { useAppointmentNotifications } from '../composables/useAppointmentNotifications'

const store = useClientsStore()
const showModal = ref(false)
const editingAppointment = ref(null)

const form = ref({
  title: '',
  clientId: '',
  date: '',
  time: '',
  notes: ''
})

const appointments = computed(() => store.appointments)
const clients = computed(() => store.clients)
const loading = computed(() => store.loading)

const sortedAppointments = computed(() => {
  return [...store.appointments].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.time.localeCompare(b.time)
  })
})

const getClientName = (clientId) => {
  const client = store.getClientById(clientId)
  return client ? client.name : 'Cliente não encontrado'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const handleDateSelected = (date) => {
  form.value.date = date
  showModal.value = true
}

const handleDeleteAppointment = async (id) => {
  if (confirm('Tem certeza que deseja excluir este agendamento?')) {
    try {
      await store.deleteAppointment(id)
      window.$toast?.success('Agendamento excluído', 'Agendamento removido com sucesso')
    } catch (err) {
      window.$toast?.error('Erro', 'Erro ao excluir agendamento: ' + err.message)
    }
  }
}

const handleSubmit = async () => {
  try {
    if (editingAppointment.value) {
      // Implementar update se necessário
      window.$toast?.warning('Em desenvolvimento', 'Funcionalidade de edição em desenvolvimento')
    } else {
      await store.addAppointment(form.value)
      window.$toast?.success('Agendamento criado', 'Novo agendamento adicionado com sucesso')
    }
    showModal.value = false
    editingAppointment.value = null
    form.value = { title: '', clientId: '', date: '', time: '', notes: '' }
  } catch (err) {
    window.$toast?.error('Erro', 'Erro ao salvar agendamento: ' + err.message)
  }
}

const exportCalendar = () => {
  const format = prompt('Escolha o formato:\n1 - Arquivo .ics (iCalendar)\n2 - Google Calendar', '1')
  
  if (format === '1') {
    exportToICS(appointments.value, clients.value)
    window.$toast?.success('Exportado!', 'Arquivo .ics gerado. Importe no seu calendário.')
  } else if (format === '2') {
    if (appointments.value.length === 0) {
      window.$toast?.warning('Sem agendamentos', 'Não há agendamentos para exportar')
      return
    }
    // Exportar primeiro agendamento como exemplo
    const firstAppointment = appointments.value[0]
    const client = store.getClientById(firstAppointment.clientId)
    exportToGoogleCalendar(firstAppointment, client)
    window.$toast?.info('Google Calendar', 'Abra o link para adicionar ao Google Calendar')
  }
}

// Iniciar notificações de agendamentos
useAppointmentNotifications()

onMounted(async () => {
  await store.fetchClients()
  await store.fetchAppointments()
})
</script>

