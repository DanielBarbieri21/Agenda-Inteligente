import { format, parseISO } from 'date-fns'

// Gerar arquivo .ics (iCalendar) para importação em calendários
export const exportToICS = (appointments, clients) => {
  let icsContent = 'BEGIN:VCALENDAR\n'
  icsContent += 'VERSION:2.0\n'
  icsContent += 'PRODID:-//Agenda Inteligente//EN\n'
  icsContent += 'CALSCALE:GREGORIAN\n'
  icsContent += 'METHOD:PUBLISH\n'

  appointments.forEach(appointment => {
    const client = clients.find(c => c.id === appointment.clientId)
    const clientName = client ? client.name : 'Cliente'
    const startDate = parseISO(`${appointment.date}T${appointment.time}`)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // +1 hora

    icsContent += 'BEGIN:VEVENT\n'
    icsContent += `UID:${appointment.id}@agenda-inteligente\n`
    icsContent += `DTSTART:${format(startDate, "yyyyMMdd'T'HHmmss")}\n`
    icsContent += `DTEND:${format(endDate, "yyyyMMdd'T'HHmmss")}\n`
    icsContent += `SUMMARY:${appointment.title} - ${clientName}\n`
    icsContent += `DESCRIPTION:${appointment.notes || 'Agendamento'}\n`
    icsContent += `LOCATION:\n`
    icsContent += `STATUS:CONFIRMED\n`
    icsContent += 'END:VEVENT\n'
  })

  icsContent += 'END:VCALENDAR\n'

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `agendamentos_${format(new Date(), 'yyyy-MM-dd')}.ics`
  link.click()
}

// Gerar link do Google Calendar
export const exportToGoogleCalendar = (appointment, client) => {
  const clientName = client ? client.name : 'Cliente'
  const startDate = parseISO(`${appointment.date}T${appointment.time}`)
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)

  const formatGoogleDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${appointment.title} - ${clientName}`,
    dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    details: appointment.notes || 'Agendamento',
    location: ''
  })

  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank')
}

// Exportar todos os agendamentos para Google Calendar (um por vez)
export const exportAllToGoogleCalendar = (appointments, clients) => {
  appointments.forEach((appointment, index) => {
    setTimeout(() => {
      const client = clients.find(c => c.id === appointment.clientId)
      exportToGoogleCalendar(appointment, client)
    }, index * 500) // Delay de 500ms entre cada abertura
  })
}

