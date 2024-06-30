'use client'
import { useParams } from 'next/navigation'
import React from 'react'

export default function FriendIDPage() {
  const {friend_id} = useParams();
  return (
    <div>{friend_id}</div>
  )
}
