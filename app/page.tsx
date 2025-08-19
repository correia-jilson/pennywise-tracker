'use client'

import { useState, useEffect } from 'react'
import { Plus, TrendingDown, TrendingUp, DollarSign, Calendar, RefreshCw } from 'lucide-react'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import ExpenseChart from '../components/ExpenseChart'
import CategoryManager from '../components/CategoryManager'
import { Expense, Category } from '../types'

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = 'demo-user' // In a real app, this would come from authentication

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch categories and expenses in parallel
      const [categoriesResponse, expensesResponse] = await Promise.all([
        fetch(`/api/categories?userId=${userId}`),
        fetch(`/api/expenses?userId=${userId}`)
      ])

      if (!categoriesResponse.ok || !expensesResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const [categoriesData, expensesData] = await Promise.all([
        categoriesResponse.json(),
        expensesResponse.json()
      ])

      setCategories(categoriesData)
      setExpenses(expensesData)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load data. Please refresh the page.')
      
      // Fallback to demo data if API fails
      setCategories([
        { id: '1', name: 'Food', color: '#EF4444', icon: 'Utensils', userId: 'demo-user', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Transport', color: '#3B82F6', icon: 'Car', userId: 'demo-user', createdAt: new Date(), updatedAt: new Date() },
        { id: '3', name: 'Entertainment', color: '#8B5CF6', icon: 'Music', userId: 'demo-user', createdAt: new Date(), updatedAt: new Date() },
        { id: '4', name: 'Shopping', color: '#10B981', icon: 'ShoppingBag', userId: 'demo-user', createdAt: new Date(), updatedAt: new Date() },
      ])
      
      setExpenses([
        {
          id: '1',
          amount: 25.50,
          description: 'Lunch at cafe',
          date: new Date().toISOString(),
          categoryId: '1',
          userId: 'demo-user',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: '1', name: 'Food', color: '#EF4444' }
        },
        {
          id: '2',
          amount: 15.00,
          description: 'Bus ticket',
          date: new Date(Date.now() - 86400000).toISOString(),
          categoryId: '2',
          userId: 'demo-user',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: '2', name: 'Transport', color: '#3B82F6' }
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    const now = new Date()
    return expenseDate.getMonth() === now.getMonth() && 
           expenseDate.getFullYear() === now.getFullYear()
  }).reduce((sum, expense) => sum + expense.amount, 0)

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...expenseData,
          userId
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add expense')
      }

      const newExpense = await response.json()
      setExpenses(prev => [newExpense, ...prev])
    } catch (error) {
      console.error('Error adding expense:', error)
      setError('Failed to add expense. Please try again.')
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete expense')
      }

      setExpenses(prev => prev.filter(expense => expense.id !== id))
    } catch (error) {
      console.error('Error deleting expense:', error)
      setError('Failed to delete expense. Please try again.')
    }
  }

  const addCategory = async (categoryData: Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...categoryData,
          userId
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add category')
      }

      const newCategory = await response.json()
      setCategories(prev => [...prev, newCategory])
    } catch (error) {
      console.error('Error adding category:', error)
      setError(error instanceof Error ? error.message : 'Failed to add category. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PennyWise Tracker...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PennyWise Tracker</h1>
              <p className="text-gray-600 mt-1">Manage your expenses wisely</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchData}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Refresh data"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowCategoryManager(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Categories
              </button>
              <button
                onClick={() => setShowExpenseForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 text-sm underline ml-2"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-3xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900">${thisMonthExpenses.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Trends</h3>
            <ExpenseChart expenses={expenses} />
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
            <ExpenseList 
              expenses={expenses.slice(0, 5)} 
              onDelete={deleteExpense}
            />
          </div>
        </div>

        {/* All Expenses */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">All Expenses</h3>
          </div>
          <div className="p-6">
            <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          </div>
        </div>
      </main>

      {/* Modals */}
      {showExpenseForm && (
        <ExpenseForm
          categories={categories}
          onSubmit={addExpense}
          onClose={() => setShowExpenseForm(false)}
        />
      )}

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onAddCategory={addCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}
    </div>
  )
}