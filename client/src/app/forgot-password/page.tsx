import NavLogin from '@/components/ui/login-navigation'
import { Metadata } from 'next'
import React from 'react'
import ForgotPassword from './ForgotPassword'

export const metadata: Metadata = {
  title:'Freet | Forgot password',
  description:'Forgot password Page'
}

export default function ForgotPassPage() {
  return (
    <>
        <NavLogin/>
        <ForgotPassword/>
    </>
  )
}
