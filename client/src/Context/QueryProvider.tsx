'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'

export default function QueryProvider({children}:{children:ReactNode}) {
    const QueryClientStore = new QueryClient()
  return (
    <QueryClientProvider client={QueryClientStore}>{children}</QueryClientProvider>
  )
}
