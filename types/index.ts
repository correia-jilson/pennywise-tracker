export interface User {
  id: string
  email: string
  name: string | null
  expenses: Expense[]
  categories: Category[]
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
  userId: string
  expenses?: Expense[]
  createdAt: Date
  updatedAt: Date
}

export interface Expense {
  id: string
  amount: number
  description: string
  date: string
  categoryId: string
  userId: string
  category: {
    id: string
    name: string
    color: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseFormData {
  amount: number
  description: string
  date: string
  categoryId: string
}

export interface CategoryFormData {
  name: string
  color: string
  icon: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface ChartDataPoint {
  date: string
  amount: number
}

export interface CategoryExpense {
  name: string
  value: number
  color: string
}