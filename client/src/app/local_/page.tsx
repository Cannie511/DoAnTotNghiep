'use client'
import { Button } from 'flowbite-react';
import { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import React from 'react'

// export const metadata: Metadata = {
//   title: "Freet.com",
//   description: "Meet your friend without facing",
// };

export default function Home() {
  const router = useRouter();
  return (
    <>
    <div>
      <h1 className="text-4xl">HOME</h1>
      <Button onClick={()=>router.prefetch('/user')}>click me</Button>
      </div>
    </>
  )
}
