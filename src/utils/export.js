import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'

export const exportToPDF = (data, title, columns) => {
  const doc = new jsPDF()
  
  doc.setFontSize(18)
  doc.text(title, 14, 22)
  
  doc.setFontSize(12)
  doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30)
  
  let y = 40
  const pageHeight = doc.internal.pageSize.height
  
  data.forEach((item, index) => {
    if (y > pageHeight - 20) {
      doc.addPage()
      y = 20
    }
    
    columns.forEach((col, colIndex) => {
      const label = col.label || col.field
      const value = col.formatter ? col.formatter(item[col.field]) : item[col.field]
      doc.text(`${label}: ${value}`, 14, y)
      y += 7
    })
    y += 5
  })
  
  doc.save(`${title.replace(/\s/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}

export const exportToCSV = (data, filename, columns) => {
  const headers = columns.map(col => col.label || col.field)
  const rows = data.map(item => 
    columns.map(col => {
      const value = col.formatter ? col.formatter(item[col.field]) : item[col.field]
      return value || ''
    })
  )
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`
  link.click()
}

export const exportToExcel = (data, filename, columns) => {
  const headers = columns.map(col => col.label || col.field)
  const rows = data.map(item => 
    columns.map(col => {
      const value = col.formatter ? col.formatter(item[col.field]) : item[col.field]
      return value || ''
    })
  )
  
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados')
  
  XLSX.writeFile(workbook, `${filename}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
}

