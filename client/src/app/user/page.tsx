
import React from 'react'
import UserList from './UserList'
import { Metadata } from 'next';
import Apptest from '../test2';


export const metadata: Metadata = {
  title: "Danh sách tài khoản người dùng",
  description: "Meet your friend without facing",
};

export default function UserPage() {
    return(
      <>
        <UserList/>
        {/* <Apptest/> */}
      </>
    )
}
