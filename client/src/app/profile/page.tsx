import React from 'react'
import Profile from './Profile'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Thông tin tài khoản",
  description: "Meet your friend without facing",
};

export default function MyProfile() {
  return (
    <div>
      <Profile/>
    </div>
  )
}
