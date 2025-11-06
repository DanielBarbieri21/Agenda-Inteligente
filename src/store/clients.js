import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = 'http://localhost:3001'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref([])
  const appointments = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const totalClients = computed(() => clients.value.length)
  const totalAppointments = computed(() => appointments.value.length)

  // Actions - Clients
  const fetchClients = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/clients`)
      if (!response.ok) throw new Error('Erro ao buscar clientes')
      clients.value = await response.json()
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar clientes:', err)
    } finally {
      loading.value = false
    }
  }

  const addClient = async (clientData) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...clientData,
          createdAt: new Date().toISOString().split('T')[0]
        })
      })
      if (!response.ok) throw new Error('Erro ao adicionar cliente')
      const newClient = await response.json()
      clients.value.push(newClient)
      return newClient
    } catch (err) {
      error.value = err.message
      console.error('Erro ao adicionar cliente:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateClient = async (id, clientData) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      })
      if (!response.ok) throw new Error('Erro ao atualizar cliente')
      const updatedClient = await response.json()
      const index = clients.value.findIndex(c => c.id === id)
      if (index !== -1) {
        clients.value[index] = updatedClient
      }
      return updatedClient
    } catch (err) {
      error.value = err.message
      console.error('Erro ao atualizar cliente:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteClient = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/clients/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Erro ao deletar cliente')
      clients.value = clients.value.filter(c => c.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('Erro ao deletar cliente:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Appointments
  const fetchAppointments = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/appointments`)
      if (!response.ok) throw new Error('Erro ao buscar agendamentos')
      appointments.value = await response.json()
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar agendamentos:', err)
    } finally {
      loading.value = false
    }
  }

  const addAppointment = async (appointmentData) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      })
      if (!response.ok) throw new Error('Erro ao adicionar agendamento')
      const newAppointment = await response.json()
      appointments.value.push(newAppointment)
      return newAppointment
    } catch (err) {
      error.value = err.message
      console.error('Erro ao adicionar agendamento:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteAppointment = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Erro ao deletar agendamento')
      appointments.value = appointments.value.filter(a => a.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('Erro ao deletar agendamento:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get client by ID
  const getClientById = (id) => {
    return clients.value.find(c => c.id === id)
  }

  return {
    clients,
    appointments,
    loading,
    error,
    totalClients,
    totalAppointments,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    fetchAppointments,
    addAppointment,
    deleteAppointment,
    getClientById
  }
})

