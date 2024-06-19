import NavLogin from '@/components/ui/login-navigation'
import React from 'react'
import RegisterForm from './register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title:'Freet | Register',
  description:'Login Page'
}

export default function RegisterPage() {
  return (
    <div>
        <NavLogin/>
        <RegisterForm/>
    </div>
  )
}
