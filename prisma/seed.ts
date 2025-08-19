import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@pennywise.com' },
    update: {},
    create: {
      id: 'demo-user',
      email: 'demo@pennywise.com',
      name: 'Demo User',
    },
  })

  console.log('👤 Created user:', user.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 'food-category' },
      update: {},
      create: {
        id: 'food-category',
        name: 'Food & Dining',
        color: '#EF4444',
        icon: 'Utensils',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { id: 'transport-category' },
      update: {},
      create: {
        id: 'transport-category',
        name: 'Transportation',
        color: '#3B82F6',
        icon: 'Car',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { id: 'entertainment-category' },
      update: {},
      create: {
        id: 'entertainment-category',
        name: 'Entertainment',
        color: '#8B5CF6',
        icon: 'Music',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { id: 'shopping-category' },
      update: {},
      create: {
        id: 'shopping-category',
        name: 'Shopping',
        color: '#10B981',
        icon: 'ShoppingBag',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { id: 'health-category' },
      update: {},
      create: {
        id: 'health-category',
        name: 'Health & Fitness',
        color: '#F59E0B',
        icon: 'Heart',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { id: 'bills-category' },
      update: {},
      create: {
        id: 'bills-category',
        name: 'Bills & Utilities',
        color: '#6B7280',
        icon: 'Receipt',
        userId: user.id,
      },
    }),
  ])

  console.log('🏷️ Created categories:', categories.length)

  // Create sample expenses
  const now = new Date()
  const expenses = await Promise.all([
    // Today's expenses
    prisma.expense.create({
      data: {
        amount: 12.50,
        description: 'Coffee and pastry',
        date: now,
        categoryId: 'food-category',
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 8.00,
        description: 'Bus ticket',
        date: now,
        categoryId: 'transport-category',
        userId: user.id,
      },
    }),
    
    // Yesterday's expenses
    prisma.expense.create({
      data: {
        amount: 45.99,
        description: 'Grocery shopping',
        date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        categoryId: 'food-category',
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 15.00,
        description: 'Movie ticket',
        date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        categoryId: 'entertainment-category',
        userId: user.id,
      },
    }),
    
    // 2 days ago
    prisma.expense.create({
      data: {
        amount: 89.99,
        description: 'New running shoes',
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        categoryId: 'shopping-category',
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 25.00,
        description: 'Gym membership',
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        categoryId: 'health-category',
        userId: user.id,
      },
    }),
    
    // 3 days ago
    prisma.expense.create({
      data: {
        amount: 120.00,
        description: 'Electricity bill',
        date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        categoryId: 'bills-category',
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 32.50,
        description: 'Lunch with friends',
        date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        categoryId: 'food-category',
        userId: user.id,
      },
    }),
    
    // Last week
    prisma.expense.create({
      data: {
        amount: 67.89,
        description: 'Online shopping - electronics',
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        categoryId: 'shopping-category',
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 18.50,
        description: 'Taxi ride',
        date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        categoryId: 'transport-category',
        userId: user.id,
      },
    }),
  ])

  console.log('💰 Created expenses:', expenses.length)

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  console.log('💵 Total expense amount:', `$${totalAmount.toFixed(2)}`)

  console.log('✅ Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })