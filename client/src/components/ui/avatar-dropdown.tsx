'use client'
import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { Button } from './button'

import Image, { StaticImageData } from 'next/image'
import { useTheme } from 'next-themes'

interface Props {
    srcImg: StaticImageData
}

export default function AvatarDropdown({srcImg}:Props) {
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
            <Image src={srcImg} width={32} height={32} alt=''/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem >
          Tài khoản của tôi 
        </DropdownMenuItem>
        <DropdownMenuItem >
          Dark
        </DropdownMenuItem>
        <hr />
        <DropdownMenuItem >
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
