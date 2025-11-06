<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
      Dashboard
    </h1>

    <!-- Cards de Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">Total de Clientes</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ totalClients }}
            </p>
          </div>
          <div class="text-4xl">👥</div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">Agendamentos</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ totalAppointments }}
            </p>
          </div>
          <div class="text-4xl">📅</div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">Hoje</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ todayAppointments }}
            </p>
          </div>
          <div class="text-4xl">✨</div>
        </div>
      </div>
    </div>

    <!-- Gráfico -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Agendamentos por Dia da Semana
      </h2>
      <div class="h-64">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>

    <!-- Próximos Agendamentos -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Próximos Agendamentos
      </h2>
      <div v-if="loading" class="text-center py-8 text-gray-500 dark:text-gray-400">
        Carregando...
      </div>
      <div v-else-if="upcomingAppointments.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        Nenhum agendamento próximo
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="appointment in upcomingAppointments"
          :key="appointment.id"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div>
            <p class="font-semibold text-gray-900 dark:text-white">
              {{ appointment.title }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(appointment.date) }} às {{ appointment.time }}
            </p>
            <p v-if="getClientName(appointment.clientId)" class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Cliente: {{ getClientName(appointment.clientId) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import { useClientsStore } from '../store/clients'
import { useAppointmentNotifications } from '../composables/useAppointmentNotifications'

const store = useClientsStore()
const chartCanvas = ref(null)
let chartInstance = null

const totalClients = computed(() => store.totalClients)
const totalAppointments = computed(() => store.totalAppointments)

const todayAppointments = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return store.appointments.filter(apt => apt.date === today).length
})

const upcomingAppointments = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return store.appointments
    .filter(apt => apt.date >= today)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.time.localeCompare(b.time)
    })
    .slice(0, 5)
})

const loading = computed(() => store.loading)

const getClientName = (clientId) => {
  const client = store.getClientById(clientId)
  return client ? client.name : 'Cliente não encontrado'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const createChart = () => {
  if (!chartCanvas.value) return

  try {
    const appointmentsByDay = {
      'Segunda': 0,
      'Terça': 0,
      'Quarta': 0,
      'Quinta': 0,
      'Sexta': 0,
      'Sábado': 0,
      'Domingo': 0
    }

    store.appointments.forEach(apt => {
      const date = new Date(apt.date)
      const dayOfWeek = date.getDay()
      const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
      const dayName = days[dayOfWeek]
      if (appointmentsByDay[dayName] !== undefined) {
        appointmentsByDay[dayName]++
      }
    })

    if (chartInstance) {
      chartInstance.destroy()
    }

    chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
      datasets: [
        {
          label: 'Agendamentos',
          data: [
            appointmentsByDay['Segunda'],
            appointmentsByDay['Terça'],
            appointmentsByDay['Quarta'],
            appointmentsByDay['Quinta'],
            appointmentsByDay['Sexta'],
            appointmentsByDay['Sábado'],
            appointmentsByDay['Domingo']
          ],
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
    })
  } catch (error) {
    console.error('Erro ao criar gráfico:', error)
  }
}

// Iniciar notificações de agendamentos
useAppointmentNotifications()

onMounted(async () => {
  await store.fetchClients()
  await store.fetchAppointments()
  createChart()
})

watch(() => store.appointments, () => {
  createChart()
}, { deep: true })
</script>

