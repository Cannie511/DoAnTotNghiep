'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { Button } from './button'
import Image, { StaticImageData } from 'next/image'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

interface Props {
    srcImg: StaticImageData
}

export default function AvatarDropdown({srcImg}:Props) {
  const router = useRouter();
  const {theme, setTheme} = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
            <Image src={srcImg} width={32} height={32} alt=''/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={()=>router.push('/me')}>
          Tài khoản của tôi 
        </DropdownMenuItem>
        <DropdownMenuItem className='block md:hidden' onClick={theme === 'light' ? ()=>setTheme('dark'):()=>setTheme('light')}>
          Giao diện: {theme === 'light' ? 'Sáng':'Tối'}
        </DropdownMenuItem>
        <hr />
        <DropdownMenuItem >
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
