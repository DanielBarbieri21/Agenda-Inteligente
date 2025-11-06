import { ref, onMounted, onUnmounted } from 'vue'
import { useClientsStore } from '../store/clients'
import { format, differenceInMinutes, parseISO } from 'date-fns'

export function useAppointmentNotifications() {
  const store = useClientsStore()
  const checkInterval = ref(null)
  const notifiedAppointments = ref(new Set())

  const checkUpcomingAppointments = () => {
    const now = new Date()
    const appointments = store.appointments || []

    appointments.forEach(appointment => {
      if (notifiedAppointments.value.has(appointment.id)) return

      const appointmentDateTime = parseISO(`${appointment.date}T${appointment.time}`)
      const minutesUntil = differenceInMinutes(appointmentDateTime, now)

      // Notificar 30 minutos antes
      if (minutesUntil > 0 && minutesUntil <= 30 && minutesUntil >= 29) {
        const client = store.getClientById(appointment.clientId)
        const clientName = client ? client.name : 'Cliente'
        
        window.$toast?.warning(
          'Agendamento Próximo',
          `${appointment.title} com ${clientName} em ${format(appointmentDateTime, 'HH:mm')}`
        )
        
        // Notificação do navegador (se permitido)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Agendamento Próximo', {
            body: `${appointment.title} com ${clientName} em ${format(appointmentDateTime, 'HH:mm')}`,
            icon: '/favicon.ico'
          })
        }
        
        notifiedAppointments.value.add(appointment.id)
      }

      // Notificar 5 minutos antes
      if (minutesUntil > 0 && minutesUntil <= 5 && minutesUntil >= 4) {
        const client = store.getClientById(appointment.clientId)
        const clientName = client ? client.name : 'Cliente'
        
        window.$toast?.error(
          'Agendamento em Breve!',
          `${appointment.title} com ${clientName} em ${format(appointmentDateTime, 'HH:mm')}`
        )
        
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Agendamento em Breve!', {
            body: `${appointment.title} com ${clientName} em ${format(appointmentDateTime, 'HH:mm')}`,
            icon: '/favicon.ico'
          })
        }
      }
    })
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  const startChecking = () => {
    // Verificar a cada minuto
    checkInterval.value = setInterval(checkUpcomingAppointments, 60000)
    // Verificar imediatamente
    checkUpcomingAppointments()
  }

  const stopChecking = () => {
    if (checkInterval.value) {
      clearInterval(checkInterval.value)
      checkInterval.value = null
    }
  }

  onMounted(async () => {
    await store.fetchAppointments()
    await requestNotificationPermission()
    startChecking()
  })

  onUnmounted(() => {
    stopChecking()
  })

  return {
    checkUpcomingAppointments,
    startChecking,
    stopChecking
  }
}

