import React from 'react'
import Schedule from './Schedule'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title:'Lịch trình họp',
  description:'Login Page'
}

export default function SchedulePage() {
  return (
    <Schedule/>
  )
}
