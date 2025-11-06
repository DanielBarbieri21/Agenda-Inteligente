<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-4">
      <button
        @click="previousMonth"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Mês anterior"
      >
        ←
      </button>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        {{ currentMonthYear }}
      </h3>
      <button
        @click="nextMonth"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Próximo mês"
      >
        →
      </button>
    </div>
    <div class="grid grid-cols-7 gap-2 mb-4">
      <div
        v-for="day in daysOfWeek"
        :key="day"
        class="text-center font-semibold text-gray-600 dark:text-gray-400 text-sm"
      >
        {{ day }}
      </div>
    </div>
    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="aspect-square p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
        :class="{
          'bg-gray-100 dark:bg-gray-700': !day.isCurrentMonth,
          'bg-blue-100 dark:bg-blue-900': day.isToday,
          'bg-green-100 dark:bg-green-900': hasAppointment(day.date)
        }"
        @click="selectDate(day.date)"
      >
        <div class="text-sm font-medium" :class="{
          'text-gray-400': !day.isCurrentMonth,
          'text-blue-600 dark:text-blue-400 font-bold': day.isToday,
          'text-gray-900 dark:text-white': day.isCurrentMonth && !day.isToday
        }">
          {{ day.day }}
        </div>
        <div v-if="hasAppointment(day.date)" class="text-xs mt-1 text-green-600 dark:text-green-400">
          {{ getAppointmentsCount(day.date) }}
        </div>
      </div>
    </div>
    <div v-if="selectedDate" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">
        Agendamentos em {{ formatDate(selectedDate) }}
      </h4>
      <div v-if="getAppointmentsForDate(selectedDate).length === 0" class="text-gray-500 dark:text-gray-400">
        Nenhum agendamento neste dia
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="appointment in getAppointmentsForDate(selectedDate)"
          :key="appointment.id"
          class="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded"
        >
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{{ appointment.title }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ appointment.time }}</p>
          </div>
          <button
            @click="$emit('delete-appointment', appointment.id)"
            class="text-red-500 hover:text-red-700 dark:hover:text-red-400"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  appointments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['delete-appointment', 'date-selected'])

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const selectedDate = ref(null)
const currentDate = ref(new Date())

const currentMonthYear = computed(() => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  return `${months[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dateStr = formatDateString(date)
    
    days.push({
      day: date.getDate(),
      date: dateStr,
      isCurrentMonth: date.getMonth() === month,
      isToday: dateStr === formatDateString(today)
    })
  }
  
  return days
})

const formatDateString = (date) => {
  return date.toISOString().split('T')[0]
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const hasAppointment = (date) => {
  return props.appointments.some(apt => apt.date === date)
}

const getAppointmentsCount = (date) => {
  return props.appointments.filter(apt => apt.date === date).length
}

const getAppointmentsForDate = (date) => {
  return props.appointments.filter(apt => apt.date === date)
}

const selectDate = (date) => {
  selectedDate.value = date
  emit('date-selected', date)
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

defineExpose({
  previousMonth,
  nextMonth
})
</script>

