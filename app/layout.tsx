
import { Inter } from 'next/font/google'

import { ModalProvider } from '@/providers/modal-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import './globals.css'
import { redirect } from 'next/navigation'
import Provider from '@/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bookhub - Dashboard',
  description: 'E-Commerce Dashboard',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <ToastProvider />
          <ModalProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
