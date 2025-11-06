import { ref, computed } from 'vue'

export function useSearch(items, searchFields) {
  const searchQuery = ref('')
  const filters = ref({})

  const filteredItems = computed(() => {
    let result = [...items.value]

    // Aplicar busca
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(item => {
        return searchFields.some(field => {
          const value = item[field]
          return value && value.toString().toLowerCase().includes(query)
        })
      })
    }

    // Aplicar filtros
    Object.keys(filters.value).forEach(key => {
      const filterValue = filters.value[key]
      if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
        result = result.filter(item => {
          if (typeof filterValue === 'function') {
            return filterValue(item[key])
          }
          return item[key] === filterValue || 
                 (typeof item[key] === 'string' && item[key].toLowerCase().includes(filterValue.toLowerCase()))
        })
      }
    })

    return result
  })

  const clearSearch = () => {
    searchQuery.value = ''
    filters.value = {}
  }

  return {
    searchQuery,
    filters,
    filteredItems,
    clearSearch
  }
}

