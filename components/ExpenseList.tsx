'use client'

import { Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface Expense {
  id: string
  amount: number
  description: string
  date: string
  category: {
    id: string
    name: string
    color: string
  }
}

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
}

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>
        <p className="text-gray-500">No expenses recorded yet</p>
        <p className="text-sm text-gray-400">Add your first expense to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: expense.category.color }}
            />
            <div>
              <h4 className="font-medium text-gray-900">{expense.description}</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{expense.category.name}</span>
                <span>•</span>
                <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold text-gray-900">
              ${expense.amount.toFixed(2)}
            </span>
            <button
              onClick={() => onDelete(expense.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete expense"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}