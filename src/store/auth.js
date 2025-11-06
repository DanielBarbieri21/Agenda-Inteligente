import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = 'http://localhost:3001'

// Simulação de JWT (em produção, isso viria de um servidor real)
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
  }
  return btoa(JSON.stringify(payload))
}

const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token))
    if (payload.exp < Date.now()) {
      return null // Token expirado
    }
    return payload
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token'))
  const isAuthenticated = computed(() => {
    if (!token.value) return false
    const decoded = decodeToken(token.value)
    if (!decoded) {
      token.value = null
      localStorage.removeItem('auth_token')
      return false
    }
    return true
  })

  const login = async (email, password) => {
    try {
      // Tentar buscar do JSON Server primeiro
      try {
        const response = await fetch(`${API_URL}/users?email=${email}`)
        if (!response.ok) throw new Error('Erro ao conectar com o servidor')
        
        const users = await response.json()
        
        if (users.length === 0) {
          throw new Error('Usuário não encontrado')
        }

        const foundUser = users[0]
        
        if (foundUser.password !== password) {
          throw new Error('Senha incorreta')
        }

        const newToken = generateToken(foundUser)
        token.value = newToken
        user.value = { ...foundUser, password: undefined }
        localStorage.setItem('auth_token', newToken)
        
        return { success: true, user: user.value }
      } catch (fetchError) {
        // Fallback: usar dados locais se o servidor não estiver disponível
        console.warn('Servidor não disponível, usando modo offline:', fetchError)
        
        // Verificar se há usuários salvos localmente
        const localUsers = JSON.parse(localStorage.getItem('local_users') || '[]')
        const foundUser = localUsers.find(u => u.email === email)
        
        if (!foundUser) {
          // Usar usuário padrão se não houver usuários locais
          if (email === 'admin@agenda.com' && password === 'admin123') {
            const defaultUser = {
              id: 1,
              name: 'Admin',
              email: 'admin@agenda.com',
              createdAt: new Date().toISOString()
            }
            const newToken = generateToken(defaultUser)
            token.value = newToken
            user.value = defaultUser
            localStorage.setItem('auth_token', newToken)
            return { success: true, user: user.value }
          }
          throw new Error('Usuário não encontrado. Certifique-se de que o JSON Server está rodando (npm run api)')
        }
        
        if (foundUser.password !== password) {
          throw new Error('Senha incorreta')
        }

        const newToken = generateToken(foundUser)
        token.value = newToken
        user.value = { ...foundUser, password: undefined }
        localStorage.setItem('auth_token', newToken)
        
        return { success: true, user: user.value }
      }
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      // Tentar criar no JSON Server primeiro
      try {
        const response = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...userData,
            createdAt: new Date().toISOString()
          })
        })
        
        if (!response.ok) throw new Error('Erro ao criar usuário')
        
        const newUser = await response.json()
        const newToken = generateToken(newUser)
        token.value = newToken
        user.value = { ...newUser, password: undefined }
        localStorage.setItem('auth_token', newToken)
        
        return { success: true, user: user.value }
      } catch (fetchError) {
        // Fallback: salvar localmente
        console.warn('Servidor não disponível, salvando localmente:', fetchError)
        
        const localUsers = JSON.parse(localStorage.getItem('local_users') || '[]')
        const newId = localUsers.length > 0 ? Math.max(...localUsers.map(u => u.id)) + 1 : 1
        
        const newUser = {
          id: newId,
          ...userData,
          createdAt: new Date().toISOString()
        }
        
        localUsers.push(newUser)
        localStorage.setItem('local_users', JSON.stringify(localUsers))
        
        const newToken = generateToken(newUser)
        token.value = newToken
        user.value = { ...newUser, password: undefined }
        localStorage.setItem('auth_token', newToken)
        
        return { success: true, user: user.value }
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  const checkAuth = () => {
    if (token.value) {
      const decoded = decodeToken(token.value)
      if (decoded) {
        // Tentar buscar do servidor, senão usar dados locais
        fetch(`${API_URL}/users/${decoded.userId}`)
          .then(res => {
            if (res.ok) return res.json()
            throw new Error('Servidor não disponível')
          })
          .then(userData => {
            user.value = { ...userData, password: undefined }
          })
          .catch(() => {
            // Fallback: buscar dos usuários locais
            const localUsers = JSON.parse(localStorage.getItem('local_users') || '[]')
            const localUser = localUsers.find(u => u.id === decoded.userId)
            if (localUser) {
              user.value = { ...localUser, password: undefined }
            } else if (decoded.userId === 1 && decoded.email === 'admin@agenda.com') {
              // Usuário padrão
              user.value = {
                id: 1,
                name: 'Admin',
                email: 'admin@agenda.com',
                createdAt: '2024-01-01'
              }
            } else {
              logout()
            }
          })
      } else {
        logout()
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  }
})

