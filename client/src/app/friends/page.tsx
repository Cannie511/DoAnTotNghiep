import React from 'react'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
const Friends = dynamic(()=>import("./Friends"),{
  loading: ()=><Skeleton className="w-full h-[80vh]"/>
})
export default function FriendPage() {
  return (
    <Friends/>
  )
}
