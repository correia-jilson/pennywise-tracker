import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PennyWise Tracker - Smart Expense Management',
  description: 'Track your expenses wisely with beautiful charts and intuitive category management.',
  keywords: ['expense tracker', 'personal finance', 'money management', 'budgeting'],
  authors: [{ name: 'PennyWise Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root">{children}</div>
        <div id="modal-root"></div>
      </body>
    </html>
  )
}