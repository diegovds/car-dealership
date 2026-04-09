export function formatBRL(rawValue: string): string {
  if (!rawValue) return ''
  const num = parseFloat(rawValue)
  if (isNaN(num)) return ''
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export function parseBRL(formatted: string): string {
  const digits = formatted.replace(/\D/g, '')
  if (!digits) return ''
  return (parseInt(digits, 10) / 100).toFixed(2)
}
