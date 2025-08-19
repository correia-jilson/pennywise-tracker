export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function getRelativeDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMilliseconds = now.getTime() - dateObj.getTime()
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  
  return `${Math.floor(diffInDays / 365)} years ago`
}

export function groupExpensesByDate(expenses: any[]) {
  const grouped = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(expense)
    return acc
  }, {})

  return Object.entries(grouped).map(([date, expenses]) => ({
    date,
    expenses: expenses as any[],
    total: (expenses as any[]).reduce((sum, exp) => sum + exp.amount, 0)
  }))
}

export function groupExpensesByCategory(expenses: any[]) {
  const grouped = expenses.reduce((acc, expense) => {
    const categoryName = expense.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = {
        name: categoryName,
        color: expense.category.color,
        expenses: [],
        total: 0
      }
    }
    acc[categoryName].expenses.push(expense)
    acc[categoryName].total += expense.amount
    return acc
  }, {})

  return Object.values(grouped)
}

export function calculateMonthlyTotal(expenses: any[], month?: number, year?: number) {
  const now = new Date()
  const targetMonth = month ?? now.getMonth()
  const targetYear = year ?? now.getFullYear()

  return expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === targetMonth && 
             expenseDate.getFullYear() === targetYear
    })
    .reduce((sum, expense) => sum + expense.amount, 0)
}

export function getRandomColor(): string {
  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308',
    '#84CC16', '#10B981', '#06B6D4', '#3B82F6',
    '#6366F1', '#8B5CF6', '#A855F7', '#EC4899'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}