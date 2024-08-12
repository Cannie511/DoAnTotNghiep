import React from 'react'
import Profile from './Profile'
import { Metadata } from 'next';
import Apptest from '../test2';

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
